const resultsManager = require('../managers/resultManager')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
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
let pidProcess = []


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

const notSpam = async (data) => {
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
    let details = ''
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
    await page.waitForSelector('input[type="password"]')
    await time(5000)
    page.type('input[type="password"]', data.password, { delay: 200 })
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-password-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-password-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
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
    try {
        const countInbox = await page.$eval('.bsU', element => {
            return element.innerHTML
        })
        details += `Entre unread inbox : ${countInbox}`
        console.log(countInbox);
        await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } catch (error) {
        details += `Entre unread inbox : 0`
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
        path: `${path}/${data.gmail.split('@')[0]}-@-span-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-span-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    await time(3000)
    const elements = await page.$x('/html/body/div[7]/div[3]/div/div[2]/div[2]/div/div/div/div[1]/div[2]/div[2]/div[1]/div/div/div[1]/div/div[1]/span')
    await time(3000)
    await elements[0].click()
    await time(3000)
    if (await page.$('div[act="18"]') != null) {
        page.waitForSelector('div[act="18"]')
        page.click('div[act="18"]')
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-spanResult-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-spanResult-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        try {
            const countInbox = await page.$eval('.bsU', element => {
                return element.innerHTML
            })
            details += `, Out unread inbox : ${countInbox}`
            console.log(countInbox);
            await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
        } catch (error) {
            details += `, Out unread inbox : 0`
            await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
        }
        await page.close()
        await browser.close()
        return feedback
    } else {
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-noSpan-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-noSpan-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        try {
            const countInbox = await page.$eval('.bsU', element => {
                return element.innerHTML
            })
            details += `, Out unread inbox : ${countInbox}`
            console.log(countInbox);
            await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
        } catch (error) {
            details += `, Out unread inbox : 0`
            await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
        }
        await page.close()
        await browser.close()
        return feedback
    }

}

const markAsSpam = async (data) => {
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
    let details = ''
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
    await page.waitForSelector('input[type="password"]')
    await time(5000)
    page.type('input[type="password"]', data.password, { delay: 200 })
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-password-${data.id_process}.png`
    });
    feedback += `, ${data.gmail.split('@')[0]}-@-password-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
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
    try {
       /* const countInbox = */await page.$$eval('.bsU', element => {
        console.log(element);
        // return element[0].innerHTML
    })
        // details += `Entre unread inbox : ${countInbox}`
        // console.log(countInbox);
        // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } catch (error) {
        // console.log(error.message);
        // console.log(error.message == 'Error: failed to find element matching selector ".bsU"');
        if (error.message == 'Error: failed to find element matching selector ".bsU"') {
            details += `Entre unread inbox : 0`
            console.log(details);
            await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
        } else {
            console.log(error);
        }
        // details += `Entre unread inbox : 0`
        // console.log(details);
        // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    await time(10000)
    await page.evaluate(() => {
        document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
    })
    await time(3000)
    if (await page.$('div[act="9"]') != null) {
        page.waitForSelector('div[act="9"]')
        page.click('div[act="9"]')
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-inboxResult-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-inboxResult-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        try {
            const countInbox = await page.$eval('.bsU', element => {
                return element.innerHTML
            })
            details += `, Out unread inbox : ${countInbox}`
            console.log(countInbox);
            await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
        } catch (error) {
            details += `, Out unread inbox : 0`
            await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
        }
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
    kill,
}


