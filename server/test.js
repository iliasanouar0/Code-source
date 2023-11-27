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

// const markAsRead = async (data, pages, subject) => {
//     let feedback = ''
//     let details = ''
//     const obj = await login(data)
//     const page = obj.page
//     const browser = obj.browser
//     feedback += obj.feedback

//     await time(10000)
//     const countEnter = await page.evaluate(() => {
//         let html = []
//         let el = document.querySelectorAll('.bsU')
//         let elSpan = document.querySelectorAll('.nU.n1 a')
//         for (let i = 0; i < el.length; i++) {
//             html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//         }
//         return html
//     })
//     if (countEnter.length == 0) {
//         details += `Entre unread inbox : 0`
//     } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//         details += `Entre unread inbox : 0`
//     } else {
//         details += `Entre unread inbox : ${countEnter[0].count}`
//     }
//     await time(3000)
//     console.log(`treated pages : ${pages}`);
//     let link
//     if (subject != undefined) {
//         let sb = await subject.split(' ')
//         console.log(sb);
//         let string = await sb.join('+')
//         console.log(string)
//         link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aunread+subject%3A(${string})`
//     } else {
//         link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aunread`
//     }
//     await time(3000)
//     await page.goto(link)
//     await time(3000)
//     if (pages == undefined) {
//         let i = 0
//         while (i < 999999) {
//             console.log(`starting page : ${i + 1}`);
//             await time(3000)
//             const status = await page.evaluate(() => {
//                 let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
//                 checkSpan.item(1).click()
//                 return checkSpan.item(1).ariaChecked
//             })
//             await time(3000)
//             console.log(status);
//             if (status == 'true') {
//                 await time(3000)
//                 let c = await page.$$('div[act="1"]')
//                 await time(3000)
//                 await c[1].click();
//                 await time(3000)
//                 await page.goto(link)
//                 i++
//             } else {
//                 console.log(`page ${i + 1} have no mode messages`);
//                 await time(3000)
//                 const countOut = await page.evaluate(() => {
//                     let html = []
//                     let el = document.querySelectorAll('.bsU')
//                     let elSpan = document.querySelectorAll('.nU.n1 a')
//                     for (let i = 0; i < el.length; i++) {
//                         html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//                     }
//                     return html
//                 })
//                 if (countOut.length == 0) {
//                     details += `, Out unread inbox : 0`
//                 } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
//                     details += `, Out unread inbox : 0`
//                 } else {
//                     details += `, Out unread inbox : ${countOut[0].count}`
//                 }
//                 console.log(details);
//                 return
//             }
//         }
//     } else {
//         for (let i = 0; i < pages; i++) {
//             console.log(`starting page : ${i + 1}`);
//             await time(3000)
//             const status = await page.evaluate(() => {
//                 let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
//                 checkSpan.item(1).click()
//                 return checkSpan.item(1).ariaChecked
//             })
//             await time(3000)
//             console.log(status);
//             if (status == 'true') {
//                 await time(3000)
//                 let c = await page.$$('div[act="1"]')
//                 await time(3000)
//                 await c[1].click();
//                 await time(3000)
//                 await page.goto(link)
//             } else {
//                 console.log(`page ${i + 1} have no mode messages`);
//                 await time(3000)
//                 const countOut = await page.evaluate(() => {
//                     let html = []
//                     let el = document.querySelectorAll('.bsU')
//                     let elSpan = document.querySelectorAll('.nU.n1 a')
//                     for (let i = 0; i < el.length; i++) {
//                         html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//                     }
//                     return html
//                 })
//                 if (countOut.length == 0) {
//                     details += `, Out unread inbox : 0`
//                 } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
//                     details += `, Out unread inbox : 0`
//                 } else {
//                     details += `, Out unread inbox : ${countOut[0].count}`
//                 }
//                 console.log(details);
//                 return 
//             }
//         }
//     }
//     await time(6000)
//     await page.goto('https://mail.google.com/mail/u/0/#inbox')
//     await time(3000)
//     const countOut = await page.evaluate(() => {
//         let html = []
//         let el = document.querySelectorAll('.bsU')
//         let elSpan = document.querySelectorAll('.nU.n1 a')
//         for (let i = 0; i < el.length; i++) {
//             html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//         }
//         return html
//     })
//     if (countOut.length == 0) {
//         details += `, Out unread inbox : 0`
//     } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
//         details += `, Out unread inbox : 0`
//     } else {
//         details += `, Out unread inbox : ${countOut[0].count}`
//     }
//     console.log(details);
//     return 
// }

// let data = {
//     gmail: 'hasithjayanath1994@gmail.com',
//     password: '761578412',
//     // proxy: '188.34.177.156',
//     proxy: '38.34.185.143:3838',
//     verification: 'pelila1985@outlook.com'
// }

// // // let data = {
// // //     // gmail: 'mamanes107@gmail.com',
// // //     gmail: 'mamanes107@gmail.com',
// // //     password: '97548283',
// // //     // proxy: '188.34.177.156',
// // //     // proxy: '38.34.185.143:3838',
// // //     vrf: 'PennySgueglia@hotmail.com'
// // // }

// // // let data = {
// // //     // gmail: 'mamanes107@gmail.com',
// // //     gmail: 'ronaldorober12@gmail.com',
// // //     password: '02077504',
// // //     // proxy: '188.34.177.156',
// // //     // proxy: '38.34.185.143:3838',
// // //     vrf: 'PennySgueglia@hotmail.com'
// // // }

// markAsRead(data, 100, 'test')
// // openInbox(data, 1, { markAsStarted: true, markAsImportant: true })


// // const fs = require('fs')
// // let dotenv = require('dotenv')
// // const replace = require('replace-in-file');

// // const result = dotenv.config()
// // if (result.error) {
// //     throw result.error
// // }

// // // let granted = JSON.stringify({ "entity": `IT`, "action": `primaryDefiner` }) + '-'
// // let granted = 'IT'
// // let options = {
// //     files: '.env',
// //     from: /SERVER_ENTITY=\w+/g,
// //     to: `SERVER_ENTITY=${granted}`,
// // }
// // try {
// //     const results = replace.sync(options);
// //     console.log('Replacement results:', results);
// // } catch (error) {
// //     console.error('Error occurred:', error);
// // }
