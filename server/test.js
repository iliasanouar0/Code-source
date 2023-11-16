// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
const setTimeout = require('timers/promises');

let time = setTimeout.setTimeout
const fs = require('fs')

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
    const browser = await puppeteer.launch({ headless: false, args: arg })
    const page = await browser.newPage()
    const navigationPromise = page.waitForNavigation()
    await page.goto('https://gmail.com')
    await navigationPromise
    await time(5000)
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
    return { browser: browser, page: page, feedback: feedback }
}

const openInbox = async (data, count) => {
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
    } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
        details += `Entre unread inbox : 0`
    } else {
        details += `Entre unread inbox : ${countEnter[0].count}`
    }
    console.log(details);
    await time(10000)

    console.log('Messages to read : ' + count);
    let unreadOpen
    for (let i = 0; i < count; i++) {
        await time(3000)
        unreadOpen = await page.evaluate((i) => {
            let html = []
            let el = document.querySelectorAll('.zA.zE')
            console.log(el.item(i));
            el.item(i).click()
            html.push({ messageOpened: i + 1, message: el.item(i).children.item(3).innerText })
            return html
        }, i)
        console.log(unreadOpen);
        await time(4000)
        await page.click('.ar6.T-I-J3.J-J5-Ji')
    }

    await time(6000)
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
    } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
        details += `, Out unread inbox : 0`
    } else {
        details += `, Out unread inbox  : ${countOut[0].count}`
    }
    console.log(details);
}

let data = {
    gmail: 'ronaldorober12@gmail.com',
    // gmail: 'shrh8274@gmail.com',
    password: '02077504',
    // proxy: '188.34.177.156',
    // proxy: '38.34.185.143:3838',
    vrf: 'PeiButtorff@outlook.com'
}
openInbox(data, 3)
