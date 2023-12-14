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


const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
const fs = require('fs')
let time = setTimeout.setTimeout
puppeteer.use(StealthPlugin())

// ignoreHTTPSErrors: true,
//     ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'],

// '--no-sandbox',
// `--proxy-server=${proxy}`,
// '--ignore-certifcate-errors',
// '--disable-client-side-phishing-detection',
// '--ignore-certifcate-errors-spki-list',
// '--disable-setuid-sandbox',
// '--disable-dev-shm-usage',
// '--no-first-run',
// '--no-zygote',
// '--proxy-bypass-list=*',
// '--disable-infobars',
// '--disable-gpu',
// '--disable-web-security',
// '--disable-site-isolation-trials',
// '--enable-experimental-web-platform-features',
// '--start-maximized',

const login = async (data, mode) => {
    let feedback = ''
    let arg
    if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
        arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    } else {
        const proxyServer = `${data.proxy}`;
        arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    }
    console.log(`Opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
    console.log(` `);
    if (mode == 'Cookies') {
        const browser = await puppeteer.launch({ headless: false, args: arg })
        const page = await browser.newPage()
        let file = `${data.gmail.split('@')[0]}-@-init-Gmail.json`
        const navigationPromise = page.waitForNavigation()
        fs.access(file, fs.constants.F_OK | fs.constants.W_OK, async (err) => {
            if (err) {
                console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
            } else {
                let cookies = JSON.parse(fs.readFileSync(file));
                await page.setCookie(...cookies);
            }
        })
        await page.goto('https://gmail.com')
        await time(3000)
        if (await page.url() == "https://mail.google.com/mail/u/0/#inbox") {
            await time(3000)
            const cookiesObject = await page.cookies()
            let NewFileJson = JSON.stringify(cookiesObject)
            fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
                if (err) {
                    throw err
                }
            })
        } else {
            await navigationPromise
            await page.waitForSelector('input[type="email"]')
            await page.click('input[type="email"]')
            await navigationPromise
            await page.type('input[type="email"]', data.gmail, { delay: 100 })
            await page.waitForSelector('#identifierNext')
            await page.click('#identifierNext')
            await time(3000)
            await page.waitForSelector('input[type="password"]')
            await time(3000)
            page.type('input[type="password"]', data.password, { delay: 200 })
            await time(3000)
            page.waitForSelector('#passwordNext')
            await time(3000)
            page.click('#passwordNext')
            await navigationPromise
            await time(10000)
            const cookiesObject = await page.cookies()
            let NewFileJson = JSON.stringify(cookiesObject)
            fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
                if (err) {
                    throw err
                }
            })
        }
        return { browser: browser, page: page, feedback: feedback }
    }
}

const composeEmail = async (data, option, mode) => {
    let feedback = ''
    const obj = await login(data, mode)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback
    await time(10000)
    await page.waitForSelector('.z0')
    await time(3000)
    await page.click('.z0')
    await time(6000)
    await page.waitForSelector('.agP.aFw')
    await time(3000)
    await page.type('.agP.aFw', option.to, { delay: 200 })
    await time(3000)
    await page.waitForSelector(".aB.gQ.pB")
    await time(3000)
    await page.click(".aB.gQ.pB")
    await time(3000)
    let bcc = await page.evaluate((b) => {
        let inputs = document.querySelectorAll('.agP.aFw')
        inputs[1].value = b
        return b
    }, option.bcc.join(','))
    await time(3000)
    await time(3000)
    await page.waitForSelector('[name="subjectbox"]')
    await time(3000)
    await page.click('[name="subjectbox"]')
    await time(3000)
    await page.type('[name="subjectbox"]', option.subject, { delay: 200 })
    await time(3000)
    fs.readFile(`${option.offer}`, async (err, data) => {
        if (!err) {
            await page.evaluate(async (dataTo) => {
                document.querySelector('div[role="textbox"]').innerHTML = dataTo
            }, data.toString());
        }
    })
    await time(3000)
    await Promise.all([
        page.$eval(`.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3`, element =>
            element.click()
        ),
        await page.waitForNavigation()
    ]);
    await time(40000)
    let check = await page.evaluate(bcc => {
        let unread = document.querySelectorAll('.zA.zE')
        if (unread.length == 0) {
            return { status: true }
        }
        let bounced = 0
        let first = document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"]')[0]
        if (first.className != 'zA yO') {
            first.click()
            let label = document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"] .y2')[0].innerText
            if (label.includes('You have reached a limit for sending mail') || label.includes('Message blocked') || label.includes('Address not found') || label.includes('Recipient inbox full')) {
                bounced = parseInt(document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"] td span.bx0')[0].innerText)
                return { status: false, message: label.split('.')[0].split('\n')[1], send: bcc.length, bounced: bounced }
            }
        }
        return { status: true, send: bcc.length, bounced: bounced }
    }, option.bcc)
    await time(3000)
    if (!check.status) {
        console.log(check.message);
        console.log(check.status);
        console.log(check.send);
        console.log(check.bounced);
        await time(3000)
        console.log('you can\'t send !!');
        await page.goto("https://mail.google.com/mail/u/0/#inbox")
    } else {
        await time(3000)
        console.log('sended !!');
    }
    // await page.close()
    // await browser.close()
    // return feedback
}


let data = {
    gmail: 'hasithjayanath1994@gmail.com',
    password: '761578412',
}

let options = {
    to: 'liasanouar0@gmail.com',
    subject: 'test',
    offer: 'test11.html',
    bcc: ['test@gmail.com', 'test1@gmail.com', 'test2@gmail.com'],
}

composeEmail(data, options, 'Cookies')