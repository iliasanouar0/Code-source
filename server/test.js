const puppeteer = require('puppeteer');
const setTimeout = require('timers/promises');
let time = setTimeout.setTimeout

const login = async (data) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 720 });
  const navigationPromise = page.waitForNavigation()
  await page.goto('https://gmail.com/')
  await navigationPromise
  await page.waitForSelector('input[type="email"]')
  await page.click('input[type="email"]')
  await navigationPromise
  await page.type('input[type="email"]', data.gmail, { delay: 100 })
  await page.waitForSelector('#identifierNext')
  await page.click('#identifierNext')
  await navigationPromise
}


let data = {
  gmail: "aminouhassan771@gmail.com",
  password: "97845024"
}

login(data)