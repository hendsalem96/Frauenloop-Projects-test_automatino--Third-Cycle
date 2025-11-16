require('chromedriver');
const { Builder, By } = require("selenium-webdriver");
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
      10000,
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

  // drag & drop using Selenium Actions 
  async dragAndDrop(handle, target) {
    const actions = this.driver.actions({ bridge: true });

    // press
    await actions.move({ origin: handle }).press().perform();
    await sleep(300);

    // move vertically above target 
    await actions.move({ origin: target, x: 0, y: -50 }).perform();
    await sleep(500); 

    // release
    await actions.release().perform();
    await sleep(500); 
  }
}

describe("Drag & Drop Tests - React-friendly Actions with vertical offset", function () {
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

  it("should drag all items to the top sequentially with visible delays", async () => {
    const items = await page.getItems();

   
    for (let i = items.length - 1; i >= 0; i--) {
      const currentItems = await page.getItems();
      const itemName = await page.getText(currentItems[i]);
      const handle = await page.getDragHandle(itemName);
      const target = currentItems[0]; // drag to top

      await page.dragAndDrop(handle, target);

      // get updated list after drag
      const afterItems = await page.getItems();
      const afterNames = [];
      for (let el of afterItems) {
        afterNames.push(await page.getText(el));
      }

      expect(afterNames[0]).to.equal(itemName);
      console.log(`"${itemName}" dragged successfully`);

      await sleep(1000); 
    }
  });
});
