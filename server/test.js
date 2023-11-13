// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
puppeteer.use(StealthPlugin())

let time = setTimeout.setTimeout

const login = async (data) => {
  let arg
  if (data.proxy == 'none' || data.proxy == null) {
    arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
  } else {
    const proxyServer = `${data.proxy}:3838`;
    arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
  }
  console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
  console.log(` `);

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox'] })
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
  await time(10000)
  if (await page.$('[aria-invalid="true"]') != null || await page.$('#next > div > div > a') != null) {
    console.log(`invalid email : ${data.gmail}`);
  }
  await navigationPromise
  await time(3000);
  try {
    await page.waitForSelector('input[type="password"]', { timeout: 500 })
  } catch (error) {
    if (error) {
      console.log(`invalid email : ${data.gmail}`);
    }
  }
  await page.type('input[type="password"]', data.password, { delay: 200 })
  await time(1000)
  await Promise.all([
    page.$eval(`#passwordNext`, element =>
      element.click()
    ),
    await page.waitForNavigation(),
  ]);
  await time(1000)
  if (await page.$('[aria-invalid="true"]') != null) {
    console.log('invalid pass');
  }
  await navigationPromise
  if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
    console.log('verified email : ' + data.gmail);
    return
  }
  await navigationPromise
  await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3)')
  await time(2000)
  await page.type('#knowledge-preregistered-email-response', data.vrf, { delay: 100 })
  await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
  await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
  await navigationPromise
  await time(2000)
  if (await page.$('[aria-invalid="true"]') != null) {
    console.log('invalid verification');
    return
  }
  await page.goto('https://mail.google.com/mail/u/0/#inbox')
  await navigationPromise
}

let data = {
  gmail: 'aminouhassan771@gmail.com',
  password: '97845024',
  proxy: '',
  vrf: 'peholafa@outlook.com'
}
login(data)
