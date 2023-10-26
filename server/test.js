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
  // await time(3000)
  // await navigationPromise
  // await time(3000);
  // try {
  //   await page.waitForSelector('input[type="password"]', { timeout: 500 })
  // } catch (error) {
  //   if (error) {
  //     console.log(error);
  //   }
  // }
  // await page.type('input[type="password"]', data.password, { delay: 200 })
  // await page.waitForSelector('#passwordNext')
  // await page.click('#passwordNext')
  // await navigationPromise
  // await time(1000)
  // await navigationPromise
  // await time(3000)
  // await page.close()
  // await browser.close()
}


let data = {
  gmail: "aminouhassan771@gmail.com",
  password: "97845024"
}

login(data)