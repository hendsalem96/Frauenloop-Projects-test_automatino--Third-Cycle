require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { expect } = require('chai');
const forEach = require('mocha-each');

class TrianglePage {
  constructor() {
    this.driver = new Builder().forBrowser('chrome').build();
  }

  async open() {
    await this.driver.get('https://testpages.eviltester.com/apps/triangle/');
  }

  async close() {
    await this.driver.quit();
  }

  async setSides(a, b, c) {
    await this.driver.findElement(By.id('side1')).clear();
    await this.driver.findElement(By.id('side1')).sendKeys(a);

    await this.driver.findElement(By.id('side2')).clear();
    await this.driver.findElement(By.id('side2')).sendKeys(b);

    await this.driver.findElement(By.id('side3')).clear();
    await this.driver.findElement(By.id('side3')).sendKeys(c);
  }

  async submit() {
    const button = await this.driver.wait(
      until.elementLocated(By.id('identify-triangle-action')),
   
    );

    await this.driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", button);
    await this.driver.sleep(500);

    try {
      await button.click();
    } catch (e) {
      await this.driver.executeScript("arguments[0].click();", button);
    }
  }

  async getResultText() {
    const result = await this.driver.wait(
      until.elementLocated(By.id('triangle-type')),
     
    );
    return (await result.getText()).toLowerCase();
  }
}

describe('Triangle app - simple tests', function () {
  this.timeout(0);
  let page;

  before(async function () {
    page = new TrianglePage();
  });

  after(async function () {
    await page.close();
  });

  const testCases = [
    [5, 5, 5, 'equilateral'],
    [5, 5, 3, 'isosceles'],
    [3, 4, 5, 'scalene'],
    [1, 2, 3, 'not a triangle']
  ];

  testCases.forEach(([a, b, c, expected]) => {
    it(`Testing sides ${a}, ${b}, ${c} & expecting: ${expected}`, async function () {
      await page.open();
      await page.setSides(a, b, c);
      await page.submit();
      const resultText = await page.getResultText();
      expect(resultText).to.include(expected);
    });
  });
});