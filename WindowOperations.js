require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { expect } = require('chai');
const forEach = require('mocha-each');



class WindowOperationsPage {
    constructor(driver) {
        this.driver = driver;

        this.newTabBtn = By.xpath("//button[contains(normalize-space(.),'New Tab')]");
        this.newWindowBtn = By.xpath("//button[contains(normalize-space(.),'New Window')]");
    }

    //  NEW TAB 
    async openNewTabAndAssert() {
        const driver = this.driver;

        const newTabBtn = await driver.wait(
            until.elementLocated(this.newTabBtn),
            10000,
            "New Tab button not found"
        );
        await driver.wait(until.elementIsVisible(newTabBtn), 5000);

        const beforeHandles = await driver.getAllWindowHandles();
        await newTabBtn.click();

        // Wait for new tab to appear
        const afterHandles = await driver.wait(async () => {
            const handles = await driver.getAllWindowHandles();
            return handles.length > beforeHandles.length ? handles : false;
        }, 10000, "New tab did not open in time");

        const newTabHandle = afterHandles[afterHandles.length - 1];

        // Switch to new tab
        await driver.switchTo().window(newTabHandle);

        // Assert page title
        const title = await driver.getTitle();
        assert.ok(title.length > 0, "Page title in new tab is EMPTY");

        // Optional: Go back if page has history
        try {
            await driver.navigate().back();
        } catch (e) {
            console.log("No history to go back on new tab");
        }

        // Switch back to original tab
        await driver.switchTo().window(beforeHandles[0]);

        // Optional: navigate again to confirm switching
        const mainTitle = await driver.getTitle();
        console.log("Back to main page title:", mainTitle);
    }

    //  NEW WINDOW 
    async openNewWindowAndAssert() {
        const driver = this.driver;

        const newWindowBtn = await driver.wait(
            until.elementLocated(this.newWindowBtn),
            10000,
            "New Window button not found"
        );
        await driver.wait(until.elementIsVisible(newWindowBtn), 5000);

        const beforeHandles = await driver.getAllWindowHandles();
        await newWindowBtn.click();

        // Wait for new window to appear
        const afterHandles = await driver.wait(async () => {
            const handles = await driver.getAllWindowHandles();
            return handles.length > beforeHandles.length ? handles : false;
        }, 10000, "New window did not open in time");

        const newWindowHandle = afterHandles[afterHandles.length - 1];

        // Switch to new window
        await driver.switchTo().window(newWindowHandle);

        // Assert page title
        const title = await driver.getTitle();
        assert.ok(title.length > 0, "Page title in new window is EMPTY");

      

        // Switch back to original window
        await driver.switchTo().window(beforeHandles[0]);

        // navigate again to confirm switching
        const mainTitle = await driver.getTitle();
        console.log("Back to main page title:", mainTitle);
    }
}

      //  MOCHA TESTS 
      describe("Window Operations - New Tab & New Window Navigation Tests", function () {
    this.timeout(40000);

    let driver;
    let page;

    before(async () => {
        driver = new Builder().forBrowser("chrome").build();
        await driver.get("https://practice-automation.com/window-operations/");
        page = new WindowOperationsPage(driver);
    });

    after(async () => {
        await driver.quit();
    });

    it("Should open NEW TAB, switch, assert and go back", async () => {
        await page.openNewTabAndAssert();
    });

    it("Should open NEW WINDOW, switch, assert and go back", async () => {
        await page.openNewWindowAndAssert();
    });
});










