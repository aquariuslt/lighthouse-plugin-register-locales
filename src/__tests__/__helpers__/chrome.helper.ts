import * as log from 'lighthouse-logger';
import * as puppeteer from 'puppeteer';
import * as chromeLauncher from 'chrome-launcher';

const CORE_CHROME_FLAGS = ['--headless', '--disable-gpu'];
const DELAY_SHUTDOWN_CHROME_MS = 3000;

const chromeLaunchOptions = {
  chromePath: process.env.CHROME_PATH || puppeteer.executablePath(),
  chromeFlags: CORE_CHROME_FLAGS,
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const launchChrome = async () => {
  return await chromeLauncher.launch(chromeLaunchOptions);
};

export const shutdownChrome = async (chrome) => {
  await sleep(DELAY_SHUTDOWN_CHROME_MS);
  try {
    await chrome.kill();
    log.log(`Chromium killed`);
  } catch (e) {
    log.error(`Kill Chromium failed with pid ${chrome.pid}`);
    throw e;
  }
};
