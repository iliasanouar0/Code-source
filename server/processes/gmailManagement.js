const resultsManager = require('../managers/resultManager')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
const fs = require('fs')
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
let pidProcess = []


const login = async (data) => {
    let feedback = ''
    let arg
    if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
        arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    } else {
        const proxyServer = `${data.proxy}`;
        arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    }
    console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
    console.log(` `);
    const browser = await puppeteer.launch({ headless: 'new', args: arg })
    const browserPID = browser.process().pid
    const page = await browser.newPage()
    pidProcess.push({ id_process: data.id_process, pid: browserPID })
    await page.setViewport({ width: 1280, height: 720 });
    const navigationPromise = page.waitForNavigation()
    let file = `${cookies}/${data.gmail.split('@')[0]}-@-init-Gmail.json`
    fs.access(file, fs.constants.F_OK | fs.constants.W_OK, async (err) => {
        if (err) {
            console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
        } else {
            let cookies = JSON.parse(fs.readFileSync(file));
            await page.setCookie(...cookies);
        }
    })
    await page.goto('https://gmail.com')
    await navigationPromise
    await time(5000)
    if (await page.url() == "https://mail.google.com/mail/u/0/#inbox") {
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        });
        feedback += `${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        const cookiesObject = await page.cookies()
        let NewFileJson = JSON.stringify(cookiesObject)
        fs.writeFile(`${cookies}/${data.gmail.split('@')[0]}-@-init-Gmail.json`, NewFileJson, { spaces: 2 }, (err) => {
            if (err) {
                console.log(err);
            }
        })
    } else {
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
        });
        feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', data.gmail, { delay: 100 })
        await page.waitForSelector('#identifierNext')
        await page.click('#identifierNext')
        await page.waitForSelector('input[type="password"]')
        await time(5000)
        page.type('input[type="password"]', data.password, { delay: 200 })
        await time(3000)
        page.waitForSelector('#passwordNext')
        page.click('#passwordNext')
        await navigationPromise
        await time(10000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        const cookiesObject = await page.cookies()
        let NewFileJson = JSON.stringify(cookiesObject)
        console.log(NewFileJson);
        fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
            if (err) {
                throw err
            }
        })
    }
    return { browser: browser, page: page, feedback: feedback }
}

const verify = async (data) => {
    let arg
    if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
        arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    } else {
        const proxyServer = `${data.proxy}`;
        arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    }
    console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
    console.log(` `);
    let feedback = ''
    const browser = await puppeteer.launch({ headless: 'new', args: arg })
    const browserPID = browser.process().pid
    const page = await browser.newPage()
    pidProcess.push({ id_process: data.id_process, pid: browserPID })
    await page.setViewport({ width: 1280, height: 720 });
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://gmail.com/')
    await navigationPromise
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
    });
    feedback += `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    await page.waitForSelector('input[type="email"]')
    await page.click('input[type="email"]')
    await navigationPromise
    await page.type('input[type="email"]', data.gmail, { delay: 100 })
    await page.waitForSelector('#identifierNext')
    await page.click('#identifierNext')
    await navigationPromise
    await time(10000)
    if (await page.$('[aria-invalid="true"]') != null || await page.$('#next > div > div > a') != null) {
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
    await navigationPromise
    await time(3000);
    try {
        await page.waitForSelector('input[type="password"]', { timeout: 500 })
    } catch (error) {
        if (error) {
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
    }
    await page.type('input[type="password"]', data.password, { delay: 200 })
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-password-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-password-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    await time(1000)
    await Promise.all([
        page.$eval(`#passwordNext`, element =>
            element.click()
        ),
        await page.waitForNavigation(),
    ]);
    await time(1000)
    if (await page.$('[aria-invalid="true"]') != null) {
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
        });
        await page.close()
        await browser.close()
        console.log(`invalid email : ${data.gmail}`);
        feedback += `, ${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        return feedback
    }
    await navigationPromise
    await time(3000)
    console.log(page.url());
    if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
        console.log('verified email : ' + data.gmail);
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        });
        const count = await page.$eval('.bsU', element => {
            return element.innerHTML
        })
        console.log(count);
        await resultsManager.saveDetails({ details: `Unread inbox : ${count}`, id_seeds: data.id_seeds, id_process: data.id_process })
        await page.close()
        await browser.close()
        feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        return feedback
    }
    await navigationPromise
    await time(2000)
    console.log(page.url());
    await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3)')
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
    await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
    await time(2000)
    await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
    await navigationPromise
    await time(10000)
    if (await page.$('[aria-invalid="true"]') != null) {
        console.log('invalid verification : ' + data.verification);
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalid-verification-${data.id_process}.png`
        });

        await page.close()
        await browser.close()
        feedback += `, ${data.gmail.split('@')[0]}-@-invalid-verification-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        return feedback
    }
    if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
        console.log('verified email : ' + data.gmail);
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        });
        const count = await page.$eval('.bsU', element => {
            return element.innerHTML
        })
        console.log(count);
        await resultsManager.saveDetails({ details: `Unread inbox : ${count}`, id_seeds: data.id_seeds, id_process: data.id_process })
        await page.close()
        await browser.close()
        feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        return feedback
    }
}

const notSpam = async (data, pages) => {
    let feedback = ''
    let details = ''
    const obj = await login(data)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback

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
    await time(10000)
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
    console.log(pages);
    console.log(typeof (pages));
    for (let i = 0; i < pages; i++) {
        console.log(i);
        
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
            await page.waitForSelector('div[act="18"]')
            await page.click('div[act="18"]')
            await time(7000)
        } else {
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

const markAsSpam = async (data, pages) => {
    let feedback = ''
    let details = ''
    const obj = await login(data)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback

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
    console.log(typeof (pages));
    for (let i = 0; i < pages; i++) {
        await time(3000)
        const status = await page.evaluate(() => {
            let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
            checkSpan.item(0).click()
            return checkSpan.item(0).ariaChecked
        })
        await time(3000)
        console.log(status);
        if (status == 'true') {
            await time(3000)
            await page.waitForSelector('div[act="9"]')
            await page.click('div[act="9"]')
            await time(7000)
        } else {
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
    kill,
}


