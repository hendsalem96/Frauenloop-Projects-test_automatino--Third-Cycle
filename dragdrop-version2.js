require('chromedriver');
const { Builder, By, Key } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class DragDropPage {
  constructor(driver) {
    this.driver = driver;
    this.sortableItems = By.css('[data-test^="sortable-item-"]');
  }

  async open() {
    await this.driver.get(
      "https://moatazeldebsy.github.io/test-automation-practices/?#/drag-drop"
    );

    // wait until sortable items are loaded
    await this.driver.wait(
      async () => {
        const items = await this.driver.findElements(this.sortableItems);
        return items.length > 0;
      },
      1000,
      "Sortable items did not load in time"
    );

    await sleep(500);
  }

  async getItems() {
    return await this.driver.findElements(this.sortableItems);
  }

  async getDragHandle(name) {
    return await this.driver.findElement(
      By.css(`[data-test="drag-handle-${name}"]`)
    );
  }

  async getText(element) {
    return await element.getText();
  }

  // keyboard drag using Space + ArrowUp + Space
  async dragWithKeyboard(handle, steps = 1) {
    await handle.click();           
    await handle.sendKeys(Key.SPACE);
    await sleep(200);

    for (let i = 0; i < steps; i++) {
      await handle.sendKeys(Key.ARROW_UP);
      await sleep(300);           
    }

    await handle.sendKeys(Key.SPACE); // drop
    await sleep(500);
  }
}

describe("Drag & Drop Tests - React Keyboard", function () {
  this.timeout(0);

  let driver;
  let page;

  before(async () => {
    const options = new chrome.Options();
    options.addArguments("--disable-gpu");
    options.addArguments("--window-size=1920,1080");

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    page = new DragDropPage(driver);
    await page.open();
  });

  after(async () => {
    await sleep(3000);
    if (driver) await driver.quit();
  });

  it("should drag all items to the top sequentially using keyboard", async () => {
    const items = await page.getItems();

    for (let i = items.length - 1; i >= 0; i--) {
      const currentItems = await page.getItems();
      const itemName = await page.getText(currentItems[i]);
      const handle = await page.getDragHandle(itemName);

      const steps = i;
      await page.dragWithKeyboard(handle, steps);

      // get updated list
      const afterItems = await page.getItems();
      const afterNames = [];
      for (let el of afterItems) {
        afterNames.push(await page.getText(el));
      }

      expect(afterNames[0]).to.equal(itemName);
      console.log(`"${itemName}" moved to top successfully with keyboard`);

      await sleep(500);
    }
  });
});