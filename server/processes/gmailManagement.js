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
    console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
    console.log(` `);
    let feedback = ''
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox'] })
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
    console.log('browser in ' + page.url());
    if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
        console.log('verified email : ' + data.gmail);
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        });
        await page.close()
        await browser.close()
        feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        return feedback
    }
    await navigationPromise
    await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3)')
    await time(2000)
    await page.type('#knowledge-preregistered-email-response', data.verification, { delay: 100 })
    await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
    await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
    await navigationPromise
    await time(2000)
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
    await page.goto('https://mail.google.com/mail/u/0/#inbox')
    await navigationPromise
    console.log('verified email : ' + data.gmail);
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
    });
    await page.close()
    await browser.close()
    feedback += `, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
    await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    return feedback
}

// const verify = async (data) => {
//     console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
//     console.log(` `);

//     let feedback = ''
//     const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox'] })
//     const browserPID = browser.process().pid
//     const page = await browser.newPage()
//     pidProcess.push({ id_process: data.id_process, pid: browserPID })
//     await page.setViewport({ width: 1280, height: 720 });
//     const navigationPromise = page.waitForNavigation()
//     await page.goto('https://gmail.com/')
//     await navigationPromise
//     await page.waitForSelector('input[type="email"]')
//     await page.click('input[type="email"]')
//     await navigationPromise
//     await page.type('input[type="email"]', data.gmail, { delay: 100 })
//     await page.waitForSelector('#identifierNext')
//     await page.click('#identifierNext')
//     await navigationPromise
//     await time(10000)
//     if (await page.$('[aria-invalid="true"]') != null || await page.$('#next > div > div > a') != null) {
//         // await page.close()
//         // await browser.close()
//         console.log(`invalid email : ${data.gmail}`);
//     }
//     await navigationPromise
//     await time(3000);
//     try {
//         await page.waitForSelector('input[type="password"]', { timeout: 500 })
//     } catch (error) {
//         if (error) {
//             // await page.close()
//             // await browser.close()
//             console.log(`invalid email : ${data.gmail}`);
//         }
//     }
//     await page.type('input[type="password"]', data.password, { delay: 200 })
//     await time(1000)
//     await Promise.all([
//         page.$eval(`#passwordNext`, element =>
//             element.click()
//         ),
//         await page.waitForNavigation(),
//     ]);
//     await time(1000)
//     if (await page.$('[aria-invalid="true"]') != null) {
//         console.log('invalid pass');
//         // await page.close()
//         // await browser.close()
//     }
//     await navigationPromise
//     if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
//         console.log('verified email : ' + data.gmail);
//         // await page.close()
//         // await browser.close()
//         return
//     }
//     await navigationPromise
//     await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3)')
//     await time(2000)
//     await page.type('#knowledge-preregistered-email-response', data.vrf, { delay: 100 })
//     await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
//     await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
//     await navigationPromise
//     await time(2000)
//     if (await page.$('[aria-invalid="true"]') != null) {
//         console.log('invalid verification');
//         // await page.close()
//         // await browser.close()
//         return
//     }
//     await page.goto('https://mail.google.com/mail/u/0/#inbox')
//     await navigationPromise
//     // await page.close()
//     // await browser.close()
// }

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
    kill
}
