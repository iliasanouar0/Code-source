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
// const fs = require('fs')
// let time = setTimeout.setTimeout
// puppeteer.use(StealthPlugin())

// // const login = async (data) => {
// //     let feedback = ''
// //     let arg
// //     if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
// //         arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
// //     } else {
// //         const proxyServer = `${data.proxy}`;
// //         arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
// //     }
// //     console.log(`Opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
// //     const browser = await puppeteer.launch({ headless: false, args: arg })
// //     const page = await browser.newPage()
// //     const navigationPromise = page.waitForNavigation()
// //     await page.goto(`https://developers.google.com/oauthplayground`)
// // }
// // let data = {
// //     proxy:'none'
// // }
// // login(data)


// const verify = async (data, entity, mode) => {
//     let details = ''
//     let arg
//     let proxyServer
//     console.log("Verify start: " + data.gmail);
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
//         await page.setDefaultNavigationTimeout(60000)
//         const navigationPromise = page.waitForNavigation({ timeout: 30000 })
//         let file = `${data.gmail.split('@')[0]}-@-init-Gmail.json`
//         fs.access(file, fs.constants.F_OK | fs.constants.W_OK, async (err) => {
//             if (err) {
//                 console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
//             } else {
//                 let cookies = JSON.parse(fs.readFileSync(file));
//                 await page.setCookie(...cookies);
//             }
//         })
//         console.log(`Goto => https://gmail.com/ : ${data.gmail}, At ${new Date().toLocaleString()}`);
//         await page.goto('https://gmail.com')
//         await time(3000)
//         if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//             const countEnter = await page.evaluate(() => {
//                 let html = []
//                 let el = document.querySelectorAll('.bsU')
//                 let elSpan = document.querySelectorAll('.nU.n1 a')
//                 for (let i = 0; i < el.length; i++) {
//                     html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//                 }
//                 return html
//             })
//             await time(4000)
//             if (countEnter.length == 0) {
//                 details += `Entre unread inbox : 0`
//             } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//                 details += `Entre unread inbox : 0`
//             } else {
//                 details += `Entre unread inbox : ${countEnter[0].count}`
//             }
//             await time(5000)
//             const cookiesObject = await page.cookies()
//             let NewFileJson = JSON.stringify(cookiesObject)
//             fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
//                 if (err) {
//                     throw err
//                 }
//             })
//             let st = await page.$$('.Xy')
//             await time(3000)
//             await st[0].click()
//             await time(3000)
//             let bt = await page.$$('.Tj')
//             await time(3000)
//             await bt[0].click()
//             await time(3000)
//             await page.select('.a5p', 'en')
//             await time(3000)
//             await page.waitForSelector('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.click('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//         }
//         console.log('301 :' + data.gmail);
//         await navigationPromise
//         console.log('303 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await page.waitForSelector('input[type="email"]', { timeout: 5000 })
//         await page.click('input[type="email"]')
//         console.log('313 :' + data.gmail);
//         await navigationPromise
//         console.log('315 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await page.type('input[type="email"]', data.gmail, { delay: 100 })
//         await page.waitForSelector('#identifierNext')
//         await page.click('#identifierNext')
//         console.log('320 :' + data.gmail);
//         await navigationPromise
//         console.log('322 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await time(10000)
//         if (await page.$('[aria-invalid="true"]') != null) {
//             console.log(`invalid email : ${data.gmail}`);
//         }
//         console.log('336 :' + data.gmail);
//         await navigationPromise
//         console.log('338 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await page.waitForSelector('input[type="password"]', { timeout: 5000 })
//         await time(3000)
//         await page.type('input[type="password"]', data.password, { delay: 200 })

//         await time(5000)
//         await page.waitForSelector('#passwordNext')
//         await time(2000)
//         await page.click('#passwordNext')
//         await time(10000)
//         if (await page.$('[aria-invalid="true"]') != null) {
//             console.log(`invalid pass : ${data.gmail}`);
//         }
//         console.log('360 :' + data.gmail);
//         await navigationPromise
//         console.log('362 :' + data.gmail);
//         console.log('passed :' + data.gmail);
//         await time(3000)
//         console.log(page.url());


//         if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//             console.log('verified email : ' + data.gmail + ` , At ${new Date().toLocaleString()}`);
//             await time(4000)

//             const countEnter = await page.evaluate(() => {
//                 let html = []
//                 let el = document.querySelectorAll('.bsU')
//                 let elSpan = document.querySelectorAll('.nU.n1 a')
//                 for (let i = 0; i < el.length; i++) {
//                     html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//                 }
//                 return html
//             })
//             if (countEnter.length == 0) {
//                 details += `Entre unread inbox : 0`
//             } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//                 details += `Entre unread inbox : 0`
//             } else {
//                 details += `Entre unread inbox : ${countEnter[0].count}`
//             }

//             const cookiesObject = await page.cookies()
//             let NewFileJson = JSON.stringify(cookiesObject)
//             fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
//                 if (err) {
//                     throw err
//                 }
//             })
//             let st = await page.$$('.Xy')
//             await time(3000)
//             await st[0].click()
//             await time(3000)
//             let bt = await page.$$('.Tj')
//             await time(3000)
//             await bt[0].click()
//             await time(3000)
//             await page.select('.a5p', 'en')
//             await time(3000)
//             await page.waitForSelector('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.click('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//         }
//         await navigationPromise
//         await time(2000)
//         console.log(page.url());
//         let recovery = await page.$$('.lCoei.YZVTmd.SmR8')
//         await time(2000)
//         await recovery[2].click()
//         await time(2000)
//         page.waitForSelector('#knowledge-preregistered-email-response')
//         await time(2000)
//         await page.type('#knowledge-preregistered-email-response', data.verification, { delay: 200 })
//         await time(2000)
//         let confirm = await page.$$('.VfPpkd-Jh9lGc')
//         await time(2000)
//         await confirm[0].click()
//         await navigationPromise
//         await time(10000)
//         if (await page.$('[aria-invalid="true"]') != null) {
//             console.log('invalid verification : ' + data.verification);
//         }
//         if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//             console.log('verified email : ' + data.gmail + ` , At ${new Date().toLocaleString()}`);
//             const countEnter = await page.evaluate(() => {
//                 let html = []
//                 let el = document.querySelectorAll('.bsU')
//                 let elSpan = document.querySelectorAll('.nU.n1 a')
//                 for (let i = 0; i < el.length; i++) {
//                     html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
//                 }
//                 return html
//             })
//             await time(4000)
//             if (countEnter.length == 0) {
//                 details += `Entre unread inbox : 0`
//             } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
//                 details += `Entre unread inbox : 0`
//             } else {
//                 details += `Entre unread inbox : ${countEnter[0].count}`
//             }

//             let smart = await page.evaluate(() => {
//                 let s = document.querySelectorAll('.ahj.ai6.Kj-JD-Jh')
//                 if (s.length == 0) {
//                     return false
//                 }
//                 return true
//             })

//             if (smart) {
//                 let ch = await page.$$('.aho')
//                 await ch[0].click()
//                 await time(3000)
//                 await page.waitForSelector('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 await page.click('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 let ch2 = await page.$$('.aho')
//                 await ch2[0].click()
//                 await time(3000)
//                 await page.waitForSelector('[name="data_consent_dialog_next"]')
//                 await time(3000)
//                 await page.click('[name="data_consent_dialog_next"]')
//             }

//             const cookiesObject = await page.cookies()
//             let NewFileJson = JSON.stringify(cookiesObject)
//             fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
//                 if (err) {
//                     throw err
//                 }
//             })
//             let st = await page.$$('.Xy')
//             await time(3000)
//             await st[0].click()
//             await time(3000)
//             let bt = await page.$$('.Tj')
//             await time(3000)
//             await bt[0].click()
//             await time(3000)
//             await page.select('.a5p', 'en')
//             await time(3000)
//             await page.waitForSelector('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//             await page.click('[guidedhelpid="save_changes_button"]')
//             await time(3000)
//         }
//     } catch (e) {
//         console.log("catch error");
//         console.log(e.message);
//         // if (e instanceof puppeteer._pptr.errors.TimeoutError) {
//         //     console.log(e.message);
//         // } else if (e instanceof puppeteer._pptr.errors.ReferenceError) {
//         //     console.log(e.message);
//         // }
//     }
// }


// // 97548283	none	gmail	peitopho@outlook.com
// // afsbygesani@gmail.com	mnbvcxz9900	82.98.170.171:3838	gmail	chandaaleman@outlook.com
// let data = {
//     gmail: 'afsbygesani@gmail.com',
//     password: 'mnbvcxz9900',
//     verification: 'chandaaleman@outlook.com',
//     // proxy: '82.98.170.171:3838',
//     proxy: 'none',
// }

// verify(data, 'GML', 'Cookies')