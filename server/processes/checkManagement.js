const resultsManager = require('../managers/resultManager')
const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const setTimeout = require('timers/promises');
let time = setTimeout.setTimeout
puppeteer.use(StealthPlugin())

const root = __dirname.substring(0, __dirname.indexOf('/server/processes'))
const path = `${root}/views/assets/images/process_result`

let pidProcess = []


const checkProxy = async (data) => {
    let arg
    let proxyServer
    console.log("checkProxy start: " + data.gmail);
    if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
        arg = [
            '--no-sandbox',
            '--ignore-certifcate-errors',
            '--disable-client-side-phishing-detection',
            '--ignore-certifcate-errors-spki-list',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--no-zygote',
            '--proxy-bypass-list=*',
            '--disable-infobars',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-site-isolation-trials',
            '--enable-experimental-web-platform-features',
            '--start-maximized'
        ]
    } else {
        console.log('there is proxy');
        proxyServer = `${data.proxy}`;
        arg = [
            '--no-sandbox',
            `--proxy-server=${proxyServer}`,
            '--ignore-certifcate-errors',
            '--disable-client-side-phishing-detection',
            '--ignore-certifcate-errors-spki-list',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-first-run',
            '--no-zygote',
            '--proxy-bypass-list=*',
            '--disable-infobars',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-site-isolation-trials',
            '--enable-experimental-web-platform-features',
            '--start-maximized'
        ]
    }
    console.log("Lunch puppeteer: " + `--proxy-server=${data.proxy}`);
    const browser = await puppeteer.launch({ headless: false, ignoreHTTPSErrors: true, ignoreDefaultArgs: ['--enable-automation', '--disable-extensions'], args: arg })
    let c = await browser.createIncognitoBrowserContext({ proxyServer: proxyServer })
    const browserPID = c.process().pid
    const page = await c.newPage();
    pidProcess.push({ id_process: data.id_process, pid: browserPID })
    await (await browser.pages())[0].close()
    let feedback = ''

    try {
        console.log("Goto: http://monip.org/ " + `--proxy-server=${data.proxy} ` + data.gmail);
        await page.goto(`http://monip.org/`)
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-ip-${data.id_process}.png`
        });
        feedback += `${data.gmail.split('@')[0]}-@-ip-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })

        await time(10000)
        console.log("Goto: https://bot.sannysoft.com/ " + `--proxy-server=${data.proxy} ` + data.gmail);
        await page.goto('https://bot.sannysoft.com/', { waitUntil: ['load', 'domcontentloaded'] })
        await page.screenshot({
            path: `${path}/${data.gmail.split('@')[0]}-@-bot-${data.id_process}.png`,
            fullPage: true
        });
        feedback += `, ${data.gmail.split('@')[0]}-@-bot-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    } catch (error) {
        throw error
    } finally {
        console.log("checkProxy finished: " + data.gmail);
        await page.close()
        await browser.close()
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
    checkProxy,
    kill
}