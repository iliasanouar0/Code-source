// const puppeteer = require('puppeteer');
const puppeteer = require('puppeteer-extra')
// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
class GmailManagement {
    email
    password

    removeAllInbox = async (email, password) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
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
        setTimeout(() => {
            const span = page.evaluate(() => {
                // console.log('evaluate');
                span = document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
                // span[1].click()
                console.log(span);
                // return span
            })
        }, 10000);
        await page.waitForSelector('div[act="10"]')
        await page.click('div[act="10"]')
    }

    markAsSpam = async (email, password) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
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
        setTimeout(() => {
            const span = page.evaluate(() => {
                // console.log('evaluate');
                span = document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
                // span[1].click()
                console.log(span);
                // return span
            })
        }, 10000);
        await page.waitForSelector('div[act="9"]')
        await page.click('div[act="9"]')
    }

    markAsRead = async (email, password) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
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
        setTimeout(() => {
            const span = page.evaluate(() => {
                // console.log('evaluate');
                span = document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
                // span[1].click()
                console.log(span);
                // return span
            })
        }, 10000);
        setTimeout(() => {
            // const span = page.evaluate(() => {
            page.waitForSelector('div[act="1"]')
            page.click('div[act="1"]')
            // console.log('evaluate');
            // span = document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
            // // span[1].click()
            // console.log(span);
            // // return span

            // })
        }, 12000);

    }

    archiveAll = async (email, password) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
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
        setTimeout(() => {
            const span = page.evaluate(() => {
                // console.log('evaluate');
                span = document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
                // span[1].click()
                console.log(span);
                // return span
            })
        }, 10000);
        await page.waitForSelector('div[act="7"]')
        await page.click('div[act="7"]')
    }

    markAsUnread = async (email, password) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
        await page.waitForSelector('#identifierNext')
        await page.click('#identifierNext')
        await page.waitForSelector('input[type="password"]')
        setTimeout(() => {
            page.type('input[type="password"]', password, { delay: 200 })
        }, 5000);
        setTimeout(() => {
            page.waitForSelector('#passwordNext')
            page.click('#passwordNext')
        }, 10000);
        await navigationPromise
        setTimeout(() => {
            const span = page.evaluate(() => {
                // console.log('evaluate');
                span = document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
                // span[1].click()
                console.log(span);
                // return span
            })
        }, 20000);
        setTimeout(() => {
            page.waitForSelector('div[act="2"]')
            page.click('div[act="2"]')
        }, 25000);

    }

    notSpam = async (email, password) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
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
        await page.waitForSelector('.CJ')
        await page.click('.CJ')

        setTimeout(() => {
            page.waitForSelector('a[href="https://mail.google.com/mail/u/0/#spam"]')
            page.click('a[href="https://mail.google.com/mail/u/0/#spam"]')
        }, 2000);

        setTimeout(() => {
            const span = page.evaluate(() => {
                console.log('evaluate');
                span = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]')
                console.log(span[1]);
                span[1].click()
                console.log(span);
                return span
            })
        }, 3000);

        setTimeout(() => {
            page.waitForSelector('div[act="18"]')
            page.click('div[act="18"]')
        }, 4000);
    }

    notSpamThat = async (email, password, that) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
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
        await page.waitForSelector('.CJ')
        await page.click('.CJ')

        setTimeout(() => {
            page.waitForSelector('a[href="https://mail.google.com/mail/u/0/#spam"]')
            page.click('a[href="https://mail.google.com/mail/u/0/#spam"]')
        }, 2000);

        setTimeout(() => {
            page.waitForSelector('#gs_lc50 input#gs_taif50.gb_qe.aJh')
            page.click('#gs_lc50 input#gs_taif50.gb_qe.aJh')
            navigationPromise
            page.type('#gs_lc50 input#gs_taif50.gb_qe.aJh', ` subject:(${that})`, { delay: 50 })
        }, 3000);

        // button.gb_Ce.gb_De.bEP
        setTimeout(() => {
            page.keyboard.press('Enter')
        }, 7000);

        setTimeout(() => {
            const span = page.evaluate(() => {
                console.log('evaluate');
                span = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]')
                // #\:9i > div.J-J5-Ji.J-JN-M-I-Jm > span
                console.log(span[1]);
                span[1].click()
                console.log(span);
                return span
            })
        }, 9000);

        setTimeout(() => {
            page.waitForSelector('div[act="8"]')
            page.click('div[act="8"]')
        }, 10000);
    }

    removeAllSpam = async (email, password) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
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
        await page.waitForSelector('.CJ')
        await page.click('.CJ')

        setTimeout(() => {
            page.waitForSelector('a[href="https://mail.google.com/mail/u/0/#spam"]')
            page.click('a[href="https://mail.google.com/mail/u/0/#spam"]')
        }, 2000);

        setTimeout(() => {
            const span = page.evaluate(() => {
                span = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]')
                span[1].click()
                return span
            })
        }, 3000);

        setTimeout(() => {
            page.waitForSelector('div[act="17"]')
            page.click('div[act="17"]')
        }, 4000);
    }

    markAsStarted = async (email, password) => {
        const browser = await puppeteer.launch({ headless: false })
        const page = await browser.newPage()
        const navigationPromise = page.waitForNavigation()
        await page.goto('https://gmail.com/')
        await navigationPromise
        await page.waitForSelector('input[type="email"]')
        await page.click('input[type="email"]')
        await navigationPromise
        await page.type('input[type="email"]', email, { delay: 100 })
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
        setTimeout(() => {
            const span = page.evaluate(() => {
                span = document.querySelector('div.J-J5-Ji.J-JN-M-I-Jm  span[role="checkbox"]').click()
                console.log(span);
            })
        }, 10000);

        setTimeout(() => {
            const plus = page.evaluate(() => {
                plus = document.querySelector('.nf .asa')
                console.log(plus);
            })
        }, 13000);
    }
}
/**
 * ! TESTING !
 */
// let lone = new GmailManagement
// lone.markAsRead('aminouhassan771@gmail.com', '97845024')
