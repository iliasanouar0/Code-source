// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const setTimeout = require('timers/promises');

let time = setTimeout.setTimeout
const fs = require('fs')

// const login = async (data) => {
//     let feedback = ''
//     let arg
//     if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
//         arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//     } else {
//         const proxyServer = `${data.proxy}`;
//         arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
//     }
//     console.log(`opening seed : ${data.gmail}, At ${new Date().toLocaleString()}`);
//     console.log(` `);
//     const browser = await puppeteer.launch({ headless: false, args: arg })
//     const page = await browser.newPage()
//     const navigationPromise = page.waitForNavigation()
//     await page.goto('https://gmail.com')
//     await navigationPromise
//     await time(5000)
//     await page.waitForSelector('input[type="email"]')
//     await page.click('input[type="email"]')
//     await navigationPromise
//     await page.type('input[type="email"]', data.gmail, { delay: 100 })
//     await page.waitForSelector('#identifierNext')
//     await page.click('#identifierNext')
//     await page.waitForSelector('input[type="password"]')
//     await time(5000)
//     page.type('input[type="password"]', data.password, { delay: 200 })
//     await time(3000)
//     page.waitForSelector('#passwordNext')
//     page.click('#passwordNext')
//     await navigationPromise
//     await time(10000)
//     return { browser: browser, page: page, feedback: feedback }
// }

const primaryDefiner = async (page) => {
    const checked = await page.evaluate(() => {
        let status = []
        let checkSpan = document.querySelectorAll('.C7')
        for (let i = 0; i < checkSpan.length - 1; i++) {
            let check = checkSpan[i].children.item(1).innerText
            if (check != 'Primary') {
                let s = checkSpan[i].children.item(0).children[0].ariaChecked
                if (s == 'true') {
                    let s = checkSpan[i].children.item(0).click()
                    status.push({ unchecked: true, label: check })
                }
            }
        }
        return status
    })
    if (checked.length != 0) {
        await time(3000)
        await page.waitForSelector('[name="save"]')
        await time(3000)
        await page.click('[name="save"]')
    }
    return checked
}

const verify = async (data) => {
    let details = ''
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
    const browser = await puppeteer.launch({
        headless: false, args: arg
    })
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://gmail.com/')
    await navigationPromise
    await page.waitForSelector('input[type="email"]')
    await page.click('input[type="email"]')
    await navigationPromise
    await page.type('input[type="email"]', data.gmail, { delay: 100 })
    await page.waitForSelector('#identifierNext')
    await page.click('#identifierNext')
    await navigationPromise
    await time(10000)
    if (await page.$('[aria-invalid="true"]') != null || await page.$('#next > div > div > a') != null) {
        console.log(`invalid email : ${data.gmail}`);
    }
    await navigationPromise
    await time(3000);
    try {
        await page.waitForSelector('input[type="password"]', { timeout: 500 })
    } catch (error) {
        if (error) {
            console.log(`invalid email : ${data.gmail}`);
        }
    }
    await page.type('input[type="password"]', data.password, { delay: 200 })
    await time(1000)
    await Promise.all([
        page.$eval(`#passwordNext`, element =>
            element.click()
        ),
        await page.waitForNavigation(),
    ]);
    await time(1000)
    if (await page.$('[aria-invalid="true"]') != null) {
        console.log(`invalid email : ${data.gmail}`);
    }
    await navigationPromise
    await time(3000)
    console.log(page.url());
    if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
        console.log('test');
        console.log('verified email : ' + data.gmail);
        await time(4000)
        const checked = await page.evaluate(() => {
            let status = []
            let checkSpan = document.querySelectorAll('.C7')
            for (let i = 0; i < checkSpan.length - 1; i++) {
                let check = checkSpan[i].children.item(1).innerText
                if (check != 'Primary') {
                    let s = checkSpan[i].children.item(0).children[0].ariaChecked
                    if (s == 'true') {
                        let s = checkSpan[i].children.item(0).click()
                        status.push({ unchecked: true, label: check })
                    }
                }
            }
            return status
        })
        console.log(checked);
        if (checked.length != 0) {
            await time(3000)
            await page.waitForSelector('[name="save"]')
            await time(3000)
            await page.click('[name="save"]')
        }
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
        console.log(countEnter);
        if (countEnter.length == 0) {
            details += `Entre unread inbox : 0`
        } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
            details += `Entre unread inbox : 0`
        } else {
            details += `Entre unread inbox : ${countEnter[0].count}`
        }
        console.log(details);
        return
    }
    await navigationPromise
    await time(2000)
    console.log(page.url());
    await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3)')
    await time(2000)
    page.waitForSelector('#knowledge-preregistered-email-response')
    await time(2000)
    await page.type('#knowledge-preregistered-email-response', data.verification, { delay: 200 })
    await time(2000)
    await page.waitForSelector('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
    await time(2000)
    await page.click('#view_container > div > div > div.pwWryf.bxPAYd > div > div.zQJV3 > div > div.qhFLie > div > div > button')
    await navigationPromise
    await time(10000)
    if (await page.$('[aria-invalid="true"]') != null) {
        console.log('invalid verification : ' + data.verification);
    }
    if (page.url() == 'https://mail.google.com/mail/u/0/#inbox') {
        console.log('verified email : ' + data.gmail);
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
        let checked = await primaryDefiner(page)
        await time(4000)
        console.log(checked);
        if (countEnter.length == 0) {
            details += `Entre unread inbox : 0`
        } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
            details += `Entre unread inbox : 0`
        } else {
            details += `Entre unread inbox : ${countEnter[0].count}`
        }
        console.log(details);
    }
}

let data = {
    gmail: 'aminouhassan771@gmail.com',
    // gmail: 'shrh8274@gmail.com',
    password: '97845024',
    // proxy: '188.34.177.156',
    // proxy: '38.34.185.143:3838',
    vrf: 'PennySgueglia@hotmail.com'
}
verify(data, 100)
