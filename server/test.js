// // const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer-extra')
// // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())
// const setTimeout = require('timers/promises');
// let dotenv = require('dotenv')
// let time = setTimeout.setTimeout
// const fs = require('fs')

// const login = async (data) => {
//     let feedback = ''
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
//     let file = `./${data.gmail.split('@')[0]}-@-init-Gmail.json`
//     const navigationPromise = page.waitForNavigation()
//     fs.access(file, fs.constants.F_OK | fs.constants.W_OK, async (err) => {
//         if (err) {
//             console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
//         } else {
//             let cookies = JSON.parse(fs.readFileSync(file));
//             await page.setCookie(...cookies);
//         }
//     })
//     await page.goto('https://gmail.com')
//     if (await page.url() == "https://mail.google.com/mail/u/0/#inbox") {
//         await time(3000)
//         const cookiesObject = await page.cookies()
//         let NewFileJson = JSON.stringify(cookiesObject)
//         fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
//             if (err) {
//                 console.log(err);
//             }
//         })
//     } else {
//         await navigationPromise
//         await page.waitForSelector('input[type="email"]')
//         await page.click('input[type="email"]')
//         await navigationPromise
//         await page.type('input[type="email"]', data.gmail, { delay: 100 })
//         await page.waitForSelector('#identifierNext')
//         await page.click('#identifierNext')
//         await time(3000)
//         await page.waitForSelector('input[type="password"]')
//         await time(3000)
//         page.type('input[type="password"]', data.password, { delay: 200 })
//         await time(3000)
//         page.waitForSelector('#passwordNext')
//         await time(3000)
//         page.click('#passwordNext')
//         await navigationPromise
//         await time(10000)
//         const cookiesObject = await page.cookies()
//         let NewFileJson = JSON.stringify(cookiesObject)
//         fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
//             if (err) {
//                 throw err
//             }
//         })
//     }
//     return { browser: browser, page: page, feedback: feedback }
// }



// let data = {
//     // gmail: 'mamanes107@gmail.com',
//     // gmail: 'asithjayanath1994@gmail.com',
//     gmail: 'ssahaan761294158@gmail.com',
//     password: '761294158',
//     // password: '61578412',
//     // proxy: '188.34.177.156',
//     // proxy: '38.34.185.143:3838',
//     verification: 'pelila1985@outlook.com'
// }

// // let data = {
// //     // gmail: 'mamanes107@gmail.com',
// //     gmail: 'mamanes107@gmail.com',
// //     password: '97548283',
// //     // proxy: '188.34.177.156',
// //     // proxy: '38.34.185.143:3838',
// //     vrf: 'PennySgueglia@hotmail.com'
// // }

// // let data = {
// //     // gmail: 'mamanes107@gmail.com',
// //     gmail: 'ronaldorober12@gmail.com',
// //     password: '02077504',
// //     // proxy: '188.34.177.156',
// //     // proxy: '38.34.185.143:3838',
// //     vrf: 'PennySgueglia@hotmail.com'
// // }

// verify(data, "IT")


// const fs = require('fs')
// let dotenv = require('dotenv')
// const replace = require('replace-in-file');

// const result = dotenv.config()
// if (result.error) {
//     throw result.error
// }

// let granted = JSON.stringify({ "entity": `IT`, "action": `primaryDefiner` }) + '-'
// let options = {
//     files: '.env',
//     from: /HAS_ACCESS=+/g,
//     to: `HAS_ACCESS=${granted}`,
// }
// try {
//     const results = replace.sync(options);
//     console.log('Replacement results:', results);
// } catch (error) {
//     console.error('Error occurred:', error);
// }
