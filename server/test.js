// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
puppeteer.use(StealthPlugin())

let time = setTimeout.setTimeout

const login = async (data) => {
  let arg
  if (data.proxy == 'none' || data.proxy == null || data.proxy == '') {
    arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
  } else {
    const proxyServer = `${data.proxy}`;
    arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
  }
  console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
  console.log(` `);

  const browser = await puppeteer.launch({ headless: false, args: arg })
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
    console.log('hh');
    console.log(`invalid email : ${data.gmail}`);
  }
  await navigationPromise
  await time(3000);
  try {
    await page.waitForSelector('input[type="password"]', { timeout: 500 })
  } catch (error) {
    if (error) {
      console.log('yy');
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
    const count = await page.$eval('.bsU', element => {
      return element.innerHTML
    })
    console.log(count);
    return
  }
  await navigationPromise
  await time(2000)
  await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3)')
  await time(2000)
  page.waitForSelector('#knowledge-preregistered-email-response')
  await time(2000)
  await page.type('#knowledge-preregistered-email-response', data.vrf, { delay: 200 })
  await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
  await time(2000)
  await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
  await navigationPromise
  await time(10000)
  if (await page.$('[aria-invalid="true"]') != null) {
    console.log(`invalid verification : ${data.vrf}`);
    return
  }
  if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
    console.log('verified email : ' + data.gmail);
    const count = await page.$eval('.bsU', element => {
      return element.innerHTML
    })
    console.log(count);
  }
}

// const checkProxy = async (data) => {
//   let arg
//   if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
//     arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//   } else {
//     const proxyServer = `${data.proxy}`;
//     arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//   }
//   const browser = await puppeteer.launch({ headless: false, args: arg })
//   const page = await browser.newPage()
//   try {
//     await page.goto(`http://monip.org/`)
//     await time(5000)
//     await page.goto('https://bot.sannysoft.com/', { waitUntil: ['load', 'domcontentloaded'] })
//   } catch (error) {
//     console.log(error);
//   } finally {
//     console.log('test');
//     // await page.close()
//     // await browser.close()
//   }
// }

let data = {
  gmail: 'aminouhassan771@gmail.com',
  // gmail: 'shrh8274@gmail.com',
  password: '97845024',
  // proxy: '188.34.177.156',
  proxy: '38.34.185.143:3838',
  vrf: 'peholafa@outlook.com'
}
login(data)
