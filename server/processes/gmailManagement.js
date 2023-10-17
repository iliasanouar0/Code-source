const puppeteer = require('puppeteer');
const fs = require('fs');
const path = `${__dirname}/views/assets/images/process_result`;
fs.mkdirSync(path, { recursive: true });

const login = async (gmail, password, id_process) => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox'] })
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 720 });
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://gmail.com/')
    await navigationPromise
    await page.screenshot({
        path: `${path}/image.jpg`
    });
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
    }, 6000);
    setTimeout(() => {
        page.screenshot({
            path: `${path}/image66.jpg`
        });
    }, 10000)

    setTimeout(() => {
        page.close()
        browser.close()
        return
    }, 12000)

}
// login('iliasanouar0@gmail.com', 'ilias080701', 55)
module.exports = {
    login,
}