const puppeteer = require('puppeteer');
const setTimeout = require('timers/promises');
let time = setTimeout.setTimeout
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

const login = async (data) => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox'] })
    const browserPID = browser.process().pid
    const page = await browser.newPage()
    const pagePID = page.process().pid
    pidProcess.push({ id_process: data.id_process, pid: browserPID, ppid: pagePID })
    await page.setViewport({ width: 1280, height: 720 });
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://gmail.com/')
    await navigationPromise
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-open-${data.id_process}.png`
    });
    await page.waitForSelector('input[type="email"]')
    await page.click('input[type="email"]')
    await navigationPromise
    await page.type('input[type="email"]', data.gmail, { delay: 100 })
    await page.waitForSelector('#identifierNext')
    await page.click('#identifierNext')
    await navigationPromise
    await time(60000)
    if (await page.$('[aria-invalid="true"]') != null || await page.$('#next > div > div > a') != null) {
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
        });
        await page.close()
        await browser.close()
        return feedBack = `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png, ${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
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
            return feedBack = `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png, ${data.gmail.split('@')[0]}-@-invalidEmail-${data.id_process}.png`
        }
    }
    await page.type('input[type="password"]', data.password, { delay: 200 })
    await page.waitForSelector('#passwordNext')
    await page.click('#passwordNext')
    await navigationPromise
    await time(1000)
    if (await page.$('[aria-invalid="true"]') != null) {
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
        });
        await page.close()
        await browser.close()
        return feedBack = `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png, ${data.gmail.split('@')[0]}-@-invalidPass-${data.id_process}.png`
    }
    await navigationPromise
    await time(3000)
    await page.screenshot({
        path: `${path}/${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
    });
    await page.close()
    await browser.close()
    return feedBack = `${data.gmail.split('@')[0]}-@-open-${data.id_process}.png, ${data.gmail.split('@')[0]}-@-login-${data.id_process}.png`
}

const kill = (id_process) => {
    pidProcess.forEach(Element => {
        if (Element.id_process == id_process) {
            try {
                process.kill(Element.ppid)
                process.kill(Element.pid)
            } catch (error) {
                console.log(error);
            }
        }
    })
}

module.exports = {
    login,
    kill
}
