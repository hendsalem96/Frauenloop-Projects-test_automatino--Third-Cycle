require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { expect } = require('chai');
const forEach = require('mocha-each');


class CalendarPage {
    driver = new Builder().forBrowser("chrome").build();
    constructor() {
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

    async close() {
        await this.driver.quit()
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

    async isDataInputVisible() {
        return await this.driver.findElement(this.dataInput).isDisplayed();
    }

    async isSubmitButtonVisible() {
        return await this.driver.findElement(this.submitButton).isDisplayed();
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

    let page;

    beforeEach(async () => {
        
        page = new CalendarPage();
    });

    afterEach(async () => {
        await page.close();
    });

    it("should load form elements", async () => {
        await page.open();
        expect(await page.isDataInputVisible()).to.be.true;
        expect(await page.isSubmitButtonVisible()).to.be.true;
    });

    it("should show error when submitting empty form", async () => {
        await page.open();
        await page.submit();
        const error = await page.getErrorText();
        expect(error).to.include("Please fill out the form correctly.");
    });

    it("should show error for invalid date format", async () => {
        await page.open();
        await page.enterDate("12/24/2024");
        await page.submit();
        const error = await page.getErrorText();
        expect(error).to.include("Please fill out the form correctly.");
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

