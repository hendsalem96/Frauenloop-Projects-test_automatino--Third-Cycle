require('chromedriver');
const { Builder, By, until } = require("selenium-webdriver"); 
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");


describe('File Upload Test', function () {
    this.timeout(0); // unlimited timeout

    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        if (driver) {
            await driver.quit();
        }
    });

    it('should upload a file and verify confirmation', async () => {
        await driver.get('https://testpages.eviltester.com/pages/files/file-upload/');

        // Upload the file
        const fileInput = await driver.findElement(By.id('fileinput'));
        const filePath = '/Users/hend/Documents/DropDownDemo.js';
        await fileInput.sendKeys(filePath);

        // Select file type 
        const fileType = await driver.findElement(By.id('itsafile'));
        await driver.executeScript("arguments[0].scrollIntoView(true);", fileType);
        await fileType.click();

        // Submit the form
       const submitBtn = await driver.findElement(By.css('input[type="submit"]'));
       await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", submitBtn);
       await driver.sleep(500); 
       await submitBtn.click();


        // Wait for the confirmation element
        const uploadedFileName = await driver.wait(
            until.elementLocated(By.id('uploadedfilename')),
            1000
        );

        // Get the text and verify
        const uploadedNameText = await uploadedFileName.getText();
        expect(uploadedNameText).to.equal('DropDownDemo.js');

        console.log('File uploaded and confirmed successfully!');
    });
});
