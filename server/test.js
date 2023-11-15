// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const setTimeout = require('timers/promises');

let time = setTimeout.setTimeout

// const login = async (data) => {
//   let arg
//   if (data.proxy == 'none' || data.proxy == null || data.proxy == '') {
//     arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//   } else {
//     const proxyServer = `${data.proxy}`;
//     arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//   }
//   console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
//   console.log(` `);

//   const browser = await puppeteer.launch({ headless: false, args: arg })
//   const page = await browser.newPage()
//   await page.setViewport({ width: 1280, height: 720 });
//   const navigationPromise = page.waitForNavigation()
//   await page.goto('https://gmail.com/')
//   await navigationPromise
//   await page.waitForSelector('input[type="email"]')
//   await page.click('input[type="email"]')
//   await navigationPromise
//   await page.type('input[type="email"]', data.gmail, { delay: 100 })
//   await page.waitForSelector('#identifierNext')
//   await page.click('#identifierNext')
//   await navigationPromise
//   await time(10000)
//   if (await page.$('[aria-invalid="true"]') != null || await page.$('#next > div > div > a') != null) {
//     console.log('hh');
//     console.log(`invalid email : ${data.gmail}`);
//   }
//   await navigationPromise
//   await time(3000);
//   try {
//     await page.waitForSelector('input[type="password"]', { timeout: 500 })
//   } catch (error) {
//     if (error) {
//       console.log('yy');
//       console.log(`invalid email : ${data.gmail}`);
//     }
//   }
//   await page.type('input[type="password"]', data.password, { delay: 200 })
//   await time(1000)
//   await Promise.all([
//     page.$eval(`#passwordNext`, element =>
//       element.click()
//     ),
//     await page.waitForNavigation(),
//   ]);
//   await time(1000)
//   if (await page.$('[aria-invalid="true"]') != null) {
//     console.log('invalid pass');
//   }
//   await navigationPromise
//   if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//     console.log('verified email : ' + data.gmail);
//     const count = await page.$eval('.bsU', element => {
//       return element.innerHTML
//     })
//     console.log(count);
//     return
//   }
//   await navigationPromise
//   await time(2000)
//   await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3)')
//   await time(2000)
//   page.waitForSelector('#knowledge-preregistered-email-response')
//   await time(2000)
//   await page.type('#knowledge-preregistered-email-response', data.vrf, { delay: 200 })
//   await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
//   await time(2000)
//   await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
//   await navigationPromise
//   await time(10000)
//   if (await page.$('[aria-invalid="true"]') != null) {
//     console.log(`invalid verification : ${data.vrf}`);
//     return
//   }
//   if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//     console.log('verified email : ' + data.gmail);
//     const count = await page.$eval('.bsU', element => {
//       return element.innerHTML
//     })
//     console.log(count);
//   }
// }

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

const notSpam = async (data) => {
  let arg
  if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
    arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
  } else {
    const proxyServer = `${data.proxy}`;
    arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
  }
  console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
  console.log(` `);
  const browser = await puppeteer.launch({ headless: false, args: arg })
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
  await page.waitForSelector('input[type="password"]')
  await time(5000)
  page.type('input[type="password"]', data.password, { delay: 200 })
  await time(3000)
  page.waitForSelector('#passwordNext')
  page.click('#passwordNext')
  await navigationPromise
  // await time(5000)
  // await page.waitForSelector('.CJ')
  // await page.click('.CJ')
  // await time(3000)
  // page.waitForSelector('a[href="https://mail.google.com/mail/u/0/#spam"]')
  // page.click('a[href="https://mail.google.com/mail/u/0/#spam"]')
  // await time(3000)

  await time(10000)
  const countInbox = await page.evaluate(() => {
    let html = []
    let el = document.querySelectorAll('.bsU')
    let elSpan = document.querySelectorAll('.nU.n1 a')
    for (let i = 0; i < el.length; i++) {
      html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
    }
    return html
  })
  console.log(countInbox);
  // await page.evaluate(() => {
  //   document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
  // })
  // const elements = await page.$x('/html/body/div[7]/div[3]/div/div[2]/div[2]/div/div/div/div[1]/div/div[1]/div[1]/div/div/div[1]/div/div[1]/span')
  await time(3000)
  // console.log(elements[0].click());
  // const countSpan = await elements[0].getProperty('textContent');
  // let details = `Unread inbox : ${await countSpan.jsonValue()}`
  // console.log(countSpan);
  // console.log(details);
}

let data = {
  gmail: 'mohmedly1971@gmail.com',
  // gmail: 'shrh8274@gmail.com',
  password: 'rB6t69q6qSRCh4',
  // proxy: '188.34.177.156',
  // proxy: '38.34.185.143:3838',
  vrf: 'peholafa@outlook.com'
}
notSpam(data)
