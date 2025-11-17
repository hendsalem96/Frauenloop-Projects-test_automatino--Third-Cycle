require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const { expect } = require('chai');
const assert = require('assert');
const forEach = require('mocha-each');


describe('Keyboard Event Button Tests – Data-Driven', function () {
  this.timeout(0);
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  const testCases = [
    ['onkeydown', null, 'a', true, 'keydown'],
    ['onkeyup', 'onkeyupstatus', 'a', false, 'keyup'],
    ['onkeypress', 'onkeypressstatus', 'a', false, 'keypress']
  ];

  // Reusable function
  async function testKeyEvent(buttonId, statusId, key = 'a', checkColor = false) {
    await driver.get('https://testpages.eviltester.com/pages/interaction/javascript-events/');

    const btn = await driver.findElement(By.id(buttonId));
    const status = statusId ? await driver.findElement(By.id(statusId)) : null;

    let beforeColor;
    if (checkColor) {
      beforeColor = await btn.getCssValue('background-color');
    }

    // Scroll and click to focus
    await driver.executeScript('arguments[0].scrollIntoView(true);', btn);
    await driver.sleep(300);
    await btn.click();

    // Trigger key events
    await driver.actions().keyDown(key).keyUp(key).perform();
    await driver.sleep(300);

    // Assert status text 
    if (status) {
      const text = await status.getText();
      assert.ok(text.trim().length > 0, `Status text not updated for ${buttonId}`);
    }

    // Assert color change 
    if (checkColor) {
      const afterColor = await btn.getCssValue('background-color');
      assert.notStrictEqual(afterColor, beforeColor, `Background color did not change for ${buttonId}`);
   console.log(afterColor)
    }
  }

  // Run each test case dynamically using mocha-each
  forEach(testCases)
    .it('should trigger %s event correctly for button %s', async (buttonId, statusId, key, checkColor, eventName) => {
      await testKeyEvent(buttonId, statusId, key, checkColor);
    });
});
