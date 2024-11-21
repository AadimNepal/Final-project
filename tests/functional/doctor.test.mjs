import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { startServer } from '../test-setup.mjs'; 
import 'chromedriver';

describe('Doctor Dashboard Tests', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    // Login as doctor first
    await driver.get('http://localhost:3000');
    await driver.findElement(By.css('input[type="email"]')).sendKeys('doctor@nyu.edu');
    await driver.findElement(By.css('input[type="password"]')).sendKeys('password123');
    await driver.findElement(By.css('form[action="/login"]')).submit();
  });

  after(async () => {
    await driver.quit();
  });

  it('should create new encounter', async () => {
    // Fill encounter form
    await driver.findElement(By.name('chiefComplaint')).sendKeys('Test Complaint');
    await driver.findElement(By.name('bloodPressure.systolic')).sendKeys('120');
    await driver.findElement(By.name('bloodPressure.diastolic')).sendKeys('80');

    // Submit form
    await driver.findElement(By.css('form[action="/doctor-dashboard/add-encounter"]')).submit();

    // Verify success
    const message = await driver.wait(until.elementLocated(By.css('.success-message')));
    expect(await message.isDisplayed()).to.be.true;
  });
});
