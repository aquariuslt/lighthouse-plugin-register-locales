import * as i18n from 'lighthouse/lighthouse-core/lib/i18n/i18n';

describe('plugin test', () => {
  it('# should ensure `i18n.registerLocalData` exists', () => {
    expect(i18n).toHaveProperty('registerLocaleData');
  });
});
