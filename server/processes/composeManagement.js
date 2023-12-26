const resultsManager = require('../managers/resultManager')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
const fs = require('fs');
let dotenv = require('dotenv')
let time = setTimeout.setTimeout
puppeteer.use(StealthPlugin())
const translate = require('translate-google');
const { la, te } = require('translate-google/languages');


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
    const browser = await puppeteer.launch({ headless: 'new', args: arg })
    const browserPID = browser.process().pid
    const page = await browser.newPage()
    pidProcess.push({ id_process: data.id_process, pid: browserPID })
    await page.setViewport({ width: 1440, height: 720 });
    try {
        if (mode == 'Cookies') {
            console.log('mode is cookies : ' + data.gmail);
            let file = `${cookies}/${data.gmail.split('@')[0]}-@-init-Gmail.json`
            const navigationPromise = page.waitForNavigation()
            fs.access(file, fs.constants.F_OK | fs.constants.W_OK, async (err) => {
                if (err) {
                    console.error(`${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}, ${data.gmail}`);
                } else {
                    console.log(`${file} ,exist & is wirable, ${data.gmail}`);
                    let cookies = JSON.parse(fs.readFileSync(file));
                    await page.setCookie(...cookies);
                }
            })
            await page.goto('https://gmail.com')
            await time(3000)
            console.log(await page.url());
            await time(3000)
            if (await page.url() == 'https://www.google.com/intl/fr/gmail/about/') {
                await page.goto('https://accounts.google.com/b/0/AddMailService')
                console.log(await page.url());
            }
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
    } catch (e) {
        console.log(e.message);
        console.log("catch error");
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        await time(3000)
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        await page.close()
        await browser.close()
        console.log(feedback);
        return feedback
        // if (e instanceof puppeteer._pptr.errors.TimeoutError) {
        //     await time(3000)
        //     await page.screenshot({
        //         path: `${path}/${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        //     });
        //     feedback += `, ${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        //     await time(3000)
        //     await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        //     await time(3000)
        //     await page.close()
        //     await browser.close()
        //     console.log(feedback);
        //     return feedback
        // } else if (e instanceof puppeteer._pptr.errors.ReferenceError) {
        //     await time(3000)
        //     await page.screenshot({
        //         path: `${path}/${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        //     });
        //     feedback += `, ${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        //     await time(3000)
        //     await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        //     await time(3000)
        //     await page.close()
        //     await browser.close()
        //     console.log(feedback);
        //     return feedback
        // }
    }

}

const composeEmail = async (data, option, mode) => {
    let feedback = ''
    const obj = await login(data, mode)
    if (obj.page == undefined) {
        console.log(obj);
        return obj
    }
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback
    await time(10000)
    try {
        if (option.bcc == undefined) {
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-noData-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-noData-${data.id_process}.png`
            await page.close()
            await browser.close()
            return feedback
        }
        await page.goto('https://mail.google.com/mail/u/0/#inbox')
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
        await time(2000)
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })


        let link
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aunread`
        await page.goto(link)
        await time(3000)
        const status = await page.evaluate(() => {
            let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
            checkSpan.item(1).click()
            return checkSpan.item(1).ariaChecked
        })
        await time(3000)
        console.log(status);
        if (status == 'true') {
            await time(3000)
            let c = await page.$$('div[act="1"]')
            await time(3000)
            await c[1].click();
            await time(3000)
            await page.goto(link)
        }

        await page.goto('https://mail.google.com/mail/u/0/#inbox')

        await time(3000)
        await page.waitForSelector('.z0')
        await time(3000)
        await page.click('.z0')
        await time(6000)
        await page.waitForSelector('.agP.aFw')
        await time(3000)
        await page.type('.agP.aFw', option.to, { delay: 200 })
        await time(3000)
        await page.waitForSelector(".aB.gQ.pB")
        await time(3000)
        await page.click(".aB.gQ.pB")
        await time(3000)
        let bcc = await page.evaluate((b) => {
            let inputs = document.querySelectorAll('.agP.aFw')
            inputs[1].value = b
            return b
        }, option.bcc.join(','))
        await time(3000)
        await time(3000)
        await page.waitForSelector('[name="subjectbox"]')
        await time(3000)
        await page.click('[name="subjectbox"]')
        await time(3000)
        await page.type('[name="subjectbox"]', option.subject, { delay: 200 })
        await time(3000)
        fs.readFile(`/home/offers/${option.offer}`, async (err, data) => {
            if (!err) {
                await page.evaluate(async (dataTo) => {
                    document.querySelector('div[role="textbox"]').innerHTML = dataTo
                }, data.toString());
            }
        })
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-compose-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-compose-${data.id_process}.png`
        await time(2000)
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        await Promise.all([
            page.$eval(`.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3`, element =>
                element.click()
            ),
            await page.waitForNavigation()
        ]);
        await time(50000)
        let check = await page.evaluate(() => {
            let bounced = 0
            let unread = document.querySelectorAll('.zA.zE')
            if (unread.length == 0) {
                return { status: true, label: 'no bounce', bounced: bounced }
            }
            let first = document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"]')[0]
            if (first.className != 'zA yO') {
                first.click()
                let label = document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"] .y2')[0].innerText
                bounced = parseInt(document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"] td span.bx0')[0].innerText)
                return { status: false, label: label, bounced: bounced }
            } else {
                return { status: false, label: 'no bounce', bounced: bounced }
            }
        })
        let c
        console.log('check :');
        let text = check.label/* await translate(check.label, { to: 'en' }).then(res => {
            console.log(res)
            return res
        }).catch(err => {
            console.error(err)
        })*/
        if (text.includes('limit')) {
            c = { status: false, message: text.split('.')[0].split('\n')[1], send: option.bcc.length, bounced: check.bounced }
        } else if (text.includes('blocked') || text.includes('Address not found') || text.includes('Recipient inbox full') || text.includes('Delivery incomplete') || text.includes('Message not delivered')) {
            c = { status: false, message: text.split('.')[0].split('\n')[1], send: option.bcc.length, bounced: check.bounced }
        } else {
            c = { status: true, message: 'No bounced', send: option.bcc.length, bounced: check.bounced }
        }
        await time(3000)
        if (!c.status) {
            console.log(c.message);
            await time(3000)
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-detected-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-detected-${data.id_process}.png`
            await time(2000)
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            await resultsManager.composeDetails({ details: c, id_seeds: data.id_seeds, id_process: data.id_process })
            await time(3000)
            console.log('you can\'t send !!');
        } else {
            await time(3000)
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-sended-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-sended-${data.id_process}.png`
            await time(2000)
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            await resultsManager.composeDetails({ details: c, id_seeds: data.id_seeds, id_process: data.id_process })
            await time(3000)
            console.log('sended !!');
        }
        await page.close()
        await browser.close()
        return feedback
    } catch (e) {
        console.log(e.message + ' ' + data.gmail);
        console.log("catch error : " + data.gmail);
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        await time(3000)
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        await page.close()
        await browser.close()
        console.log(feedback);
        return feedback
    }
}

const TestComposeEmail = async (data, option, mode) => {
    let feedback = ''
    const obj = await login(data, mode)
    if (obj.page == undefined) {
        console.log(obj);
        return obj
    }
    const page = obj.page
    const browser = obj.browser
    feedback += obj.feedback
    await time(10000)
    try {
        await page.goto('https://mail.google.com/mail/u/0/#inbox')
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-inbox-${data.id_process}.png`
        await time(2000)
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

        let link
        link = `https://mail.google.com/mail/u/0/#search/in%3Ainbox+is%3Aunread`
        await page.goto(link)
        await time(3000)
        const status = await page.evaluate(() => {
            let checkSpan = document.querySelectorAll('div.J-J5-Ji.J-JN-M-I-Jm  span')
            checkSpan.item(1).click()
            return checkSpan.item(1).ariaChecked
        })
        await time(3000)
        console.log(status);
        if (status == 'true') {
            await time(3000)
            let c = await page.$$('div[act="1"]')
            await time(3000)
            await c[1].click();
            await time(3000)
            await page.goto(link)
        }

        await page.goto('https://mail.google.com/mail/u/0/#inbox')


        await time(3000)
        await page.waitForSelector('.z0')
        await time(3000)
        await page.click('.z0')
        await time(6000)
        await page.waitForSelector('.agP.aFw')
        await time(3000)
        await page.type('.agP.aFw', option.to, { delay: 200 })
        await time(3000)
        await page.waitForSelector('[name="subjectbox"]')
        await time(3000)
        await page.click('[name="subjectbox"]')
        await time(3000)
        await page.type('[name="subjectbox"]', option.subject, { delay: 200 })
        await time(3000)
        fs.readFile(`/home/offers/${option.offer}`, async (err, data) => {
            if (!err) {
                await page.evaluate(async (dataTo) => {
                    document.querySelector('div[role="textbox"]').innerHTML = dataTo
                }, data.toString());
            }
        })
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-compose-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-compose-${data.id_process}.png`
        await time(2000)
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        await Promise.all([
            page.$eval(`.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3`, element =>
                element.click()
            ),
            await page.waitForNavigation()
        ]);
        await time(50000)
        let check = await page.evaluate(() => {
            let bounced = 0
            let unread = document.querySelectorAll('.zA.zE')
            if (unread.length == 0) {
                return { status: true, label: 'no bounce', bounced: bounced }
            }
            let first = document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"]')[0]
            if (first.className != 'zA yO') {
                first.click()
                let label = 'Not for bounce'
                if (document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"] .y2')[0] != undefined) {
                    label = document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"] .y2')[0].innerText
                }
                if (document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"] td span.bx0')[0] != undefined) {
                    bounced = parseInt(document.querySelectorAll('tbody tr[jscontroller="ZdOxDb"] td span.bx0')[0].innerText)
                }
                return { status: false, label: label, bounced: bounced }
            } else {
                return { status: false, label: 'no bounce', bounced: bounced }
            }
        })
        let c
        console.log('check :');
        let text = check.label/* await translate(check.label, { to: 'en' }).then(res => {
            console.log(res)
            return res
        }).catch(err => {
            console.error(err)
        })*/
        if (text.includes('sending')) {
            c = { status: false, message: text.split('.')[0].split('\n')[1], send: 1, bounced: check.bounced }
        } else if (text.includes('send') /* || text.includes('Address not found') || text.includes('Recipient inbox full')*/) {
            c = { status: false, message: text.split('.')[0].split('\n')[1], send: 1, bounced: check.bounced }
        } else {
            c = { status: true, message: 'No bounced', send: 1, bounced: check.bounced }
        }
        await time(3000)
        if (!c.status) {
            console.log(c.message);
            await time(3000)
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-detected-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-detected-${data.id_process}.png`
            await time(2000)
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            await resultsManager.composeDetails({ details: c, id_seeds: data.id_seeds, id_process: data.id_process })
            await time(3000)
            console.log('you can\'t send !!');
        } else {
            await time(3000)
            await page.screenshot({
                path: `${path}/${data.gmail.split('@')[0]}-@-sended-${data.id_process}.png`
            });
            feedback += `, ${data.gmail.split('@')[0]}-@-sended-${data.id_process}.png`
            await time(2000)
            await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
            await resultsManager.composeDetails({ details: c, id_seeds: data.id_seeds, id_process: data.id_process })
            await time(3000)
            console.log('sended !!');
        }
        if (page) {
            await page.close()
            console.log('page closed : ' + data.gmail);
        }
        if (browser) {
            await browser.close()
            console.log('browser closed : ' + data.gmail);
        }
        return feedback
    } catch (e) {
        console.log(e.message + ' ' + data.gmail);
        console.log("catch error : " + data.gmail);
        await time(3000)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-invalid-${data.id_process}.png`
        await time(3000)
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(3000)
        if (page) {
            await page.close()
            console.log('page closed after catch : ' + data.gmail);
        }
        if (browser) {
            await browser.close()
            console.log('browser closed after catch : ' + data.gmail);
        }
        return feedback
    }
}

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
    composeEmail,
    kill,
    TestComposeEmail
}