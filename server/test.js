// // const puppeteer = require('puppeteer');
// const puppeteer = require('puppeteer-extra')
// // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())
// const setTimeout = require('timers/promises');
// let dotenv = require('dotenv')
// let time = setTimeout.setTimeout
const fs = require('fs');

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
//         await page.waitForNavigation()
//     ]);
//     await time(30000)
//     let check = await page.evaluate(() => {
//         let unread = document.querySelectorAll('.zA.zE')
//         if (unread.length == 0) {
//             return true
//         }
//         let label = document.querySelector('.zA.zE .y2').innerText
//         if (label.includes('You have reached a limit for sending mail') || label.includes('Message blocked') || label.includes('Address not found')) {
//             return false
//         }
//         return true
//     })
//     await time(3000)
//     console.log(check);
//     await time(3000)
//     if (!check) {
//         console.log('you can\'t send !!');
//     } else {
//         console.log('sended !!');
//     }
//     return
// }

// let data = {
//     gmail: 'davodshah.habibi13731373@gmail.com',
//     password: '09385585523',
//     // proxy: '188.34.177.156',
//     // proxy: '38.34.185.143:3838',
//     verification: 'PeiButtorff@outlook.com'
// }

// let data2 = {
//     gmail: 'iliasanouar0@gmail.com',
//     password: 'test08072001',
//     // proxy: '188.34.177.156',
//     // proxy: '38.34.185.143:3838',
//     // verification: 'pelila1985@outlook.com'
// }


// let bcc = ['vivanusyev11@usnews.com',
//     'dmcrinn12@163.com',
//     'felverston13@ask.com',
//     'csearsby14@last.fm',
//     'aemanuelli15@creativecommons.org',
//     'laudiss16@twitpic.com',
//     'lghidetti17@slashdot.org',
//     'cperrin18@fc2.com',
//     'aizsak19@google.fr',
//     'vbrownhill1a@chicagotribune.com',
//     'cthalmann1b@zdnet.com',
//     'sodriscoll1c@rakuten.co.jp',
//     'kardern1d@ning.com',
//     'wmacgee1e@miibeian.gov.cn',
//     'agallant1f@webmd.com',
//     'wmerrick1g@mozilla.org',
//     'ndanhel1h@google.fr',
//     'tkyte1i@nifty.com',
//     'poliveti1j@ifeng.com',
//     'satcherley1k@lulu.com',
//     'wsurgeon1l@naver.com',
//     'lrichard1m@fema.gov',
//     'cbrightling1n@washington.edu',
//     'lrappaport1o@liveinternet.ru',
//     'cfishpool1p@csmonitor.com',
//     'vgobat1q@guardian.co.uk',
//     'urisdall1r@domainmarket.com',
//     'tnaul1s@nytimes.com',
//     'sscranedge1t@ed.gov',
//     'cvonhindenburg1u@google.cn'
// ]


// let options = {
//     subject: 'test email',
//     to: 'zaidiyounesios@gmail.com',
//     bcc: bcc,
//     offer: 'test11.html'
// }
// composeEmail(data, options)
let data = []
// let dataBcc = 'data.txt'
let dataBcc = 'data.txt'
let path = `./${dataBcc}`
let read = fs.readFileSync(path, 'utf8');
let arrayBcc = read.split('\r\n')
arrayBcc.flatMap(e => {
    let n = e.split(',')
    if (n[1] == undefined) {
        data.push(n[0])
    } else {
        data.push(n[1])
    }
})
console.log(data);