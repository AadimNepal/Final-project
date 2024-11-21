import { Builder, By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { startServer } from '../test-setup.mjs';
import 'chromedriver';

describe('Authentication Tests', function() {
  let driver;
  let server;

  this.timeout(30000);

  before(async function() {
    server = await startServer();
    await new Promise(resolve => setTimeout(resolve, 1000));
    driver = await new Builder().forBrowser('chrome').build();
  });

  after(async function() {
    if (driver) await driver.quit();
    if (server) server.kill();
  });

  beforeEach(async function() {
    await driver.get('http://localhost:22229');
    await driver.wait(until.elementLocated(By.tagName('body')), 5000);
  });

  it('should successfully register a new patient', async function() {
    const uniqueEmail = `test${Date.now()}@example.com`;
    const testName = 'Test Patient';
    const testPassword = 'password123';

    try {
      // Fill registration form
      await driver.findElement(By.css('input[name="name"]')).sendKeys(testName);
      await driver.findElement(By.css('input[name="email"]')).sendKeys(uniqueEmail);
      await driver.findElement(By.css('input[name="password"]')).sendKeys(testPassword);
      
      // Find and select 'patient' in role dropdown
      const roleSelect = await driver.findElement(By.css('select[name="role"]'));
      await roleSelect.click();
      await roleSelect.sendKeys('patient');

      // Submit the form
      const form = await driver.findElement(By.css('form[action="/register"]'));
      await form.submit();

      // Wait for either error message or success
      await driver.wait(async function() {
        try {
          const url = await driver.getCurrentUrl();
          return url.includes('/verify') || url.includes('?error=');
        } catch (e) {
          return false;
        }
      }, 5000);

      const currentUrl = await driver.getCurrentUrl();
      expect(currentUrl).to.include('/verify');

    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });

  it('should successfully login as a doctor', async function() {
    try {
      // Use an existing doctor account
      const email = 'test@nyu.edu';
      const password = 'password123';

      // Fill login form
      await driver.findElement(By.css('form[action="/login"] input[name="email"]'))
        .sendKeys(email);
      await driver.findElement(By.css('form[action="/login"] input[name="password"]'))
        .sendKeys(password);

      // Submit login form
      const loginForm = await driver.findElement(By.css('form[action="/login"]'));
      await loginForm.submit();

      // Wait for redirect to doctor dashboard
      await driver.wait(until.urlContains('doctor-dashboard'), 5000);
      
      const url = await driver.getCurrentUrl();
      expect(url).to.include('doctor-dashboard');
    } catch (error) {
      console.error('Test error:', error);
      throw error;
    }
  });
});