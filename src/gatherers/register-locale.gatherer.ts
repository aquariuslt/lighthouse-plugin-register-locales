import * as lighthouse from 'lighthouse';
import * as i18n from 'lighthouse/lighthouse-core/lib/i18n/i18n';
import { getLocaleConfig } from '../shared.util';

const Gatherer = lighthouse.Gatherer;

/**
 * @desc import this gatherer will overriding the locale/customize locale
 **/

export class RegisterLocaleGatherer extends Gatherer {
  constructor() {
    super();
  }

  async beforePass(passContext) {
    // 1. create default locale snapshot
    // 2. call i18n.registerLocaleData

    const { locale, localeData } = getLocaleConfig(passContext);
    i18n.registerLocaleData(locale, localeData);
  }

  async afterPass(passContext) {
    // 3. revert snapshot if lhr is generated to clean next
    //    lh calling use default locale
    return {};
  }
}
