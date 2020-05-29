import * as lighthouse from 'lighthouse';
import * as i18n from 'lighthouse/lighthouse-core/lib/i18n/i18n';
import * as defaultLocales from 'lighthouse/lighthouse-core/lib/i18n/locales';

const Audit = lighthouse.Audit;

/**
 * @desc import this audit will overriding the locale/customize locale
 **/

const AUDIT_ID = 'register-locale';
const AUDIT_TITLE = 'overriding locales';
const AUDIT_DESCRIPTION = 'provide ability for customize locales in results';
const AUDIT_FAILURE_TITLE = 'register locale data failed';

export const getLocaleConfig = (context) => {
  const locale = context.options.locale;

  const registerLocales = context.options.registerLocales || {};

  const targetLocaleData = Object.assign({}, defaultLocales[locale], registerLocales[locale]);

  return {
    locale,
    localeData: targetLocaleData,
  };
};

export class RegisterLocaleAudit extends Audit {
  static get meta() {
    return {
      id: AUDIT_ID,
      title: AUDIT_TITLE,
      description: AUDIT_DESCRIPTION,
      failureTitle: AUDIT_FAILURE_TITLE,
      requiredArtifacts: [],
    };
  }

  static async audit(artifacts, context) {
    // 1. get plugin options/config/locales from context
    // 2. execute `i18n.registerLocaleData(locale, messages)`

    const { locale, localeData } = getLocaleConfig(context);
    i18n.registerLocaleData(locale, localeData);

    return {
      score: 1,
      numericValue: 1,
    };
  }
}
