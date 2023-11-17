// // const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer-extra')
// // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())
// const setTimeout = require('timers/promises');

// let time = setTimeout.setTimeout
// const fs = require('fs')

// const login = async (data) => {
//     let arg
//     if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
//         arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//     } else {
//         const proxyServer = `${data.proxy}`;
//         arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//     }
//     console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
//     console.log(` `);
//     const browser = await puppeteer.launch({ headless: false, args: arg })
//     const page = await browser.newPage()
//     const navigationPromise = page.waitForNavigation()
//     await page.goto('https://gmail.com')
//     await navigationPromise
//     await time(5000)
//     if (await page.url() == "https://mail.google.com/mail/u/0/#inbox") {
//         console.log('test');
//     } else {
//         await page.waitForSelector('input[type="email"]')
//         await page.click('input[type="email"]')
//         await navigationPromise
//         await page.type('input[type="email"]', data.gmail, { delay: 100 })
//         await page.waitForSelector('#identifierNext')
//         await page.click('#identifierNext')
//         await page.waitForSelector('input[type="password"]')
//         await time(5000)
//         page.type('input[type="password"]', data.password, { delay: 200 })
//         await time(3000)
//         page.waitForSelector('#passwordNext')
//         page.click('#passwordNext')
//         await navigationPromise
//         await time(10000)
//     }
// }

// let data = {
//     gmail: 'aminouhassan771@gmail.com',
//     // gmail: 'shrh8274@gmail.com',
//     password: '97845024',
//     // proxy: '188.34.177.156',
//     // proxy: '38.34.185.143:3838',
//     vrf: 'PennySgueglia@hotmail.com'
// }
// login(data, 100)
