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


// const verify = async (data, entity) => {
//     const result = dotenv.config()
//     if (result.error) {
//         throw result.error
//     }
//     let grantAccess = []
//     let string = result.parsed.HAS_ACCESS.split(/-/g)
//     for (let i = 1; i < string.length; i++) {
//         grantAccess.push(JSON.parse(string[i - 1]))
//     }
//     let details = ''
//     let arg
//     if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
//         arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//     } else {
//         const proxyServer = `${data.proxy}`;
//         arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//     }
//     console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
//     console.log(` `);
//     let feedback = ''
//     const browser = await puppeteer.launch({ headless: 'new', args: arg })
//     const browserPID = browser.process().pid
//     const page = await browser.newPage()
//     pidProcess.push({ id_process: data.id_process, pid: browserPID })
//     await page.setViewport({ width: 1280, height: 720 });
//     const navigationPromise = page.waitForNavigation()
//     await page.goto('https://gmail.com/')
//     await navigationPromise
//     await page.screenshot({
//         path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
//     });
//     feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
//     await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//     await page.waitForSelector('input[type="email"]')
//     await page.click('input[type="email"]')
//     await navigationPromise
//     await page.type('input[type="email"]', data.gmail, { delay: 100 })
//     await page.waitForSelector('#identifierNext')
//     await page.click('#identifierNext')
//     await navigationPromise
//     await time(10000)
//     if (await page.$('[aria-invalid="true"]') != null || await page.$('#next > div > div > a') != null) {
//         await page.screenshot({
//             path: `${path}/${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
//         });
//         await page.close()
//         await browser.close()
//         console.log(`invalid email : ${data.gmail}`);
//         feedback += `, ${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
//         await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//         return feedback
//     }
//     await navigationPromise
//     await time(3000);
//     try {
//         await page.waitForSelector('input[type="password"]', { timeout: 500 })
//     } catch (error) {
//         if (error) {
//             await page.screenshot({
//                 path: `${path}/${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
//             });
//             await page.close()
//             await browser.close()
//             console.log(`invalid email : ${data.gmail}`);
//             feedback += `, ${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
//             await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//             return feedback
//         }
//     }
//     await page.type('input[type="password"]', data.password, { delay: 200 })
//     await page.screenshot({
//         path: `${path}/${data.gmail.split('@')[0]}-@-password-${data.id_process}.png`
//     });
//     feedback += `, ${data.gmail.split('@')[0]}-@-password-${data.id_process}.png`
//     await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//     await time(1000)
//     await Promise.all([
//         page.$eval(`#passwordNext`, element =>
//             element.click()
//         ),
//         await page.waitForNavigation(),
//     ]);
//     await time(1000)
//     if (await page.$('[aria-invalid="true"]') != null) {
//         await page.screenshot({
//             path: `${path}/${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
//         });
//         await page.close()
//         await browser.close()
//         console.log(`invalid email : ${data.gmail}`);
//         feedback += `, ${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
//         await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//         return feedback
//     }
//     await navigationPromise
//     await time(3000)
//     console.log(page.url());
//     if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//         console.log('verified email : ' + data.gmail);
//         await page.screenshot({
//             path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//         });
//         await time(5000)
//         for (let i = 0; i < grantAccess.length; i++) {
//             if (grantAccess[i].entity == entity) {
//                 switch (grantAccess[i].action) {
//                     case "primaryDefiner":
//                         await page.waitForSelector('.FH')
//                         await time(2000)
//                         await page.click('.FH')
//                         await time(2000)
//                         let op = await page.$$("label:nth-child(6) span")
//                         await time(2000)
//                         await op[0].click()
//                         await time(2000)
//                         let cos = await page.$$("label:nth-child(6) div button")
//                         await time(2000)
//                         await cos[0].click()
//                         await time(7000)
//                         let s = 0
//                         let checkSpan = await page.$$("td.r9 table tr td")
//                         for (let i = 0; i < 3; i++) {
//                             s = s + 1
//                             if (s % 2 == 0) {
//                                 s = s + 1
//                             }
//                             console.log(s);
//                             await time(1000)
//                             checkSpan[s].click()
//                             await time(1000)
//                             let sp = await page.$$('[act="z"] .J-N-Jz')
//                             await time(1000)
//                             await sp[sp.length - 1].click()
//                             await time(1000)
//                         }
//                         await time(3000)
//                         let btn = await page.$$('[guidedhelpid="save_changes_button"]')
//                         await time(2000)
//                         await btn[0].click()
//                         break;
//                     default:
//                         break;
//                 }
//                 break
//             } else {
//                 console.log("no access !!");
//             }
//         }
//         await time(4000)

//         const countEnter = await page.evaluate(() => {
//             let html = []
//             let el = document.querySelectorAll('.bsU')
//             let elSpan = document.querySelectorAll('.nU.n1 a')
//             for (let i = 0; i < el.length; i++) {
//                 html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//             }
//             return html
//         })
//         if (countEnter.length == 0) {
//             details += `Entre unread inbox : 0`
//             await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//         } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//             details += `Entre unread inbox : 0`
//             await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//         } else {
//             details += `Entre unread inbox : ${countEnter[0].count}`
//             await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
//         }
//         await page.close()
//         await browser.close()
//         feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//         await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//         return feedback
//     }
//     await navigationPromise
//     await time(2000)
//     console.log(page.url());
//     await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3)')
//     await time(2000)
//     page.waitForSelector('#knowledge-preregistered-email-response')
//     await time(2000)
//     await page.type('#knowledge-preregistered-email-response', data.verification, { delay: 200 })
//     await page.screenshot({
//         path: `${path}/${data.gmail.split('@')[0]}-@-verification-${data.id_process}.png`
//     });
//     feedback += `, ${data.gmail.split('@')[0]}-@-verification-${data.id_process}.png`
//     await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//     await time(2000)
//     await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
//     await time(2000)
//     await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
//     await navigationPromise
//     await time(10000)
//     if (await page.$('[aria-invalid="true"]') != null) {
//         console.log('invalid verification : ' + data.verification);
//         await page.screenshot({
//             path: `${path}/${data.gmail.split('@')[0]}-@-invalid-verification-${data.id_process}.png`
//         });

//         await page.close()
//         await browser.close()
//         feedback += `, ${data.gmail.split('@')[0]}-@-invalid-verification-${data.id_process}.png`
//         await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
//         return feedback
//     }
//     if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//         console.log('verified email : ' + data.gmail);
//         await page.screenshot({
//             path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
//         });
//         const countEnter = await page.evaluate(() => {
//             let html = []
//             let el = document.querySelectorAll('.bsU')
//             let elSpan = document.querySelectorAll('.nU.n1 a')
//             for (let i = 0; i < el.length; i++) {
//                 html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//             }
//             return html
//         })
//         await time(2000)
//         if (countEnter.length == 0) {
//             details += `Entre unread inbox : 0`
//         } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//             details += `Entre unread inbox : 0`
//         } else {
//             details += `Entre unread inbox : ${countEnter[0].count}`
//         }
//         console.log(details);
//         await time(5000)
//         for (let i = 0; i < grantAccess.length; i++) {
//             if (grantAccess[i].entity == entity) {
//                 switch (grantAccess[i].action) {
//                     case "primaryDefiner":
//                         await page.waitForSelector('.FH')
//                         await time(2000)
//                         await page.click('.FH')
//                         await time(2000)
//                         let op = await page.$$("label:nth-child(6) span")
//                         await time(2000)
//                         await op[0].click()
//                         await time(2000)
//                         let cos = await page.$$("label:nth-child(6) div button")
//                         await time(2000)
//                         await cos[0].click()
//                         await time(7000)
//                         let s = 0
//                         let checkSpan = await page.$$("td.r9 table tr td")
//                         for (let i = 0; i < 3; i++) {
//                             s = s + 1
//                             if (s % 2 == 0) {
//                                 s = s + 1
//                             }
//                             console.log(s);
//                             await time(1000)
//                             checkSpan[s].click()
//                             await time(1000)
//                             let sp = await page.$$('[act="z"] .J-N-Jz')
//                             await time(1000)
//                             await sp[sp.length - 1].click()
//                             await time(1000)
//                         }
//                         await time(3000)
//                         let btn = await page.$$('[guidedhelpid="save_changes_button"]')
//                         await time(2000)
//                         await btn[0].click()
//                         break;
//                     default:
//                         break;
//                 }
//                 break
//             } else {
//                 console.log("no access !!");
//             }
//         }
//         return 
//     }
// }
// let data = {
//     // gmail: 'mamanes107@gmail.com',
//     gmail: 'hasithjayanath1994@gmail.com',
//     password: '761578412',
//     // proxy: '188.34.177.156',
//     proxy: '38.34.185.143:3838',
//     vrf: 'pelila1985@outlook.com'
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

// openInbox(data, "IT")


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
