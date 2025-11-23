require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { expect } = require('chai');
const forEach = require('mocha-each');


class CalendarPage {
    constructor(driver) {
        this.driver = driver;
        this.url = "https://practice-automation.com/calendars/";
        this.dataInput = By.id("g1065-1-selectorenteradate");
        this.submitButton = By.css("button[type='submit']");
        this.errorMessage = By.css(".contact-form__error span[data-wp-text]");
        this.successMessage = By.id("contact-form-success-header");
        this.goBackButton = By.css(".go-back-message .link");
    }

    async open() {
        await this.driver.get(this.url);
    }

    async enterDate(date) {
        const input = await this.driver.findElement(this.dataInput);
        await input.clear();
        await input.sendKeys(date);
    }

    async submit() {
        await this.driver.findElement(this.submitButton).click();
    }

    async getErrorText() {
        try {
            const el = await this.driver.wait(until.elementLocated(this.errorMessage), 2000);
            return await el.getText();
        } catch {
            return null;
        }
    }

   async isSuccessVisible() {
    try {
        const el = await this.driver.wait(
         until.elementLocated(this.successMessage),
            2000
        );
     await this.driver.wait(until.elementIsVisible(el), 2000); 
        return true;
    } catch {
        return false;
    }
}


  async clickGoBack() {
    const el = await this.driver.wait(
     until.elementLocated(this.goBackButton),
        2000
    );
    await this.driver.wait(until.elementIsVisible(el), 2000);
    await this.driver.wait(until.elementIsEnabled(el), 2000);
    await el.click();
}

 async getDateValue() {
    const input = await this.driver.wait(
        until.elementLocated(this.dataInput),
        2000
    );
    return await input.getAttribute("value");
}
}
   // MOCHA TEST RUNNER

describe("Calendar Form Tests", function () {
    this.timeout(30000);

    let driver;
    let page;

    before(async () => {
        driver = await new Builder().forBrowser("chrome").build();
        page = new CalendarPage(driver);
    });

    afterEach(async () => {
        await driver.manage().deleteAllCookies();
    });

    after(async () => {
        await driver.quit();
    });

    it("should load form elements", async () => {
        await page.open();
        expect(await driver.findElement(page.dataInput).isDisplayed()).to.be.true;
        expect(await driver.findElement(page.submitButton).isDisplayed()).to.be.true;
    });

    it("should show error on empty submit", async () => {
        await page.open();
        await page.submit();
        const err = await page.getErrorText();
        expect(err).to.include("Please fill out the form correctly.");
    });

    it("should show error on invalid date", async () => {
        await page.open();
        await page.enterDate("12/24/2024");
        await page.submit();
        const err = await page.getErrorText();
        expect(err).to.include("Please fill out the form correctly.");
    });

    it("should accept a valid date", async () => {
        await page.open();
        await page.enterDate("2024-12-24");
        await page.submit();
        const success = await page.isSuccessVisible();
        expect(success).to.be.true;
    });

    it("should reset input after Go Back", async () => {
        await page.open();
        await page.enterDate("2024-12-24");
        await page.submit();
        await page.clickGoBack();
        const value = await page.getDateValue();
        expect(value).to.equal("");
    });
});
