const {Builder, By, until} = require('selenium-webdriver');
const assert = require('assert');

async function runTests() {
    let driver = await new Builder().forBrowser('chrome').build();
    try {
        await driver.get("https://testpages.eviltester.com/styled/apps/7charval/simple7charvalidation.html");

        // reusable function
        async function testValue(input, expectedMessage) {
            const inputBox = await driver.findElement(By.id("title"));
            const submitBtn = await driver.findElement(By.id("validate"));
            const message = await driver.findElement(By.id("validation_message"));

            await inputBox.clear();
            await inputBox.sendKeys(input);
            await submitBtn.click();

            await driver.wait(until.elementTextIs(message, expectedMessage), 2000);

            const actualResult = await message.getText();
            console.log(`Expected: "${expectedMessage}", Got: "${actualResult}"`);
            assert.strictEqual(actualResult, expectedMessage);
        }

        // run all test cases
        await testValue("9999999", "Valid Value");
        await testValue("#$%^#", "invalid value");
        await testValue("hendd**", "Valid Value");
        await testValue("AHYEDIO", "Valid Value");
        await testValue("jdtegdj", "Valid Value");
        await testValue("3705490", "Valid Value");
        await testValue("ASHFbnj", "Valid Value");
        await testValue("hye76BG", "Valid Value");
        await testValue("23BgbG*", "Valid Value");
        await testValue("gyr$%8N", "invalid value");
        await testValue("bhtr50", "invalid value");
        await testValue("", "invalid value");
        await testValue("huy bh", "invalid value");
        await testValue("^kn8uhg", "invalid value");
        await testValue("iujgt567", "invalid value");

        console.log("✅ All tests executed successfully");
    } catch (err) {
        console.error("❌ Test execution failed:", err);
    } finally {
        if (driver) {
            await driver.quit();
        }
    }
}

runTests();
