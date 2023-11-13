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
    if (data.proxy == 'none' || data.proxy == null || data.proxy == '' || data.proxy == 'undefined') {
        arg = ['--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    } else {
        const proxyServer = `${data.proxy}`;
        arg = [`--proxy-server=${proxyServer}`, '--no-sandbox', '--single-process', '--no-zygote', '--disable-setuid-sandbox']
    }
    const browser = await puppeteer.launch({ headless: 'new', args: arg })
    const browserPID = browser.process().pid
    const page = await browser.newPage()
    let feedback = ''
    pidProcess.push({ id_process: data.id_process, pid: browserPID })
    try {
        await page.goto(`http://monip.org/`)
        await page.screenshot({
            path: `${path}/${data.proxy.split(':')[0]}-@-ip-${data.id_process}.png`,
            fullPage: true
        });
        feedback += `${data.proxy.split(':')[0]}-@-ip-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
        await time(10000)
        await page.goto('https://bot.sannysoft.com/', { waitUntil: ['load', 'domcontentloaded'] })
        await page.screenshot({
            path: `${path}/${data.proxy.split(':')[0]}-@-bot-${data.id_process}.png`,
            fullPage: true
        });
        feedback += `,${data.proxy.split(':')[0]}-@-bot-${data.id_process}.png`
        await resultsManager.saveFeedback({ feedback: feedback, id_seeds: data.id_seeds, id_process: data.id_process })
    } catch (error) {

    } finally {
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