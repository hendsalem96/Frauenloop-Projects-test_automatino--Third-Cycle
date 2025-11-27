require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require('chai');

class TrianglePage {
  constructor(driver) {
    this.driver = driver;

    // Locators
    this.side1Input = By.id('side1');
    this.side2Input = By.id('side2');
    this.side3Input = By.id('side3');
    this.submitButton = By.id('identify-triangle-action');
    this.resultText = By.id('triangle-type');
    this.url = 'https://testpages.eviltester.com/apps/triangle/';
  }

  async open() {
    await this.driver.get(this.url);
  }

  async close() {
    await this.driver.quit();
  }

  async setSide(locator, value) {
    const element = await this.driver.findElement(locator);
    await element.clear();
    await element.sendKeys(value);
  }

  async setSides(a, b, c) {
    await this.setSide(this.side1Input, a);
    await this.setSide(this.side2Input, b);
    await this.setSide(this.side3Input, c);
  }

  async clickElement(locator) {
    const element = await this.driver.wait(
      until.elementLocated(locator),
      5000
    );
    await this.driver.wait(until.elementIsVisible(element), 5000);
    await this.driver.executeScript(
      "arguments[0].scrollIntoView({block: 'center'});",
      element
    );

    // Prefer normal click, fall back to JS click.
    try {
      await element.click();
    } catch (e) {
      await this.driver.executeScript("arguments[0].click();", element);
    }
  }

  async submit() {
    await this.clickElement(this.submitButton);
  }

  async getResultText() {
    const result = await this.driver.wait(
      until.elementLocated(this.resultText),
      5000
    );
    await this.driver.wait(async () => {
      const text = await result.getText();
      return text && text.trim().length > 0;
    }, 5000);
    return (await result.getText()).toLowerCase();
  }
}

describe('Triangle app - simple tests', function () {
  
  this.timeout(0);

  let driver;
  let page;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    page = new TrianglePage(driver);
  });

  beforeEach(async function () {
    await page.open();
  });

  after(async function () {
    await page.close();
  });

  const testCases = [
    // Basic types
    [5, 5, 5, 'equilateral'],
    [5, 5, 3, 'isosceles'],
    [3, 4, 5, 'scalene'],

  // Boundary / minimal valid triangle
  [1, 1, 1, 'equilateral'],
  [2, 2, 3, 'isosceles'],
  [2, 3, 4, 'scalene'],

  // Triangle inequality edge cases
  [2, 3, 5, 'not a triangle'],
  [2, 3, 6, 'not a triangle'],
  [10, 1, 1, 'not a triangle'],
  // Zero and negative values (invalid)
  [0, 0, 0, 'not a triangle'],
  [0, 5, 5, 'not a triangle'],
  [-1, 5, 5, 'not a triangle'],
  [5, -1, 5, 'not a triangle'],
  [5, 5, -1, 'not a triangle'],

  // Large values to test numeric handling
  [1000000, 1000000, 1000000, 'equilateral'],
  [999999, 1000000, 1000000, 'isosceles'],
  [999998, 999999, 1000000, 'scalene'],

  ];

  testCases.forEach(([a, b, c, expected]) => {
    it(`Testing sides ${a}, ${b}, ${c} & expecting: ${expected}`, async function () {
      await page.setSides(a, b, c);
      await page.submit();
      const resultText = await page.getResultText();
      expect(resultText).to.include(expected);
    });
  });
});
