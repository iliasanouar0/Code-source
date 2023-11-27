const resultsManager = require('../managers/resultManager')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
const fs = require('fs');
let dotenv = require('dotenv')
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