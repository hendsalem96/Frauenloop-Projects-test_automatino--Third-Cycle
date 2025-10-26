const { Builder, By, until } = require('selenium-webdriver');
const { expect } = require('chai');

describe('Practice Test Login Page', function () {
  this.timeout(30000); // 30 seconds timeout for all tests
  let driver;

  before(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get('https://practicetestautomation.com/practice-test-login/');
  });

  after(async function () {
    await driver.quit();
  });

  it('should login successfully with valid credentials', async function () {
    await driver.findElement(By.id('username')).sendKeys('student');
    await driver.findElement(By.id('password')).sendKeys('Password123');
    await driver.findElement(By.id('submit')).click();

    const successMessage = await driver.wait(
      until.elementLocated(By.css('p.has-text-align-center strong')),
      5000
    );
    const text = await successMessage.getText();
    expect(text).to.equal('Congratulations student. You successfully logged in!');
  });

  it('should show error for invalid username', async function () {
    await driver.get('https://practicetestautomation.com/practice-test-login/');
    await driver.findElement(By.id('username')).sendKeys('wronguser');
    await driver.findElement(By.id('password')).sendKeys('Password123');
    await driver.findElement(By.id('submit')).click();

    const error = await driver.wait(
      until.elementLocated(By.id('error')),
      5000
    );
    const text = await error.getText();
    expect(text).to.equal('Your username is invalid!');
  });

  it('should show error for invalid password', async function () {
    await driver.get('https://practicetestautomation.com/practice-test-login/');
    await driver.findElement(By.id('username')).sendKeys('student');
    await driver.findElement(By.id('password')).sendKeys('wrongpass');
    await driver.findElement(By.id('submit')).click();

    const error = await driver.wait(
      until.elementLocated(By.id('error')),
      5000
    );

    await driver.wait(async () => {
  const text = await error.getText();
  return text.length > 0;
}, 5000);
    const text = await error.getText();
    expect(text).to.equal('Your password is invalid!');
  });
});
