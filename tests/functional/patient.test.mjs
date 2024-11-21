import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { startServer } from '../test-setup.mjs';
import 'chromedriver';

describe('Patient Dashboard Tests', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    // Login as patient first
    await driver.get('http://localhost:3000');
    await driver.findElement(By.css('input[type="email"]')).sendKeys('patient@example.com');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('password123');
    await driver.findElement(By.css('form[action="/login"]')).submit();
  });

  after(async () => {
    await driver.quit();
  });

  it('should display encounters list', async () => {
    const encounters = await driver.findElements(By.css('.encounter-item'));
    expect(encounters.length).to.be.greaterThan(0);
  });

  it('should show encounter details', async () => {
    // Click first encounter
    await driver.findElement(By.css('.encounter-item')).click();

    // Verify encounter details page
    const details = await driver.wait(until.elementLocated(By.css('.encounter-details')));
    expect(await details.isDisplayed()).to.be.true;
  });
});
