require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");



class TriangleTester {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://testpages.eviltester.com/styled/apps/triangle/triangle001.html';
  }

  async open() {
    await this.driver.get(this.url);
  }

  async setSides(a, b, c) {
    const side1 = await this.driver.findElement(By.id('side1'));
    const side2 = await this.driver.findElement(By.id('side2'));
    const side3 = await this.driver.findElement(By.id('side3'));

    await side1.clear();
    await side2.clear();
    await side3.clear();

    await side1.sendKeys(String(a));
    await side2.sendKeys(String(b));
    await side3.sendKeys(String(c));
  }

   async clickIdentify() {
    const button = await this.driver.findElement(By.id('identify-triangle-action'));
    await button.click();
  }

  async getResultText() {
    const result = await this.driver.wait(
      until.elementLocated(By.id('triangle-type')),
      2000
    );
    return await result.getText();
  }

  async runTest(a, b, c, expected) {
    await this.open();
    await this.setSides(a, b, c);
    await this.clickIdentify();

    const actualResult = await this.getResultText();
    const pass = actualResult.trim() === expected.trim();

    console.log(
      `Input: (${a}, ${b}, ${c}) → Expected: "${expected}", Got: "${actualResult}" => ${pass ? ' PASS' : 'FAIL'}`
    );
    return pass;
  }
}

async function main() {
  const driver = await new Builder().forBrowser('chrome').build();
  const tester = new TriangleTester(driver);

  const testCases = [
    [5, 5, 5, 'Equilateral'],
    [3, 4, 5, 'Scalene'],
    [5, 5, 8, 'Isosceles'],
    [1, 2, 3, 'Error: Not a Triangle'],
    [4, 'e', 6, 'Error: Side 2 is not a Number'],
    ['%', 3, 4, 'Error: Side 1 is not a Number'],
  ];

  try {
    for (const [a, b, c, expected] of testCases) {
      await tester.runTest(a, b, c, expected);
    }
  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await driver.quit();
  }
}

main();
