require('chromedriver');
const { Builder, By, until } = require('selenium-webdriver');
const chai = require('chai');
const expect = chai.expect;
const { assert } = require('chai');

class CalculatorTester {
  constructor(driver) {
    this.driver = driver;
    this.url = 'https://testpages.eviltester.com/styled/calculator';
  }

  async open() {
    await this.driver.get(this.url);
  }

  async setNumbers(num1, num2) {
    const number1Field = await this.driver.findElement(By.id('number1'));
    const number2Field = await this.driver.findElement(By.id('number2'));

    await number1Field.clear();
    await number2Field.clear();

    if (num1 !== undefined && num1 !== null) {
      await number1Field.sendKeys(String(num1));
    }
    if (num2 !== undefined && num2 !== null) {
      await number2Field.sendKeys(String(num2));
        }
  }

  async setOperation(op) {
    try {
      const select = await this.driver.findElement(By.id('function'));
      await select.findElement(By.css(`option[value="${op}"]`)).click();
    } catch (err) {
      console.error('Could not select operation:', err.message);
    }
  }

  async clickCalculate() {
    await this.driver.sleep(100)
    const button = await this.driver.findElement(By.id('calculate'));
    await button.click();
    await this.driver.sleep(100)
  }

  async getResult() {
    const resultElem = await this.driver.wait(
      until.elementLocated(By.id('answer')),
      
    );
    const text = await resultElem.getText();
    const match = text.match(/Answer\s*[:\-]\s*(.*)/);
    return match ? match[1].trim() : text.trim();
  }

  async runTest(a, b, op, expected) {
    await this.open();
    await this.setNumbers(a, b);
    await this.setOperation(op);

    await this.clickCalculate();

    const actual = await this.getResult();

    console.log(`Test: ${a} ${op} ${b} → Got: ${actual}, Expected: ${expected} ${actual == expected ? '✅' : '❌'}`);

      assert.strictEqual(actual, String(expected), `Expected ${expected} but got ${actual}`);

  }
}

async function main() {
  const driver = await new Builder().forBrowser('chrome').build();
  const tester = new CalculatorTester(driver);

  const tests = [
    [55, 43, 'plus', '98'],
    [55, 43, 'minus', '12'],
    [55, 43, 'times', '2365'],
    [55, 43, 'divide', '1.27907'],
    [-40, -60, 'plus', '-100'],
    [100, -4, 'divide', '-25'],
    [0.5, 0.1, 'plus', '0.6'],
    ['', '', 'plus', 'ERR'],
    ['A', 'B', 'plus', 'ERR']
  ];

  try {
    for (const [a, b, op, expected] of tests) {
      await tester.runTest(a, b, op, expected);
    }
  } catch (err) {
    console.error('Test failed:', err.message);
  } finally {
    await driver.quit();
  }
}

main();
