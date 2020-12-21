Feature('Menu');

Scenario('check if we find the npm commands to set the registry', (I) => {
  I.amOnPage('http://localhost:8080');
  I.waitForElement('#header--button-registryInfo', 5);
  I.click('#header--button-registryInfo');
  I.waitForElement('#registryInfo--dialog-container');
  I.see('npm set registry http://localhost:8080');
});
