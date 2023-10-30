const puppeteer = require('puppeteer');
const setTimeout = require('timers/promises');
let time = setTimeout.setTimeout

const login = async (data) => {
  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox'] })
  const browserPID = browser.process().pid
  const page = await browser.newPage()
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
  // await time(30000)
  if (await page.$('[aria-invalid="true"]') != null || await page.$('#next > div > div > a') != null) {
    await page.close()
    await browser.close()
  }
  await navigationPromise
  await time(3000);
  try {
    await page.waitForSelector('input[type="password"]', { timeout: 500 })
  } catch (error) {
    if (error) {
      await page.close()
      await browser.close()
    }
  }
  await page.type('input[type="password"]', data.password, { delay: 200 })
  await page.waitForSelector('#passwordNext')
  await page.click('#passwordNext')
  await navigationPromise
  await time(1000)
  if (await page.$('[aria-invalid="true"]') != null) {
    console.log('test');
    // await page.close()
    // await browser.close()
  }
  // await navigationPromise
  // await time(3000)
  // await page.close()
  // await browser.close()
}


let data = {
  gmail: "iliasanouar0@gmail.com",
  password: "1cSybx0q98id"
}

login(data)