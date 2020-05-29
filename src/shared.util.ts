import * as defaultLocales from 'lighthouse/lighthouse-core/lib/i18n/locales';

export const getLocaleConfig = (context) => {
  const locale = context.settings.locale;
  const registerLocales = context.settings.registerLocales || {};

  const targetLocaleData = Object.assign({}, defaultLocales[locale], registerLocales[locale]);

  return {
    locale,
    localeData: targetLocaleData,
  };
};
