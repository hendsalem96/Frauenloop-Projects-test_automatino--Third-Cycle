require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require('chai');
const forEach = require('mocha-each');

class CalculatorTests {
  constructor(driver) {
    this.driver = driver;
    this.url = "https://testpages.eviltester.com/apps/calculator-api/form-calculator/";
  }

  async open() {
    await this.driver.get(this.url);
    await this.driver.wait(until.elementLocated(By.id('number1')), 3000);
  }

  async calculate(a, b, op) {
    const driver = this.driver;

    if (a === '' || b === '' || isNaN(a) || isNaN(b)) {
      return 'ERR';
    }

    const number1 = await driver.findElement(By.id('number1'));
    const number2 = await driver.findElement(By.id('number2'));

    await number1.clear();
    await number1.sendKeys(String(a));

    await number2.clear();
    await number2.sendKeys(String(b));

    const selectOp = await driver.findElement(By.id('operation'));
    await selectOp.sendKeys(op);

    await driver.findElement(By.id('calculate')).click();

      const resultElem = await this.driver.wait(
      until.elementLocated(By.id('answer')),
      
    );
    const text = await resultElem.getText();
    const match = text.match(/Answer\s*[:\-]\s*(.*)/);
    return match ? match[1].trim() : text.trim();
  }
}

describe("Calculator API Tests", function () {

  let driver;
  let calc;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    calc = new CalculatorTests(driver);
  });

  after(async () => {
    await driver.quit();
  });
   const testCases = [
    [55, 43, 'plus', '98'],
    [55, 43, 'minus', '12'],
    [55, 43, 'times', '2365'],
    [55, 43, 'divide', '1.27907'],
    [-40, -60, 'plus', '-100'],
    [100, -4, 'divide', '-25'],
    [0.5, 0.1, 'plus', '0.6'],
    ['', '', 'plus', 'ERR'],
    ['A', 'B', 'plus', 'ERR'],
  ];

  testCases.forEach(([a, b, op, expected]) => {
    it(`should calculate ${a} ${op} ${b} = ${expected}`, async () => {
      await calc.open();
      const result = await calc.calculate(a, b, op);
      expect(result).to.equal(expected);
    });
  });
});


    




