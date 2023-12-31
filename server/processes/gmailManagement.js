const resultsManager = require('../managers/resultManager')
const cloudSeedManager = require('../managers/cloudSeedManager')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
const fs = require('fs');
let dotenv = require('dotenv');
const { error } = require('console');
let time = setTimeout.setTimeout
puppeteer.use(StealthPlugin())

/**
 * @default
 * @constant
 * ~ root dir => { -/var/www/html/Code-source- } :
 * ? dirname.substring : /var/www/html/Code-source/server/processes = /var/www/html/Code-source/
 * ~ path dir => { -/var/www/html/Code-source/views/assets/images/process_result- }
 */

const root = __dirname.substring(0, __dirname.indexOf('/server/processes'))
const path = `${root}/views/assets/images/process_result`
const cookies = `/root/AppUsers/cookies`
const userDir = `/root/userDir/`
let pidProcess = []

function randomRange(myMin, myMax) {
    return Math.floor(
        Math.random() * (Math.ceil(myMax) - Math.floor(myMin) + 1) + myMin
    );
}

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
        const browser = await puppeteer.launch({ headless: 'new', args: arg })
        const browserPID = browser.process().pid
        const page = await browser.newPage()
        pidProcess.push({ id_process: data.id_process, pid: browserPID })
        await page.setViewport({ width: 1440, height: 720 });
        let file = `${cookies}/${data.gmail.split('@')[0]}-@-init-Gmail.json`
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
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-AUTO_LOGIN-${data.id_process}.png`
            });
            feedback += `${data.gmail.split('@')[0]}-@-AUTO_LOGIN-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            const cookiesObject = await page.cookies()
            let NewFileJson = JSON.stringify(cookiesObject)
            fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
                if (err) {
                    throw err
                }
            })
        } else {
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
            });
            feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
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
    } else if (mode == 'Profile') {
        arg.push(`--user-data-dir=${userDir}${data.gmail.split('@')[0]}-@-init-Gmail`)
        const browser = await puppeteer.launch({ headless: 'new', args: arg })
        const browserPID = browser.process().pid
        const page = await browser.newPage()
        pidProcess.push({ id_process: data.id_process, pid: browserPID })
        await page.setViewport({ width: 1280, height: 720 });
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await time(3000)
        if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
            console.log('verified email : ' + data.gmail);
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-AUTO_LOGIN-${data.id_process}.png`
            });
            feedback += `${data.gmail.split('@')[0]}-@-AUTO_LOGIN-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            await time(5000)
        } else {
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
            });
            feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
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
        }
        return { browser: browser, page: page, feedback: feedback }
    }
}

const verify = async (data, entity, mode) => {
    const result = dotenv.config()
    if (result.error) {
        throw result.error
    }
    let string = result.parsed.SERVER_ENTITY
    let grantAccess = { entity: string }

    let details = ''
    let arg
    let proxyServer
    console.log("Verify start: " + data.gmail);
    if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
        arg = [
            '--no-sandbox',
            '--ignore-certifcate-errors',
            '--disable-client-side-phishing-detection',
            '--ignore-certifcate-errors-spki-list',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--no-zygote',
            '--proxy-bypass-list=*',
            '--disable-infobars',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-site-isolation-trials',
            '--enable-experimental-web-platform-features',
            '--start-maximized'
        ]
    } else {
        console.log('there is proxy');
        proxyServer = `${data.proxy}`;
        arg = [
            '--no-sandbox',
            `--proxy-server=${proxyServer}`,
            '--ignore-certifcate-errors',
            '--disable-client-side-phishing-detection',
            '--ignore-certifcate-errors-spki-list',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--no-zygote',
            '--proxy-bypass-list=*',
            '--disable-infobars',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-site-isolation-trials',
            '--enable-experimental-web-platform-features',
            '--start-maximized'
        ]
    }
    console.log("Lunch puppeteer: " + `--proxy-server=${data.proxy}`);
    const browser = await puppeteer.launch({ headless: 'new', ignoreHTTPSErrors: true, ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'], args: arg })
    let c = await browser.createIncognitoBrowserContext({ proxyServer: proxyServer })
    const browserPID = browser.process().pid
    let page = await c.newPage();
    pidProcess.push({ id_process: data.id_process, pid: browserPID })
    await (await browser.pages())[0].close()
    let feedback = ''


    try {
        await page.setDefaultNavigationTimeout(60000)
        const navigationPromise = page.waitForNavigation({ timeout: 30000 })
        let file = `${cookies}/${data.gmail.split('@')[0]}-@-init-Gmail.json`
        fs.access(file, fs.constants.F_OK | fs.constants.W_OK, async (err) => {
            if (err) {
                console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
            } else {
                let cookies = JSON.parse(fs.readFileSync(file));
                await page.setCookie(...cookies);
            }
        })
        console.log(`Goto => https://gmail.com/ : ${data.gmail}, At ${new Date().toLocaleString()}`);
        await page.goto('https://gmail.com')
        await time(3000)
        console.log(await page.url());

        if (await page.url() == 'https://www.google.com/intl/fr/gmail/about/') {
            page = await c.newPage();
            await (await browser.pages())[0].close()
            await page.goto('https://accounts.google.com/b/0/AddMailService')
            console.log(await page.url());
        }

        if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
            console.log('verified email : ' + data.gmail + ` , At ${new Date().toLocaleString()}`);
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
            });
            feedback += `${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            const countEnter = await page.evaluate(() => {
                let html = []
                let el = document.querySelectorAll('.bsU')
                let elSpan = document.querySelectorAll('.nU.n1 a')
                for (let i = 0; i < el.length; i++) {
                    html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                }
                return html
            })
            await time(4000)
            if (countEnter.length == 0) {
                details += `Entre unread inbox : 0`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
                details += `Entre unread inbox : 0`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            } else {
                details += `Entre unread inbox : ${countEnter[0].count}`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            }
            await time(5000)
            // if (grantAccess.entity == entity) {
            //     await time(3000)
            //     await page.waitForSelector('.FH')
            //     await time(2000)
            //     await page.click('.FH')
            //     await time(2000)
            //     let op = await page.$$("label:nth-child(6) span")
            //     await time(2000)
            //     await op[0].click()
            //     await time(2000)
            //     let cos = await page.$$("label:nth-child(6) div button")
            //     await time(2000)
            //     await cos[0].click()
            //     await time(7000)
            //     let s = 0
            //     let checkSpan = await page.$$("td.r9 table tr td")
            //     for (let i = 0; i < 3; i++) {
            //         s = s + 1
            //         if (s % 2 == 0) {
            //             s = s + 1
            //         }
            //         console.log(s);
            //         await time(1000)
            //         checkSpan[s].click()
            //         await time(1000)
            //         let sp = await page.$$('[act="z"] .J-N-Jz')
            //         await time(1000)
            //         await sp[sp.length - 1].click()
            //         await time(1000)
            //     }
            //     await time(3000)
            //     let btn = await page.$$('[guidedhelpid="save_changes_button"]')
            //     await time(2000)
            //     await btn[0].click()

            // } else {
            //     console.log("no access !!");
            // }


            let smart = await page.evaluate(() => {
                let s = document.querySelectorAll('.ahj.ai6.Kj-JD-Jh')
                if (s.length == 0) {
                    return false
                }
                return true
            })

            if (smart) {
                let ch = await page.$$('.aho')
                await ch[1].click()
                await time(3000)
                await page.waitForSelector('[name="data_consent_dialog_next"]')
                await time(3000)
                await page.click('[name="data_consent_dialog_next"]')
                await time(3000)
                await page.waitForSelector('[name="turn_off_in_product"]')
                await time(3000)
                await page.click('[name="turn_off_in_product"]')
                await time(5000)
                await page.waitForSelector('[name="r"]')
                await time(3000)
                await page.click('[name="r"]')
            }

            await page.goto('https://mail.google.com/mail/u/0/#inbox')

            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

            const cookiesObject = await page.cookies()
            let NewFileJson = JSON.stringify(cookiesObject)
            fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
                if (err) {
                    throw err
                }
            })
            let st = await page.$$('.Xy')
            await time(3000)
            await st[0].click()
            await time(3000)
            let bt = await page.$$('.Tj')
            await time(3000)
            await bt[0].click()
            await time(3000)
            await page.select('.a5p', 'en')
            await time(3000)
            await page.waitForSelector('[guidedhelpid="save_changes_button"]')
            await time(3000)
            await page.click('[guidedhelpid="save_changes_button"]')
            await time(3000)
            await page.close()
            await browser.close()
            return feedback
        }
        console.log('301 :' + data.gmail);
        await navigationPromise
        console.log('303 :' + data.gmail);
        console.log('passed :' + data.gmail);
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
        });
        console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
        feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await page.waitForSelector('input[type="email"]', { timeout: 5000 })
        await page.click('input[type="email"]')
        console.log('313 :' + data.gmail);
        await navigationPromise
        console.log('315 :' + data.gmail);
        console.log('passed :' + data.gmail);
        await page.type('input[type="email"]', data.gmail, { delay: 100 })
        await page.waitForSelector('#identifierNext')
        await page.click('#identifierNext')
        console.log('320 :' + data.gmail);
        await navigationPromise
        console.log('322 :' + data.gmail);
        console.log('passed :' + data.gmail);
        await time(10000)
        if (await page.$('[aria-invalid="true"]') != null) {
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
            });
            await page.close()
            await browser.close()
            console.log(`invalid email : ${data.gmail}`);
            feedback += `, ${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            return feedback
        }
        console.log('336 :' + data.gmail);
        await navigationPromise
        console.log('338 :' + data.gmail);
        console.log('passed :' + data.gmail);
        await page.waitForSelector('input[type="password"]', { timeout: 5000 })
        await time(3000)
        await page.type('input[type="password"]', data.password, { delay: 200 })

        await time(5000)
        await page.waitForSelector('#passwordNext')
        await time(2000)
        await page.click('#passwordNext')
        await time(10000)
        if (await page.$('[aria-invalid="true"]') != null) {
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
            });
            await page.close()
            await browser.close()
            console.log(`invalid pass : ${data.gmail}`);
            feedback += `, ${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            return feedback
        }
        console.log('360 :' + data.gmail);
        await navigationPromise
        console.log('362 :' + data.gmail);
        console.log('passed :' + data.gmail);
        await time(3000)
        console.log(page.url() + ' ' + data.gmail);
        try {
            await page.waitForSelector("div[data-is-touch-wrapper=true] button[jsname=bySMBb]", { visible: true, timeout: 25000 })
            await page.click("div[data-is-touch-wrapper=true] button[jsname=bySMBb]")
            console.log("stay sigin clicked " + data.gmail)
            await page.waitForTimeout(5000)
        } catch {
            console.log("catch stay sigin " + data.gmail)
        }
        await navigationPromise
        console.log(page.url() + ' * ' + data.gmail);

        if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
            console.log('verified email : ' + data.gmail + ` , At ${new Date().toLocaleString()}`);

            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
            });
            // await time(5000)

            // if (grantAccess.entity == entity) {
            //     await page.waitForSelector('.FH')
            //     await time(2000)
            //     await page.click('.FH')
            //     await time(2000)
            //     let op = await page.$$("label:nth-child(6) span")
            //     await time(2000)
            //     await op[0].click()
            //     await time(2000)
            //     let cos = await page.$$("label:nth-child(6) div button")
            //     await time(2000)
            //     await cos[0].click()
            //     await time(7000)
            //     let s = 0
            //     let checkSpan = await page.$$("td.r9 table tr td")
            //     for (let i = 0; i < 3; i++) {
            //         s = s + 1
            //         if (s % 2 == 0) {
            //             s = s + 1
            //         }
            //         console.log(s);
            //         await time(1000)
            //         checkSpan[s].click()
            //         await time(1000)
            //         let sp = await page.$$('[act="z"] .J-N-Jz')
            //         await time(1000)
            //         await sp[sp.length - 1].click()
            //         await time(1000)
            //     }
            //     await time(3000)
            //     let btn = await page.$$('[guidedhelpid="save_changes_button"]')
            //     await time(2000)
            //     await btn[0].click()

            // } else {
            //     console.log("no access !!");
            // }

            await time(4000)

            const countEnter = await page.evaluate(() => {
                let html = []
                let el = document.querySelectorAll('.bsU')
                let elSpan = document.querySelectorAll('.nU.n1 a')
                for (let i = 0; i < el.length; i++) {
                    html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                }
                return html
            })
            if (countEnter.length == 0) {
                details += `Entre unread inbox : 0`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
                details += `Entre unread inbox : 0`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            } else {
                details += `Entre unread inbox : ${countEnter[0].count}`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            }
            feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })


            let smart = await page.evaluate(() => {
                let s = document.querySelectorAll('.ahj.ai6.Kj-JD-Jh')
                if (s.length == 0) {
                    return false
                }
                return true
            })

            if (smart) {
                let ch = await page.$$('.aho')
                await ch[1].click()
                await time(3000)
                await page.waitForSelector('[name="data_consent_dialog_next"]')
                await time(3000)
                await page.click('[name="data_consent_dialog_next"]')
                await time(3000)
                await page.waitForSelector('[name="turn_off_in_product"]')
                await time(3000)
                await page.click('[name="turn_off_in_product"]')
                await time(5000)
                await page.waitForSelector('[name="r"]')
                await time(3000)
                await page.click('[name="r"]')
            }

            await page.goto('https://mail.google.com/mail/u/0/#inbox')

            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

            const cookiesObject = await page.cookies()
            let NewFileJson = JSON.stringify(cookiesObject)
            fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
                if (err) {
                    throw err
                }
            })
            let st = await page.$$('.Xy')
            await time(3000)
            await st[0].click()
            await time(3000)
            let bt = await page.$$('.Tj')
            await time(3000)
            await bt[0].click()
            await time(3000)
            await page.select('.a5p', 'en')
            await time(3000)
            await page.waitForSelector('[guidedhelpid="save_changes_button"]')
            await time(3000)
            await page.click('[guidedhelpid="save_changes_button"]')
            await time(3000)
            await page.close()
            await browser.close()
            return feedback
        }
        await navigationPromise
        await time(2000)
        let recovery = await page.$$('.lCoei.YZVTmd.SmR8')
        await time(2000)
        await recovery[2].click()
        await time(2000)
        page.waitForSelector('#knowledge-preregistered-email-response')
        await time(2000)
        await page.type('#knowledge-preregistered-email-response', data.verification, { delay: 200 })
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-verification-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-verification-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(2000)
        let confirm = await page.$$('.VfPpkd-Jh9lGc')
        await time(2000)
        await confirm[0].click()
        await navigationPromise
        await time(10000)
        if (await page.$('[aria-invalid="true"]') != null) {
            console.log('invalid verification : ' + data.verification);
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-invalid-verification-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-invalid-verification-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            await page.close()
            await browser.close()
            return feedback
        }
        console.log(page.url());

        await page.goto("https://mail.google.com/mail/u/0/#inbox")
        console.log(page.url());

        if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
            console.log('verified email : ' + data.gmail + ` , At ${new Date().toLocaleString()}`);
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            const countEnter = await page.evaluate(() => {
                let html = []
                let el = document.querySelectorAll('.bsU')
                let elSpan = document.querySelectorAll('.nU.n1 a')
                for (let i = 0; i < el.length; i++) {
                    html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                }
                return html
            })
            await time(4000)
            if (countEnter.length == 0) {
                details += `Entre unread inbox : 0`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
                details += `Entre unread inbox : 0`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            } else {
                details += `Entre unread inbox : ${countEnter[0].count}`
                await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            }

            let smart = await page.evaluate(() => {
                let s = document.querySelectorAll('.ahj.ai6.Kj-JD-Jh')
                if (s.length == 0) {
                    return false
                }
                return true
            })

            if (smart) {
                let ch = await page.$$('.aho')
                await ch[1].click()
                await time(3000)
                await page.waitForSelector('[name="data_consent_dialog_next"]')
                await time(3000)
                await page.click('[name="data_consent_dialog_next"]')
                await time(3000)
                await page.waitForSelector('[name="turn_off_in_product"]')
                await time(3000)
                await page.click('[name="turn_off_in_product"]')
                await time(5000)
                await page.waitForSelector('[name="r"]')
                await time(3000)
                await page.click('[name="r"]')
            }

            await page.goto('https://mail.google.com/mail/u/0/#inbox')

            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

            const cookiesObject = await page.cookies()
            let NewFileJson = JSON.stringify(cookiesObject)
            fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
                if (err) {
                    throw err
                }
            })
            let st = await page.$$('.Xy')
            await time(3000)
            await st[0].click()
            await time(3000)
            let bt = await page.$$('.Tj')
            await time(3000)
            await bt[0].click()
            await time(3000)
            await page.select('.a5p', 'en')
            await time(3000)
            await page.waitForSelector('[guidedhelpid="save_changes_button"]')
            await time(3000)
            await page.click('[guidedhelpid="save_changes_button"]')
            await time(3000)
            await page.close()
            await browser.close()
            return feedback
            // await time(5000)
            // if (grantAccess.entity == entity) {
            //     await page.waitForSelector('.FH')
            //     await time(2000)
            //     await page.click('.FH')
            //     await time(2000)
            //     let op = await page.$$("label:nth-child(6) span")
            //     await time(2000)
            //     await op[0].click()
            //     await time(2000)
            //     let cos = await page.$$("label:nth-child(6) div button")
            //     await time(2000)
            //     await cos[0].click()
            //     await time(7000)
            //     let s = 0
            //     let checkSpan = await page.$$("td.r9 table tr td")
            //     for (let i = 0; i < 3; i++) {
            //         s = s + 1
            //         if (s % 2 == 0) {
            //             s = s + 1
            //         }
            //         console.log(s);
            //         await time(1000)
            //         checkSpan[s].click()
            //         await time(1000)
            //         let sp = await page.$$('[act="z"] .J-N-Jz')
            //         await time(1000)
            //         await sp[sp.length - 1].click()
            //         await time(1000)
            //     }
            //     await time(3000)
            //     let btn = await page.$$('[guidedhelpid="save_changes_button"]')
            //     await time(2000)
            //     await btn[0].click()

            // } else {
            //     console.log("no access !!");
            // }
        }
    } catch (e) {
        console.log(e.message);
        console.log("catch error");
        if (e.message == 'No element found for selector: .a5p') {
            await time(3000)
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-English-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-English-${data.id_process}.png`
            await time(3000)
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            await time(3000)
            await page.close()
            await browser.close()
            console.log(feedback);
            return feedback
        }
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        await time(3000)
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        await page.close()
        await browser.close()
        console.log(feedback);
        return feedback
    }

}

const notSpam = async (data, pages, mode, subject) => {
    let feedback = ''
    let details = ''
    const obj = await login(data, mode)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback

    await time(10000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    await time(10000)
    const countEnter = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countEnter.length == 0) {
        details += `Entre unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
        details += `Entre unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `Entre unread inbox : ${countEnter[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }

    await page.waitForSelector('.CJ')
    await page.click('.CJ')
    await time(3000)
    page.waitForSelector('a[href="https://mail.google.com/mail/u/0/#spam"]')
    page.click('a[href="https://mail.google.com/mail/u/0/#spam"]')
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-spam-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-spam-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    await time(3000)
    console.log(`treated pages: ${pages}`);
    let link
    if (subject != undefined) {
        let sb = await subject.split(' ')
        console.log(sb);
        let string = await sb.join('+')
        console.log(string)
        link = `https://mail.google.com/mail/u/0/#search/in%3Aspam+subject%3A(${string})`
    } else {
        link = `https://mail.google.com/mail/u/0/#search/in%3Aspam`
    }
    await time(3000)
    await page.goto(link)
    await time(3000)
    if (pages == undefined) {
        let i = 0
        while (true) {
            console.log(`starting page : ${i + 1}`);
            await time(3000)
            const status = await page.evaluate(() => {
                let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
                checkSpan.item(1).click()
                return checkSpan.item(1).ariaChecked
            })
            await time(3000)
            console.log(status);
            if (status == 'true') {
                await page.waitForSelector('div[act="18"]')
                await time(3000)
                await page.click('div[act="18"]')
                await time(3000)
                await page.goto(link)
                i++
            } else {
                console.log(`page ${i + 1} have no mode messages`);
                await page.screenshot({
                    path: `${path}/${data.gmail.split('@')[0]}-@-spamResult-${data.id_process}.png`
                });
                feedback += `, ${data.gmail.split('@')[0]}-@-spamResult-${data.id_process}.png`
                await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
                const countOut = await page.evaluate(() => {
                    let html = []
                    let el = document.querySelectorAll('.bsU')
                    let elSpan = document.querySelectorAll('.nU.n1 a')
                    for (let i = 0; i < el.length; i++) {
                        html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                    }
                    return html
                })
                if (countOut.length == 0) {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else {
                    details += `, Out unread inbox  : ${countOut[0].count}`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                }
                await page.close()
                await browser.close()
                return feedback
            }
        }
    } else {
        for (let i = 0; i < pages; i++) {
            console.log(`starting page : ${i + 1}`);
            await time(3000)
            const status = await page.evaluate(() => {
                let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
                checkSpan.item(1).click()
                return checkSpan.item(1).ariaChecked
            })
            await time(3000)
            console.log(status);
            if (status == 'true') {
                await page.waitForSelector('div[act="18"]')
                await time(3000)
                await page.click('div[act="18"]')
                await time(3000)
                await page.goto(link)
            } else {
                console.log(`page ${i + 1} have no mode messages`);
                await page.screenshot({
                    path: `${path}/${data.gmail.split('@')[0]}-@-spamResult-${data.id_process}.png`
                });
                feedback += `, ${data.gmail.split('@')[0]}-@-spamResult-${data.id_process}.png`
                await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
                const countOut = await page.evaluate(() => {
                    let html = []
                    let el = document.querySelectorAll('.bsU')
                    let elSpan = document.querySelectorAll('.nU.n1 a')
                    for (let i = 0; i < el.length; i++) {
                        html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                    }
                    return html
                })
                if (countOut.length == 0) {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else {
                    details += `, Out unread inbox  : ${countOut[0].count}`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                }
                await page.close()
                await browser.close()
                return feedback
            }
        }
    }
    await time(6000)
    await page.goto('https://mail.google.com/mail/u/0/#inbox')
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-spamResult-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-spamResult-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    const countOut = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countOut.length == 0) {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `, Out unread inbox  : ${countOut[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    await page.close()
    await browser.close()
    return feedback
}

const markAsSpam = async (data, pages, mode, subject) => {
    let feedback = ''
    let details = ''
    const obj = await login(data, mode)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback

    await time(10000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    await time(10000)

    const countEnter = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countEnter.length == 0) {
        details += `Entre unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
        details += `Entre unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `Entre unread inbox : ${countEnter[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    await time(3000)
    console.log(`treated pages : ${pages}`);
    let link
    if (subject != undefined) {
        let sb = await subject.split(' ')
        console.log(sb);
        let string = await sb.join('+')
        console.log(string)
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+subject%3A(${string})`
    } else {
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox`
    }
    await time(3000)
    await page.goto(link)
    await time(3000)
    if (pages == undefined) {
        let i = 0
        while (true) {
            console.log(`starting page : ${i + 1}`);
            await time(3000)
            const status = await page.evaluate(() => {
                let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
                checkSpan.item(0).click()
                return checkSpan.item(0).ariaChecked
            })
            await time(3000)
            console.log(status);
            if (status == 'true') {
                console.log('i will click');
                await page.waitForSelector('div[act="9"]')
                await time(3000)
                await page.click('div[act="9"]')
                console.log('clicked');
                await page.goto(link)
                i++
            } else {
                console.log(`page ${i + 1} have no mode messages`);
                await page.screenshot({
                    path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                });
                feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
                await time(3000)
                const countOut = await page.evaluate(() => {
                    let html = []
                    let el = document.querySelectorAll('.bsU')
                    let elSpan = document.querySelectorAll('.nU.n1 a')
                    for (let i = 0; i < el.length; i++) {
                        html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                    }
                    return html
                })
                if (countOut.length == 0) {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else {
                    details += `, Out unread inbox : ${countOut[0].count}`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                }
                await page.close()
                await browser.close()
                return feedback
            }
        }
    } else {
        for (let i = 0; i < pages; i++) {
            console.log(`starting page : ${i + 1}`);
            await time(3000)
            const status = await page.evaluate(() => {
                let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
                checkSpan.item(0).click()
                return checkSpan.item(0).ariaChecked
            })
            await time(3000)
            console.log(status);
            if (status == 'true') {
                console.log('i will click');
                await page.waitForSelector('div[act="9"]')
                await time(3000)
                await page.click('div[act="9"]')
                console.log('clicked');
                await page.goto(link)
            } else {
                console.log(`page ${i + 1} have no mode messages`);
                await page.screenshot({
                    path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                });
                feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
                await time(3000)
                const countOut = await page.evaluate(() => {
                    let html = []
                    let el = document.querySelectorAll('.bsU')
                    let elSpan = document.querySelectorAll('.nU.n1 a')
                    for (let i = 0; i < el.length; i++) {
                        html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                    }
                    return html
                })
                if (countOut.length == 0) {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else {
                    details += `, Out unread inbox : ${countOut[0].count}`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                }
                await page.close()
                await browser.close()
                return feedback
            }
        }
    }
    await time(6000)
    await page.goto('https://mail.google.com/mail/u/0/#inbox')
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    const countOut = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countOut.length == 0) {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `, Out unread inbox : ${countOut[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    await page.close()
    await browser.close()
    return feedback
}

const markAsUnread = async (data, pages, mode, subject) => {
    let feedback = ''
    let details = ''
    const obj = await login(data, mode)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback

    await time(10000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    await time(10000)

    const countEnter = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countEnter.length == 0) {
        details += `Entre unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
        details += `Entre unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `Entre unread inbox : ${countEnter[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    await time(3000)
    console.log(`treated pages : ${pages}`);
    let link
    if (subject != undefined) {
        let sb = await subject.split(' ')
        console.log(sb);
        let string = await sb.join('+')
        console.log(string)
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aread+subject%3A(${string})`
    } else {
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aread`
    }
    await time(3000)
    await page.goto(link)
    await time(3000)

    if (pages == undefined) {
        let i = 0
        while (i < 999999) {
            console.log(`starting page : ${i + 1}`);
            await time(3000)
            const status = await page.evaluate(() => {
                let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
                checkSpan.item(1).click()
                return checkSpan.item(1).ariaChecked
            })
            await time(3000)
            console.log(status);
            if (status == 'true') {
                await time(3000)
                let c = await page.$$('div[act="2"]')
                await time(3000)
                await c[1].click();
                await time(3000)
                await page.goto(link)
                i++
            } else {
                console.log(`page ${i + 1} have no mode messages`);
                await page.screenshot({
                    path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                });
                feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
                await time(3000)
                const countOut = await page.evaluate(() => {
                    let html = []
                    let el = document.querySelectorAll('.bsU')
                    let elSpan = document.querySelectorAll('.nU.n1 a')
                    for (let i = 0; i < el.length; i++) {
                        html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                    }
                    return html
                })
                if (countOut.length == 0) {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else {
                    details += `, Out unread inbox : ${countOut[0].count}`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                }
                console.log(details);
                await page.close()
                await browser.close()
                return feedback
            }
        }
    } else {
        for (let i = 0; i < pages; i++) {
            console.log(`starting page : ${i + 1}`);
            await time(3000)
            const status = await page.evaluate(() => {
                let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
                checkSpan.item(1).click()
                return checkSpan.item(1).ariaChecked
            })
            await time(3000)
            console.log(status);
            if (status == 'true') {
                await time(3000)
                let c = await page.$$('div[act="2"]')
                await time(3000)
                await c[1].click();
                await time(3000)
                await page.goto(link)
            } else {
                console.log(`page ${i + 1} have no mode messages`);
                await page.screenshot({
                    path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                });
                feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
                await time(3000)
                const countOut = await page.evaluate(() => {
                    let html = []
                    let el = document.querySelectorAll('.bsU')
                    let elSpan = document.querySelectorAll('.nU.n1 a')
                    for (let i = 0; i < el.length; i++) {
                        html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                    }
                    return html
                })
                if (countOut.length == 0) {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else {
                    details += `, Out unread inbox : ${countOut[0].count}`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                }
                console.log(details);
                await page.close()
                await browser.close()
                return feedback
            }
        }
    }
    await time(6000)
    await page.goto('https://mail.google.com/mail/u/0/#inbox')
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    const countOut = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countOut.length == 0) {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `, Out unread inbox : ${countOut[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    console.log(details);
    await page.close()
    await browser.close()
    return feedback
}

const markAsRead = async (data, pages, mode, subject) => {
    let feedback = ''
    let details = ''
    const obj = await login(data, mode)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback

    await time(10000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    await time(10000)

    const countEnter = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countEnter.length == 0) {
        details += `Entre unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
        details += `Entre unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `Entre unread inbox : ${countEnter[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    await time(3000)
    console.log(`treated pages : ${pages}`);
    let link
    if (subject != undefined) {
        let sb = await subject.split(' ')
        console.log(sb);
        let string = await sb.join('+')
        console.log(string)
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aunread+subject%3A(${string})`
    } else {
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aunread`
    }
    await time(3000)
    await page.goto(link)
    await time(3000)
    if (pages == undefined) {
        let i = 0
        while (i < 999999) {
            console.log(`starting page : ${i + 1}`);
            await time(3000)
            const status = await page.evaluate(() => {
                let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
                checkSpan.item(1).click()
                return checkSpan.item(1).ariaChecked
            })
            await time(3000)
            console.log(status);
            if (status == 'true') {
                await time(3000)
                let c = await page.$$('div[act="1"]')
                await time(3000)
                await c[1].click();
                await time(3000)
                await page.goto(link)
                i++
            } else {
                console.log(`page ${i + 1} have no mode messages`);
                await page.screenshot({
                    path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                });
                feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
                await time(3000)
                const countOut = await page.evaluate(() => {
                    let html = []
                    let el = document.querySelectorAll('.bsU')
                    let elSpan = document.querySelectorAll('.nU.n1 a')
                    for (let i = 0; i < el.length; i++) {
                        html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                    }
                    return html
                })
                if (countOut.length == 0) {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else {
                    details += `, Out unread inbox : ${countOut[0].count}`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                }
                console.log(details);
                await page.close()
                await browser.close()
                return feedback
            }
        }
    } else {
        for (let i = 0; i < pages; i++) {
            console.log(`starting page : ${i + 1}`);
            await time(3000)
            const status = await page.evaluate(() => {
                let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
                checkSpan.item(1).click()
                return checkSpan.item(1).ariaChecked
            })
            await time(3000)
            console.log(status);
            if (status == 'true') {
                await time(3000)
                let c = await page.$$('div[act="1"]')
                await time(3000)
                await c[1].click();
                await time(3000)
                await page.goto(link)
            } else {
                console.log(`page ${i + 1} have no mode messages`);
                await page.screenshot({
                    path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                });
                feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
                await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
                await time(3000)
                const countOut = await page.evaluate(() => {
                    let html = []
                    let el = document.querySelectorAll('.bsU')
                    let elSpan = document.querySelectorAll('.nU.n1 a')
                    for (let i = 0; i < el.length; i++) {
                        html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
                    }
                    return html
                })
                if (countOut.length == 0) {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                    details += `, Out unread inbox : 0`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                } else {
                    details += `, Out unread inbox : ${countOut[0].count}`
                    await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
                }
                console.log(details);
                await page.close()
                await browser.close()
                return feedback
            }
        }
    }
    await time(6000)
    await page.goto('https://mail.google.com/mail/u/0/#inbox')
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    const countOut = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countOut.length == 0) {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `, Out unread inbox : ${countOut[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    console.log(details);
    await page.close()
    await browser.close()
    return feedback
}

const openInbox = async (data, count, options, mode, subject) => {
    let feedback = ''
    let details = ''
    const obj = await login(data, mode)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback
    await time(10000)

    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-openInbox-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-openInbox-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

    const countEnter = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countEnter.length == 0) {
        details += `Entre unread inbox : 0`
    } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
        details += `Entre unread inbox : 0`
    } else {
        details += `Entre unread inbox : ${countEnter[0].count}`
    }

    console.log(details);
    let link
    if (subject != undefined) {
        let sb = await subject.split(' ')
        console.log(sb);
        let string = await sb.join('+')
        console.log(string)
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aunread+subject%3A(${string})`
    } else {
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aunread`
    }
    console.log(link);
    await time(3000)
    await page.goto(link)
    await time(3000)
    console.log(await page.url());
    await time(10000)

    console.log('Messages to read : ' + count);
    let unreadOpen
    if (count == undefined) {
        let i = 0
        while (i < 99999) {
            await time(3000)
            unreadOpen = await page.evaluate((i) => {
                let html = []
                let length = document.querySelectorAll(`.F.cf.zt`).length
                let el = document.querySelectorAll(`.F.cf.zt`)[length - 1].tBodies.item(0).childNodes
                if (el.length == 0) {
                    let checkMessage = document.querySelectorAll('.TC')
                    if (checkMessage.length != 0) {
                        return false
                    } else {
                        return true
                    }
                }
                el.item(0).click()
                html.push({ messageOpened: i + 1, message: el.item(0).children.item(4).innerText })
                return html
            }, i)
            console.log(unreadOpen);
            if (!unreadOpen) {
                break
            } else if (unreadOpen == true) {
                await page.goto(link)
                if (await page.url() == link) {
                    await page.click('#aso_search_form_anchor button.gb_Ee.gb_Fe.bEP')
                }
            } else {
                await time(4000)
                switch (options.markAsStarted) {
                    case true:
                        let starts = await page.evaluate(() => {
                            let s = document.querySelectorAll('.zd.bi4')
                            return s[0].ariaLabel
                        })
                        await time(3000)
                        if (starts != 'Starred') {
                            let star = await page.$$('.zd.bi4')
                            await star[0].click()
                        }
                        break;
                    default:
                        console.log('false');
                        break;
                }
                await time(3000)
                switch (options.markAsImportant) {
                    case true:
                        let options = await page.evaluate(() => {
                            let s = document.querySelectorAll("div.pG")
                            if (s.length == 0) {
                                return null
                            }
                            return s[s.length - 1].ariaChecked
                        })
                        await time(2000)
                        console.log('options : ' + options);
                        if (options == 'false') {
                            let opt = await page.$$("div.pG div.pH-A7.a9q")
                            await time(2000)
                            await opt[opt.length - 1].click()
                        } else if (options == null) {
                            await time(3000)
                            let m = await page.$$('.bjy.T-I-J3.J-J5-Ji')
                            await m[m.length - 1].click()
                            await time(2000)
                            let imp = await page.evaluate(() => {
                                let o = document.querySelectorAll('.Kk8Fcb.sVHnob.J-N-JX')
                                return o[0].parentElement.parentElement.ariaHidden
                            })
                            await time(2000)
                            if (imp != 'true') {
                                let markImp = await page.$$('.Kk8Fcb.sVHnob.J-N-JX')
                                await markImp[0].click()
                            }
                        }
                        break;
                    default:
                        console.log('false');
                        break;
                }
                await time(3000)
                switch (options.click) {
                    case true:
                        console.log('click');
                        let options = await page.evaluate(() => {
                            let keys = []
                            let s = document.querySelectorAll(".ii.gt a")
                            if (s.length == 0) {
                                return null
                            }
                            for (let i = 0; i < s.length; i++) {
                                if (s[i].offsetWidth == 0 || s[i].href == '' || s[i].href.includes('mailto:') || s[i].href.includes("google.com") || s[i].target != '_blank') {
                                    keys.push({ index: i, state: false })
                                } else {
                                    keys.push({ index: i, state: true })
                                }
                            }
                            return keys
                        })
                        await time(2000)
                        console.log(options);
                        let the_one = false
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].state == true) {
                                let link = await page.$$(".ii.gt a")
                                await time(2000)
                                await link[options[i].index].click()
                                the_one = options[i].state
                                break
                            }
                        }
                        console.log(the_one);
                        if (the_one) {
                            await time(30000)
                            let pages = await browser.pages()
                            await time(1000)
                            console.log(pages[2]);
                            await time(1000)
                            await pages[2].close()
                        }
                        break;
                    default:
                        console.log('false');
                        break;
                }
                // return
                await time(3000)
                await page.goto(link)
                if (await page.url() == link) {
                    await page.click('#aso_search_form_anchor button.gb_Ee.gb_Fe.bEP')
                }
                i++
            }
        }
    } else {
        for (let i = 0; i < count; i++) {
            await time(3000)
            unreadOpen = await page.evaluate((i) => {
                let html = []
                let length = document.querySelectorAll(`.F.cf.zt`).length
                let el = document.querySelectorAll(`.F.cf.zt`)[length - 1].tBodies.item(0).childNodes
                if (el.length == 0) {
                    let checkMessage = document.querySelectorAll('.TC')
                    if (checkMessage.length != 0) {
                        return false
                    } else {
                        return true
                    }
                }
                el.item(0).click()
                html.push({ messageOpened: i + 1, message: el.item(0).children.item(4).innerText })
                return html
            }, i)
            console.log(unreadOpen);
            if (!unreadOpen) {
                break
            } else if (unreadOpen == true) {
                await page.goto(link)
                if (await page.url() == link) {
                    await page.click('#aso_search_form_anchor button.gb_Ee.gb_Fe.bEP')
                }
            } else {
                await time(4000)
                switch (options.markAsStarted) {
                    case true:
                        let starts = await page.evaluate(() => {
                            let s = document.querySelectorAll('.zd.bi4')
                            return s[0].ariaLabel
                        })
                        await time(3000)
                        if (starts != 'Starred') {
                            let star = await page.$$('.zd.bi4')
                            await star[0].click()
                        }
                        break;
                    default:
                        console.log('false');
                        break;
                }
                await time(3000)
                switch (options.markAsImportant) {
                    case true:
                        let options = await page.evaluate(() => {
                            let s = document.querySelectorAll("div.pG")
                            if (s.length == 0) {
                                return null
                            }
                            return s[s.length - 1].ariaChecked
                        })
                        await time(2000)
                        console.log('options : ' + options);
                        if (options == 'false') {
                            let opt = await page.$$("div.pG div.pH-A7.a9q")
                            await time(2000)
                            await opt[opt.length - 1].click()
                        } else if (options == null) {
                            await time(3000)
                            let m = await page.$$('.bjy.T-I-J3.J-J5-Ji')
                            await m[m.length - 1].click()
                            await time(2000)
                            let imp = await page.evaluate(() => {
                                let o = document.querySelectorAll('.Kk8Fcb.sVHnob.J-N-JX')
                                return o[0].parentElement.parentElement.ariaHidden
                            })
                            await time(2000)
                            if (imp != 'true') {
                                let markImp = await page.$$('.Kk8Fcb.sVHnob.J-N-JX')
                                await markImp[0].click()
                            }
                        }
                        break;
                    default:
                        console.log('false');
                        break;
                }
                await time(3000)
                switch (options.click) {
                    case true:
                        console.log('click');
                        let options = await page.evaluate(() => {
                            let keys = []
                            let s = document.querySelectorAll(".ii.gt a")
                            if (s.length == 0) {
                                return null
                            }
                            for (let i = 0; i < s.length; i++) {
                                if (s[i].offsetWidth == 0 || s[i].href == '' || s[i].href.includes('mailto:') || s[i].href.includes("google") || s[i].target != '_blank') {
                                    keys.push({ index: i, state: false })
                                } else {
                                    keys.push({ index: i, state: true })
                                }
                            }
                            return keys
                        })
                        await time(2000)
                        console.log(options);
                        let the_one = false
                        for (let i = 0; i < options.length; i++) {
                            if (options[i].state == true) {
                                let link = await page.$$(".ii.gt a")
                                await time(2000)
                                await link[options[i].index].click()
                                the_one = options[i].state
                                break
                            }
                        }
                        console.log(the_one);
                        if (the_one) {
                            await time(30000)
                            let pages = await browser.pages()
                            await time(1000)
                            console.log(pages[2]);
                            await time(1000)
                            await pages[2].close()
                        }
                        break;
                    default:
                        console.log('false');
                        break;
                }
                await time(3000)
                await page.goto(link)
                if (await page.url() == link) {
                    await page.click('#aso_search_form_anchor button.gb_Ee.gb_Fe.bEP')
                }
            }
        }
    }

    await time(6000)
    await page.goto('https://mail.google.com/mail/u/0/#inbox')
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-openInboxResult-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-openInboxResult-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    const countOut = await page.evaluate(() => {
        let html = []
        let el = document.querySelectorAll('.bsU')
        let elSpan = document.querySelectorAll('.nU.n1 a')
        for (let i = 0; i < el.length; i++) {
            html.push({ count: el.item(i).innerHTML, element: elSpan.item(i).innerHTML })
        }
        return html
    })
    if (countOut.length == 0) {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
        details += `, Out unread inbox : 0`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `, Out unread inbox  : ${countOut[0].count}`
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    await page.close()
    await browser.close()
    return feedback
}

const getRefreshToken = async (data) => {
    console.log('we will start getRefreshToken');
    console.log(data);
    let feedback = ''
    console.log(data);
    let obj = await login(data, 'Cookies')
    console.log(obj);
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback
    await time(10000)


    let d = {
        id_process: 2,
        id_list: 1,
        id_user: 20,
        action: 'authO',
        offer: 'none',
        data: 'none',
        count: 0,
        counter: null,
        add_date: '2024-01-04T13:01: 28.942Z',
        update_date: '2024-01-04T13:01: 28.942Z',
        start_in: '2024-01-05T10:09:29.991-05:00',
        end_in: null,
        dataorigin: 'none',
        status: 'active',
        id_seed: 10781,
        id_project: 2,
        gmail: 'mahndran34256@gmail.com',
        password: '724220774',
        proxy: '38.34.185.143:3838',
        verification: 'penelope.thompson.673@outlook.com',
        refresh_token: null,
        isp: 'gmail',
        id_account: 3,
        name: 'Gmail API nodeJS',
        client_id: '936739117009-vkd4nfvpmdeqm1vo33r3s35pvb1uhu3f.apps.googleusercontent.com',
        client_secret: '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',
        redirect_url: 'https://developers.google.com/oauthplayground',
        scope: 'https://mail.google.com'
    }


    try {
        const navigationPromise = page.waitForNavigation()
        await page.goto(data.redirect_url)
        await navigationPromise
        await time(3000)
        page.waitForSelector('#oauthConfigButton')
        await time(3000)
        page.click('#oauthConfigButton')
        await time(3000)
        page.waitForSelector('#useDefaultOauthCred')
        await time(3000)
        page.click('#useDefaultOauthCred')
        await time(3000)
        page.waitForSelector('#oauthClientId')
        await time(3000)
        await page.type('#oauthClientId', data.client_id, { delay: 100 })
        await time(3000)
        page.waitForSelector('#oauthClientSecret')
        await time(3000)
        await page.type('#oauthClientSecret', data.client_secret, { delay: 100 })
        await time(3000)
        page.waitForSelector('#scopes')
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-scope-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-scope-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await page.type('#scopes', data.scope, { delay: 100 })
        await time(3000)
        page.waitForSelector('#authorizeApisButton')
        await time(3000)
        page.click('#authorizeApisButton')
        await navigationPromise
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-authO-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-authO-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
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
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-authorization-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-authorization-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        page.waitForSelector('[jsname="BO4nrb"]')
        await time(3000)
        page.click('[jsname="BO4nrb"]')

        await time(3000)
        page.waitForSelector('[jsname="ehL7e"]')
        await time(3000)
        page.click('[jsname="ehL7e"]')
        await time(3000)

        let b = await page.$$('.VfPpkd-RLmnJb')
        await time(3000)
        await b[1].click()
        await navigationPromise
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-granted-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-granted-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        page.waitForSelector('#exchangeCode')
        await time(3000)
        page.click('#exchangeCode')
        await time(4000)

        page.waitForSelector('#step2')
        await time(3000)
        page.click('#step2')
        await time(3000)

        let refresh_token = await page.evaluate(() => {
            let f = document.getElementById('refresh_token').value
            return f
        })
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-refresh_token-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-refresh_token-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        await cloudSeedManager.saveRefreshToken({ refresh_token: refresh_token, id_list: data.id_list, id_seed: data.id_seed })
        await time(3000)
        await page.close()
        await browser.close()
        return feedback
    } catch (error) {
        console.log(error.message + ' ' + data.gmail);
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        await page.close()
        await browser.close()
        return feedback
    }
}

const kill = (id_process) => {
    pidProcess.forEach(Element => {
        if (Element.id_process == id_process) {
            let state = require('is-running')(Element.pid)
            if (state) {
                try {
                    process.kill(Element.pid, 'SIGINT')
                } catch (error) {
                    console.log(error);
                } finally {
                    pidProcess.splice(pidProcess.indexOf(Element.pid), 1)
                }
            }
        }
    })
}

module.exports = {
    verify,
    notSpam,
    markAsSpam,
    openInbox,
    markAsUnread,
    markAsRead,
    kill,
    getRefreshToken,
}


