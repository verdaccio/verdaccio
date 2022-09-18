export const credentials = { user: 'test', password: 'test' };

export const clickElement = async function (page, selector, options = { delay: 100 }) {
  const button = await page.$(selector);
  await button.focus();
  await button.click(options);
};

export const evaluateSignIn = async function (page, matchText = 'Login') {
  const text = await page.evaluate(() => {
    return document.querySelector('button[data-testid="header--button-login"]')?.textContent;
  });

  expect(text).toMatch(matchText);
};

export const getPackages = async function (page) {
  return await page.$$('.package-title');
};

export const logIn = async function (page) {
  await clickElement(page, 'div[data-testid="dialogContentLogin"]');
  const userInput = await page.$('#login--dialog-username');
  expect(userInput).not.toBeNull();
  const passInput = await page.$('#login--dialog-password');
  expect(passInput).not.toBeNull();
  await userInput.type(credentials.user, { delay: 100 });
  await passInput.type(credentials.password, { delay: 100 });
  await passInput.dispose();
  // click on log in
  const loginButton = await page.$('#login--dialog-button-submit');
  expect(loginButton).toBeDefined();
  await loginButton.focus();
  await loginButton.click({ delay: 100 });
  await page.waitForTimeout(500);
};
