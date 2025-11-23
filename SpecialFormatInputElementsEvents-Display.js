require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver");
const assert = require("assert");
const { expect } = require('chai');
const forEach = require('mocha-each');
const path = require("path");


class SpecialFormatPage {
    constructor(driver) {
        this.driver = driver;
        this.url = "https://testpages.eviltester.com/pages/input-elements/special-formats/";
    }

    async open() {
        await this.driver.get(this.url);
    }

    input(id) {
        return this.driver.findElement(By.id(id));
    }

    spanValue(id) {
        return this.driver.findElement(By.id(id));
    }

  async setValue(inputId, value) {
    const el = await this.input(inputId);
    await this.driver.executeScript("arguments[0].scrollIntoView(true);", el);

    if (["color-input", "date-input", "datetime-local-input", "month-input", "week-input", "date-input-min-max"].includes(inputId)) {
        await this.driver.executeScript(
        "arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event('input')); arguments[0].dispatchEvent(new Event('change'));",
        el, value
        );
    } else {
        await el.clear();
        await el.sendKeys(value);
    }
}


    async getSpanText(spanId) {
        const el = await this.spanValue(spanId);
        return await el.getText();
    }

    async elementExists(id) {
        try {
            const el = await this.driver.wait(until.elementLocated(By.id(id)), 2000);
            return await el.isDisplayed();
        } catch {
            return false;
        }
    }
}

describe("Special Format Inputs Tests", function() {
    this.timeout(60000);
    let driver;
    let page;

    beforeEach(async () => {
        driver = await new Builder().forBrowser("chrome").build();
        page = new SpecialFormatPage(driver);
        await page.open();
    });

    afterEach(async () => {
        await driver.quit();
    });

    it("should have all input elements visible", async () => {
        const ids = [
            "color-input",
            "file-input",
            "datetime-local-input",
            "date-input",
            "month-input",
            "week-input",
            "time-input",
            "date-input-min-max"
        ];
        for (let id of ids) {
            expect(await page.elementExists(id)).to.be.true;
        }
    });

    it("should set color input", async () => {
        await page.setValue("color-input", "#ff0000");
        const value = await page.getSpanText("color-input-value-value");
        expect(value).to.equal("#ff0000");
    });

    it("should set file input", async () => {
        const filePath = path.resolve("/Users/hend/Downloads/2_functional-tests hend.txt");
        await page.setValue("file-input", filePath);
        const value = await page.getSpanText("file-input-value-value");
        expect(value).to.include("2_functional-tests hend.txt");
    });

    it("should set date input", async () => {
        await page.setValue("date-input", "2025-11-23");
        const value = await page.getSpanText("date-input-value-value");
        expect(value).to.equal("2025-11-23");
    });

    it("should set datetime-local input", async () => {
        await page.setValue("datetime-local-input", "2025-11-23T14:30");
        const value = await page.getSpanText("datetime-local-input-value-value");
        expect(value).to.equal("2025-11-23T14:30");
    });

    it("should set month input", async () => {
        await page.setValue("month-input", "2025-11");
        const value = await page.getSpanText("month-input-value-value");
        expect(value).to.equal("2025-11");
    });

    it("should set week input", async () => {
        await page.setValue("week-input", "2025-W48");
        const value = await page.getSpanText("week-input-value-value");
        expect(value).to.equal("2025-W48");
    });

    it("should set time input", async () => {
        await page.setValue("time-input", "14:30");
        const value = await page.getSpanText("time-input-value-value");
        expect(value).to.equal("14:30");
    });

    it("should set date input with min/max", async () => {
        await page.setValue("date-input-min-max", "2025-12-01");
        const value = await page.getSpanText("date-input-min-max-value-value");
        expect(value).to.equal("2025-12-01");
    });
});