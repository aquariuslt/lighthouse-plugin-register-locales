import * as _ from 'lodash';
import * as Config from 'lighthouse/lighthouse-core/config/config';
import * as getPort from 'get-port';
import * as lighthouse from 'lighthouse/lighthouse-core';
import * as defaultLocales from 'lighthouse/lighthouse-core/lib/i18n/locales';
import { createTestStaticServer, getTestURL } from './__helpers__/static-page.helper';
import { RegisterLocaleGatherer } from '../gatherers/register-locale.gatherer';
import { launchChrome, shutdownChrome } from './__helpers__/chrome.helper';

describe('register-locale gatherer', () => {
  it('# should override locale message for spec one rule', async (done) => {
    jest.setTimeout(20000);

    const port = await getPort();
    const server = await createTestStaticServer(`normal`, port);
    const url = getTestURL(port);

    const OVERRIDE_MESSAGE_CONTENT = 'This is a CN locale';

    const lhConfig = new Config({
      extends: 'lighthouse:default',
      settings: {
        locale: 'zh',
        registerLocales: {
          'lighthouse-core/audits/accessibility/accesskeys.js | description': {
            message: OVERRIDE_MESSAGE_CONTENT,
          },
        },
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

    const chrome = await launchChrome();
    const lhOptions = {
      port: chrome.port,
      enableErrorReporting: true,
    };

    const result = await lighthouse(url, lhOptions, lhConfig);

    expect(_.get(result, 'lhr')).not.toBeUndefined();
    expect(_.get(result, 'lhr.audits.accesskeys.description')).toEqual(OVERRIDE_MESSAGE_CONTENT);

    await shutdownChrome(chrome);
    await server.close();
    done();
  });
});
