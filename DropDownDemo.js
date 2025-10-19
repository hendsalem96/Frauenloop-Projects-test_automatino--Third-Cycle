require('chromedriver');
const { Builder, By, until,Select } = require("selenium-webdriver");
const chai = require("chai");
const expect = chai.expect;

async function selectDropdownDemo() {
  let driver = await new Builder().forBrowser('chrome').build();

  try {
  
    await driver.get('https://yekoshy.github.io/Dropdown/select_demo.html');

   
    const selectElement = await driver.findElement(By.id('day-select'))
    
    

  
    const select = new Select(selectElement);

    await select.selectByVisibleText('Wednesday');

    const selectedOption = await select.getFirstSelectedOption();
    const selectedText = await selectedOption.getText();

   
    expect(selectedText).to.equal('Wednesday');
    console.log(' Test Passed: Wednesday is selected successfully.');
  } catch (error) {
    console.error(' Test Failed:', error);
  } finally {
    await driver.quit();
  }
}

selectDropdownDemo();
