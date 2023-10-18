const { promises } = require('dns');
const puppeteer = require('puppeteer');
const setTimeout = require('timers/promises');
const { isArray } = require('util');
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

const login = async (data) => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 720 });
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://gmail.com/')
    await navigationPromise
    await page.screenshot({
        path: `${path}/open${data.id_seeds}.jpg`
    });
    await page.waitForSelector('input[type="email"]')
    await page.click('input[type="email"]')
    await navigationPromise
    await page.type('input[type="email"]', data.gmail, { delay: 100 })
    await page.waitForSelector('#identifierNext')
    await page.click('#identifierNext')
    await navigationPromise
    await time(1000)
    if (await page.$('[aria-invalid="true"]') != null) {
        await page.screenshot({
            path: `${path}/invalidEmail${data.id_seeds}.jpg`
        });
        await browser.close()
        return feedBack = `open${data.id_seeds}.jpg,invalidEmail${data.id_seeds}.jpg`
    }
    await navigationPromise
    await time(3000);
    await page.type('input[type="password"]', data.password, { delay: 200 })
    await page.waitForSelector('#passwordNext')
    await page.click('#passwordNext')
    await navigationPromise
    await time(1000)
    if (await page.$('[aria-invalid="true"]') != null) {
        await page.screenshot({
            path: `${path}/invalidPass${data.id_seeds}.jpg`
        });
        await browser.close()
        return feedBack = `open${data.id_seeds}.jpg,invalidPass${data.id_seeds}.jpg`
    }
    await navigationPromise
    await time(3000)
    await page.screenshot({
        path: `${path}/login${data.id_seeds}.jpg`
    });
    await browser.close()
    return feedBack = `open${data.id_seeds}.jpg,login${data.id_seeds}.jpg`
}

// data = {
//     gmail: 'iliasanouar0@gmail.com',
//     // gmail: '7yy6GV@gmail.com',
//     password: 'ilias080701',
//     // password: 'TTTTTTTTT',
//     id_seeds: 66
// }
// login(data).then(feedBack => {
//     console.log(feedBack);
// })
module.exports = {
    login,
}
