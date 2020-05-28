import * as lighthouse from 'lighthouse';

const Audit = lighthouse.Audit;

/**
 * @desc import this audit will overriding the locale/customize locale
 **/

const AUDIT_ID = 'register-locale';
const AUDIT_TITLE = 'overriding locales';
const AUDIT_DESCRIPTION = 'provide ability for customize locales in results';
const AUDIT_FAILURE_TITLE = 'register local data failed';

export = class RegisterLocaleAudit extends Audit {
  static get meta() {
    return {
      id: AUDIT_ID,
      title: AUDIT_TITLE,
      description: AUDIT_DESCRIPTION,
      failureTitle: AUDIT_FAILURE_TITLE,
    };
  }

  static async audit(artifacts, context) {
    // TODO:
    // 1. get plugin options/config/locales from context
    // 2. execute `i18n.registerLocaleData(locale, messages)`

    return {
      score: 1,
      numericValue: 1,
    };
  }
};
