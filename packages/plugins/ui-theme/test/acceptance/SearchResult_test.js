Feature('SearchResult');

Scenario('check if we get the "no results found" text', (I) => {
  I.amOnPage('http://localhost:8080');
  I.seeElement('header .react-autosuggest__input input');
  I.fillField('header .react-autosuggest__input input', 'test');
  I.waitForElement('header .react-autosuggest__suggestions-container');
  I.wait(1);
  I.see('No results found.', 'header .react-autosuggest__suggestions-container');
});
