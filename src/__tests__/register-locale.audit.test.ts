import * as Config from 'lighthouse/lighthouse-core/config/config';
import * as lighthouse from 'lighthouse/lighthouse-core';
import * as log from 'lighthouse-logger';
import * as puppeteer from 'puppeteer';
import * as chromeLauncher from 'chrome-launcher';
import * as i18n from 'lighthouse/lighthouse-core/lib/i18n/i18n';
import * as getPort from 'get-port';
import { RegisterLocaleAudit } from '../audits/register-locale.audit';
import { createTestStaticServer, getTestURL } from './__fixtures__/__helpers__/static-page.helper';

const CORE_CHROME_FLAGS = ['--headless', '--disable-gpu'];
const DELAY_SHUTDOWN_CHROME_MS = 3000;

describe('register-locale audit', () => {
  it('# should ensure `i18n.registerLocalData` exists', () => {
    expect(i18n).toHaveProperty('registerLocaleData');
  });

  it('# should audits loaded', () => {
    const baseConfig = {
      extends: 'lighthouse:default',
    };

    const allConfig = {
      ...baseConfig,
      audits: [RegisterLocaleAudit],
    };

    const defaultLhConfig = new Config(baseConfig);
    const lhConfig = new Config(allConfig);

    expect(lhConfig.audits.length).toBeGreaterThan(defaultLhConfig.audits.length);
  });

  it('# should override locale message for spec one rule', async (done) => {
    jest.setTimeout(20000);

    const port = await getPort();
    await createTestStaticServer(`normal`, port);
    const url = getTestURL(port);

    const lhConfig = new Config({
      extends: 'lighthouse:default',
      settings: {
        locale: 'en-US',
      },
      options: {
        registerLocales: [
          {
            'zh-JB': {
              'lighthouse-core/audits/accessibility/accesskeys.js | description': {
                message: 'This is a JB',
              },
            },
          },
        ],
      },
      audits: [RegisterLocaleAudit],
    });

    const chromeLaunchOptions = {
      chromePath: process.env.CHROME_PATH || puppeteer.executablePath(),
      chromeFlags: CORE_CHROME_FLAGS,
    };
    const chrome = await chromeLauncher.launch(chromeLaunchOptions);
    const lhOptions = {
      port: chrome.port,
      enableErrorReporting: true,
    };

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const shutdownChrome = async () => {
      await sleep(DELAY_SHUTDOWN_CHROME_MS);
      try {
        await chrome.kill();
        log.log(`Chromium killed`);
      } catch (e) {
        log.error(`Kill Chromium failed with pid ${chrome.pid}`);
        throw e;
      }
    };

    const lhr = await lighthouse(url, lhOptions, lhConfig);

    await shutdownChrome();
    done();
  });
});
