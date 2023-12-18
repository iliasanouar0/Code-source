// let dotenv = require('dotenv')
// const replace = require('replace-in-file');
// const result = dotenv.config()
// if (result.error) {
//     throw result.error
// }

// let count = result.parsed.RUNNING_PROCESS

// if (parseInt(result.parsed.RUNNING_PROCESS) < parseInt(result.parsed.MAX_PROCESS)) {
//     count++
//     let options = {
//         files: '.env',
//         from: /RUNNING_PROCESS=\d+/g,
//         to: `RUNNING_PROCESS=${count}`,
//     }
//     try {
//         const results = replace.sync(options);
//         console.log('Replacement results:', results);
//         // res.status(200).send(granted)
//     } catch (error) {
//         console.error('Error occurred:', error);
//     }
// }

// const puppeteer = require('puppeteer-extra')
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// const setTimeout = require('timers/promises');
// const fs = require('fs')
// let time = setTimeout.setTimeout
// puppeteer.use(StealthPlugin())

// const login = async (data) => {
//     let feedback = ''
//     let arg
//     if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
//         arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//     } else {
//         const proxyServer = `${data.proxy}`;
//         arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//     }
//     console.log(`Opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
//     const browser = await puppeteer.launch({ headless: false, args: arg })
//     const page = await browser.newPage()
//     const navigationPromise = page.waitForNavigation()
//     await page.goto(`https://developers.google.com/oauthplayground`)
// }
// let data = {
//     proxy:'none'
// }
// login(data)