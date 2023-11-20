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
    let file = `./${data.gmail.split('@')[0]}-@-init-Gmail.json`
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
    if (await page.url() == "https://mail.google.com/mail/u/0/#inbox") {
        await time(3000)
        const cookiesObject = await page.cookies()
        let NewFileJson = JSON.stringify(cookiesObject)
        fs.writeFile(file, NewFileJson, { spaces: 2 }, (err) => {
            if (err) {
                console.log(err);
            }
        })
    } else {
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
}


const markAsUnread = async (data, pages) => {
    let feedback = ''
    let details = ''
    const obj = await login(data)
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback

    await time(10000)
    // await page.screenshot({
    //     path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    // });
    // feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
    // await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    // await time(10000)

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
        // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countEnter[0].element != "Inbox" && countEnter[0].element != "Boîte de réception" && countEnter[0].element != "البريد الوارد") {
        details += `Entre unread inbox : 0`
        // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `Entre unread inbox : ${countEnter[0].count}`
        // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    await time(3000)
    console.log(`treated pages : ${pages}`);
    for (let i = 0; i < pages; i++) {
        console.log(`starting page : ${i + 1}`);
        await time(3000)
        const status = await page.evaluate(() => {
            let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
            checkSpan.item(0).click()
            return checkSpan.item(0).ariaChecked
        })
        await time(3000)
        console.log(status);
        if (status == 'true') {
            console.log('i will click');
            await page.waitForSelector('div[act="9"]')
            await time(3000)
            await page.click('div[act="9"]')
            console.log('clicked');
        } else {
            console.log(`page ${i + 1} have no mode messages`);
            // await page.screenshot({
            //     path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
            // });
            // feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
            // await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            await time(3000)
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
                // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
                details += `, Out unread inbox : 0`
                // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            } else {
                details += `, Out unread inbox : ${countOut[0].count}`
                // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
            }
            console.log(details);

            // await page.close()
            // await browser.close()
            // return feedback
        }
    }
    await time(6000)
    // await page.screenshot({
    //     path: `${path}/${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
    // });
    // feedback += `, ${data.gmail.split('@')[0]}-@-InboxResult-${data.id_process}.png`
    // await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
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
        // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else if (countOut[0].element != "Inbox" && countOut[0].element != "Boîte de réception" && countOut[0].element != "البريد الوارد") {
        details += `, Out unread inbox : 0`
        // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    } else {
        details += `, Out unread inbox : ${countOut[0].count}`
        // await resultsManager.saveDetails({ details: details, id_seeds: data.id_seeds, id_process: data.id_process })
    }
    console.log(details);
    // await page.close()
    // await browser.close()
    // return feedback
}

let data = {
    gmail: 'aminouhassan771@gmail.com',
    // gmail: 'shrh8274@gmail.com',
    password: '97845024',
    // proxy: '188.34.177.156',
    proxy: '38.34.185.143:3838',
    vrf: 'PennySgueglia@hotmail.com'
}

markAsUnread(data, 100)
