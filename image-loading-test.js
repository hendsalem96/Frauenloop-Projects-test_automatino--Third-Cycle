require('chromedriver');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

const PAGE_URL = 'https://moatazeldebsy.github.io/test-automation-practices/?#/broken-images';

async function fetchData(link) {
  try {
    const response = await fetch(link, { 
      method: 'GET',
      redirect: 'follow'
    });
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      finalUrl: response.url 
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      statusText: error.message,
      finalUrl: null
    };
  }
}

class BrokenImagesPage {
  
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(PAGE_URL);
    await this.driver.wait(until.elementLocated(By.css('img[data-test="image-0"]')), 1000);
  }

  async getImages() {
    return this.driver.findElements(By.css('img[data-test^="image-"]'));
  }

  async getImageSrcs() {
    const images = await this.getImages();
    const srcs = [];
    for (const img of images) {
      srcs.push(await img.getAttribute('src'));
    }
    return srcs;
  }

async getImageStatusResults() {
  const srcs = await this.getImageSrcs();
  const results = [];
  
  for (const src of srcs) {
    console.log(`Testing original URL: ${src}`);
    const result = await fetchData(src);
    console.log(`Final URL: ${result.finalUrl}, Status: ${result.status}`);
    
    results.push({
      originalSrc: src,
      finalUrl: result.finalUrl,
      ok: result.ok,
      status: result.status,
      statusText: result.statusText
    });
  }
  
  return results;
}

}

describe('Broken images page tests', function () {
  this.timeout(0);

  let driver;
  let page;

  before(async () => {
    const options = new chrome.Options();

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    page = new BrokenImagesPage(driver);
    await page.open();
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });


describe('Image status code validation', function () {
  let results;

  before(async () => {
    results = await page.getImageStatusResults();
  });

  it('should validate that Image 0 is valid and returns 200', async () => {
    expect(results[0].ok).to.be.true;
    expect(results[0].status).to.equal(200);
  });

  it('should validate that Image 1 returns 404 for non-existent URL', async () => {
    expect(results[1].ok).to.be.false;
    expect(results[1].status).to.be.oneOf([404]);
  });

  it('should validate that Image 2 fails due to invalid URL format', async () => {
    expect(results[2].ok).to.be.false;
    expect(results[2].status).to.be.oneOf([404]);
  });
});
});
