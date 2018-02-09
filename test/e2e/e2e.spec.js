const timeout = 5000;

describe('/ (Verdaccio Page)', () => {
    let page;

    beforeAll(async () => {
      page = await global.__BROWSER__.newPage();
      await page.goto('http://0.0.0.0:55558');
    }, timeout);

    afterAll(async () => {
      await page.close()
    });

    it('should load without error', async () => {
      let text = await page.evaluate(() => document.body.textContent);

      expect(text).toContain('adduser');
    })
  },
  timeout
);
