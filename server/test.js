// // const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer-extra')
// // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())
// const setTimeout = require('timers/promises');
// let dotenv = require('dotenv')
// let time = setTimeout.setTimeout
// const fs = require('fs');

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

// const composeEmail = async (data, option) => {
//     let feedback = ''
//     const obj = await login(data)
//     const page = obj.page
//     const browser = obj.browser
//     feedback += obj.feedback
//     await time(5000)
//     await page.waitForSelector('.z0')
//     await time(3000)
//     await page.click('.z0')
//     await time(3000)
//     await page.waitForSelector('.agP.aFw')
//     await time(3000)
//     await page.type('.agP.aFw', option.to, { delay: 200 })
//     await time(3000)
//     await page.waitForSelector(".aB.gQ.pB")
//     await time(3000)
//     await page.click(".aB.gQ.pB")
//     await time(3000)
//     let bcc = await page.evaluate((b) => {
//         let inputs = document.querySelectorAll('.agP.aFw')
//         inputs[1].value = b
//         return b
//     }, option.bcc.join(','))
//     await time(3000)
//     console.log(bcc);
//     await time(3000)
//     await page.waitForSelector('[name="subjectbox"]')
//     await time(3000)
//     await page.click('[name="subjectbox"]')
//     await time(3000)
//     await page.type('[name="subjectbox"]', option.subject, { delay: 200 })
//     await time(3000)
//     // const elementHandle = await page.$("input[type=file]");
//     // await time(3000)
//     // await elementHandle.uploadFile(`./${option.offer}`);
//     fs.readFile(`./${option.offer}`, async (err, data) => {
//         if (!err) {
//             await page.evaluate(async (dataTo) => {
//                 document.querySelector('div[role="textbox"]').innerHTML = dataTo
//             }, data.toString());
//         }
//     })
//     await time(3000)
//     await Promise.all([
//         page.$eval(`.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3`, element =>
//             element.click()
//         ),
//         await page.waitForNavigation(),
//     ]);
//     return
// }

// // let data = {
// //     gmail: 'hasithjayanath1994@gmail.com',
// //     password: '761578412',
// //     // proxy: '188.34.177.156',
// //     // proxy: '38.34.185.143:3838',
// //     verification: 'pelila1985@outlook.com'
// // }

// let data = {
//     gmail: 'iliasanouar0@gmail.com',
//     password: 'test08072001',
//     // proxy: '188.34.177.156',
//     // proxy: '38.34.185.143:3838',
//     // verification: 'pelila1985@outlook.com'
// }

// let options = {
//     subject: 'test email',
//     to: 'zaidiyounesios@gmail.com',
//     bcc: ['signalgm@gmail.com'],
//     offer: 'test.html'
// }

// // let options = {
// //     subject: 'test email',
// //     to: 'iliasanouar0@gmail.com',
// //     bcc: ['signalgm@gmail.com'],
// //     offer: 'test.html'
// // }

// composeEmail(data, options)