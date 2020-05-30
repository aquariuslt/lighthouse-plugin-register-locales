import * as lighthouse from 'lighthouse';
import * as i18n from 'lighthouse/lighthouse-core/lib/i18n/i18n';
import * as defaultLocales from 'lighthouse/lighthouse-core/lib/i18n/locales';
import { getLocaleConfig } from '../shared.util';
import { cloneDeep } from 'lodash';

const Gatherer = lighthouse.Gatherer;

/**
 * @desc import this gatherer will overriding the locale/customize locale
 **/

export class RegisterLocaleGatherer extends Gatherer {
  constructor() {
    super();
  }

  private targetLocale;
  private targetLocaleDataSnapshot;

  async beforePass(passContext) {
    // 1. create default locale snapshot
    // 2. call i18n.registerLocaleData

    const { locale, localeData } = getLocaleConfig(passContext);
    this.targetLocale = locale;
    this.targetLocaleDataSnapshot = cloneDeep(defaultLocales[locale]);
    i18n.registerLocaleData(locale, localeData);
  }

  async afterPass(passContext) {
    // 3. revert snapshot if lhr is generated to clean next
    //    lh calling use default locale
    i18n.registerLocaleData(this.targetLocale, this.targetLocaleDataSnapshot);
    return {};
  }
}
