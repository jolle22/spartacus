import * as siteContextSelector from '../../../../helpers/site-context-selector';

// Slow test. Improve Execution in pipeline. 
describe('Language switch - my-account pages', () => {
  before(() => {
    cy.window().then((win) => win.sessionStorage.clear());
    cy.requireLoggedIn();
  });

  siteContextSelector.stub(
    siteContextSelector.LANGUAGE_REQUEST,
    siteContextSelector.LANGUAGES
  );
  siteContextSelector.stub(
    siteContextSelector.TITLE_REQUEST,
    siteContextSelector.TITLES
  );

  siteContextSelector.testLangSwitchOrderPage(false);
  siteContextSelector.testPersonalDetailsPage();
});
