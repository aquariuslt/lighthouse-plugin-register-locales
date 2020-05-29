import * as Config from 'lighthouse/lighthouse-core/config/config';
import * as getPort from 'get-port';
import * as lighthouse from 'lighthouse/lighthouse-core';
import * as log from 'lighthouse-logger';
import * as puppeteer from 'puppeteer';
import { createTestStaticServer, getTestURL } from './__helpers__/static-page.helper';
import * as chromeLauncher from 'chrome-launcher';
import { RegisterLocaleGatherer } from '../gatherers/register-locale.gatherer';

const CORE_CHROME_FLAGS = ['--headless', '--disable-gpu'];
const DELAY_SHUTDOWN_CHROME_MS = 3000;

describe('register-locale gatherer', () => {
  it('# should override locale message for spec one rule', async (done) => {
    jest.setTimeout(20000);

    const port = await getPort();
    await createTestStaticServer(`normal`, port);
    const url = getTestURL(port);

    const lhConfig = new Config({
      extends: 'lighthouse:default',
      settings: {
        locale: 'zh',
        registerLocales: [
          {
            zh: {
              'lighthouse-core/audits/accessibility/accesskeys.js | description': {
                message: 'This is a CN locale',
              },
            },
          },
        ],
      },
      passes: [
        {
          passName: 'defaultPass',
          recordTrace: true,
          loadFailureMode: 'ignore',
          gatherers: [new RegisterLocaleGatherer()],
        },
      ],
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

    const result = await lighthouse(url, lhOptions, lhConfig);

    await shutdownChrome();
    done();
  });
});
