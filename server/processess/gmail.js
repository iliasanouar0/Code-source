const puppeteer = require('puppeteer');

const login = async (gmail, password) => {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://gmail.com/')
    await navigationPromise
    await page.waitForSelector('input[type="email"]')
    await page.click('input[type="email"]')
    await navigationPromise
    await page.type('input[type="email"]', gmail, { delay: 100 })
    await page.waitForSelector('#identifierNext')
    await page.click('#identifierNext')
    await page.waitForSelector('input[type="password"]')
    setTimeout(() => {
        page.type('input[type="password"]', password, { delay: 200 })
    }, 2000);
    setTimeout(() => {
        page.waitForSelector('#passwordNext')
        page.click('#passwordNext')
    }, 5000);
    await navigationPromise
}

module.exports = {
    login,
}