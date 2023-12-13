// // let dotenv = require('dotenv')
// // const replace = require('replace-in-file');
// // const result = dotenv.config()
// // if (result.error) {
// //     throw result.error
// // }

// // let count = result.parsed.RUNNING_PROCESS

// // if (parseInt(result.parsed.RUNNING_PROCESS) < parseInt(result.parsed.MAX_PROCESS)) {
// //     count++
// //     let options = {
// //         files: '.env',
// //         from: /RUNNING_PROCESS=\d+/g,
// //         to: `RUNNING_PROCESS=${count}`,
// //     }
// //     try {
// //         const results = replace.sync(options);
// //         console.log('Replacement results:', results);
// //         // res.status(200).send(granted)
// //     } catch (error) {
// //         console.error('Error occurred:', error);
// //     }
// // }


// const puppeteer = require('puppeteer-extra')
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// const setTimeout = require('timers/promises');
// let time = setTimeout.setTimeout
// puppeteer.use(StealthPlugin())

// // ignoreHTTPSErrors: true,
// //     ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'],

// // '--no-sandbox',
// // `--proxy-server=${proxy}`,
// // '--ignore-certifcate-errors',
// // '--disable-client-side-phishing-detection',
// // '--ignore-certifcate-errors-spki-list',
// // '--disable-setuid-sandbox',
// // '--disable-dev-shm-usage',
// // '--no-first-run',
// // '--no-zygote',
// // '--proxy-bypass-list=*',
// // '--disable-infobars',
// // '--disable-gpu',
// // '--disable-web-security',
// // '--disable-site-isolation-trials',
// // '--enable-experimental-web-platform-features',
// // '--start-maximized',


// const checkProxy = async (data) => {
//     let arg
//     let proxyServer
//     console.log("checkProxy start: " + data.gmail);
//     if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
//         arg = [
//             '--no-sandbox',
//             '--ignore-certifcate-errors',
//             '--disable-client-side-phishing-detection',
//             '--ignore-certifcate-errors-spki-list',
//             '--disable-setuid-sandbox',
//             '--disable-dev-shm-usage',
//             '--no-first-run',
//             '--no-zygote',
//             '--proxy-bypass-list=*',
//             '--disable-infobars',
//             '--disable-gpu',
//             '--disable-web-security',
//             '--disable-site-isolation-trials',
//             '--enable-experimental-web-platform-features',
//             '--start-maximized'
//         ]
//     } else {
//         console.log('there is proxy');
//         proxyServer = `${data.proxy}`;
//         arg = [
//             '--no-sandbox',
//             `--proxy-server=${proxyServer}`,
//             '--ignore-certifcate-errors',
//             '--disable-client-side-phishing-detection',
//             '--ignore-certifcate-errors-spki-list',
//             '--disable-setuid-sandbox',
//             '--disable-dev-shm-usage',
//             '--no-first-run',
//             '--no-zygote',
//             '--proxy-bypass-list=*',
//             '--disable-infobars',
//             '--disable-gpu',
//             '--disable-web-security',
//             '--disable-site-isolation-trials',
//             '--enable-experimental-web-platform-features',
//             '--start-maximized'
//         ]
//     }
//     console.log("Lunch puppeteer: " + `--proxy-server=${data.proxy}`);
//     const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'], args: arg })
//     let c = await browser.createIncognitoBrowserContext({ proxyServer: proxyServer })
//     const page = await c.newPage();
//     await (await browser.pages())[0].close()
//     let feedback = ''
//     try {
//         console.log("Goto: http://monip.org/ " + `--proxy-server=${data.proxy} ` + data.gmail);
//         await page.goto(`http://monip.org/`)
//         await time(10000)
//         console.log("Goto: https://bot.sannysoft.com/ " + `--proxy-server=${data.proxy} ` + data.gmail);
//         await page.goto('https://bot.sannysoft.com/', { waitUntil: ['load', 'domcontentloaded'] })
//     } catch (error) {
//         throw error
//     } finally {
//         console.log("checkProxy finished: " + data.gmail);
//         await page.close()
//         await c.close()
//         return feedback
//     }
// }


// data = {
//     gmail: "test@gmail.com",
//     proxy: '82.98.162.136:3838'
// }

// checkProxy(data)