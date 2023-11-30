/**
 * @Crossorigin
 */
'use strict'
const express = require("express");
let dotenv = require('dotenv')
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs')
const fileUpload = require('express-fileupload')
const WebSocket = require('ws');
const setTimeout = require('timers/promises');
let time = setTimeout.setTimeout
const url = require('node:url');
const ipFilter = require('express-ipfilter').IpFilter
const IpDeniedError = require('express-ipfilter').IpDeniedError
const proxyaddr = require('proxy-addr')

Date.prototype.toDateInputValue = function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};


const wsi = new WebSocket.Server({ port: 7071 })
const wsc = new WebSocket.Server({ port: 7072 })
const wss = new WebSocket.Server({ port: 7073 })
wss.broadcast = data => {
  wss.clients.forEach(client => client.send(data));
};
const wsv = new WebSocket.Server({ port: 7074 })

const userManager = require("./managers/userManager");
const entityManager = require("./managers/entityManager");
const listManager = require("./managers/listManager");
const seedManager = require("./managers/seedManager");
const processManager = require("./managers/processManager");
const installation = require("./managers/installation");
const processStateManager = require('./managers/processStateManager');
const resultManager = require("./managers/resultManager")
const settingsManager = require("./managers/settingsManager")
const authorizationManager = require('./managers/authorizationManager')
const nodeEnvManager = require('./managers/nodeEnvManager')
const composeManager = require('./managers/composeManager')

const port = 3000;
const app = express(); // setup express application

app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
//   next();
// });

// app.options("*", cors());
app.set('trust proxy', true)

// Parse incoming requests data
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

const result = dotenv.config()
if (result.error) {
  throw result.error
}

let mode = result.parsed.NODE_ENV
const allowedIp = []

const ips = async () => {
  let ips = await authorizationManager.getIpsServer()
  ips.forEach((ip) => {
    allowedIp.push(ip.ip)
  })
  console.log(allowedIp);
}

if (mode == 'production') {
  ips()
  app.use(
    ipFilter(allowedIp, { mode: 'allow' })
  )
}

app.use((err, req, res, _next) => {
  let test = proxyaddr.all(req)
  if (err instanceof IpDeniedError) {
    res.status(401)
  } else {
    res.status(err.status || 500)
  }
  res.send({
    message: 'You shall not pass',
    ip: req.socket.remoteAddress
  })
})

app.get('/proxy/', (req, res) => {
  res.status(200).send({ ip: req.ip, remoteAddress: req.socket.remoteAddress })
})

app.use(fileUpload())


/**
 * * Websocket => 
 * ? wsi :
 * ~ Installation websocket.
 * ? wsp :
 * ~ Process starting state control websocket.
 * ? wss :
 * ~ Process status websocket.
 * ? wsv :
 * ~ Process view status websocket.
 */
wsi.on('connection', function connection(ws) {
  console.log('WebSocket connected');
  ws.on('message', function incoming(message) {
    console.log(`received message ${message}`);
    if (message == 'installation --obs --data => "init"') {
      ws.send('Lunching the installation process --act --install --init')
    } else {
      ws.send('Installation --init started --save --send "install"')
      fs.writeFile('config.js', `const config ={db:${(message.toString())}}; module.exports = config`, function (err) {
        if (err) throw err;
        ws.send('Configuration --init created --save --send  "config"')
      });
    }
  });
});


const sendToAll = (c, m) => {
  c.forEach(client => {
    client.send(m)
  });
}
const root = __dirname
let path = root.slice(0, root.length - 31)
let clients = []
let c = wss.clients
wss.on('connection', (wss, req) => {
  let id = parseInt(url.parse(req.url).query.split('=')[1])
  wss.id = id
  clients.push(wss)
  console.log('connected!')
  let request = ""
  wss.on('message', async (message) => {
    let data = JSON.parse(message.toString())
    request = data.request
    if (request == "start") {
      processManager.startedProcess(data.data)
      let seeds = await processManager.getAllProcessSeedsServer(data.id_process)
      let active
      let waiting = seeds.length - 3
      if (seeds.length >= 3) {
        active = 3
      } else {
        active = seeds.length
        waiting = 0
      }
      for (let i = 0; i < seeds.length; i++) {
        let result = {
          id_process: data.id_process,
          id_list: seeds[i].id_list,
          id_seeds: seeds[i].id_seeds,
          feedback: 0,
          start_in: 0,
          end_in: 0,
          status: 'waiting'
        }
        await resultManager.saveResult(result)
      }
      let success = 0
      let failed = 0
      let count = 0
      let length = seeds.length
      let toProcess = []
      await time(10000)
      let status = { waiting: waiting, active: active, finished: 0, failed: 0, id_process: data.id_process }
      processStateManager.addState(status)
      for (let i = 0; i < active; i++) {
        await Promise.all([
          await resultManager.startNow({ id_seeds: seeds[i].id_seeds, id_process: data.id_process }),
          await resultManager.updateState([{ id_seeds: seeds[i].id_seeds, id_process: data.id_process }], "running")
        ])
        count++
        toProcess.push(seeds[i])
      }
      let state = await processManager.getProcessState(data.id_process)
      while (toProcess.length != 0 && state != "STOPPED") {
        state = await processManager.getProcessState(data.id_process)
        if (state == "STOPPED") {
          break
        }
        for (let i = 0; i < toProcess.length; i++) {
          state = await processManager.getProcessState(data.id_process)
          if (state == "STOPPED") {
            break
          }
          let actions
          let subject
          let pages
          let c
          let options = { markAsImportant: false, markAsStarted: false, click: false }
          let mode

          if (toProcess[0].action.indexOf('click') == -1 && toProcess[0].action.indexOf('count') == -1 && toProcess[0].action.indexOf('pages') == -1 && toProcess[0].action.indexOf('subject') == -1 && toProcess[0].action.indexOf('option') == -1) {
            actions = [toProcess[0].action]
          } else {
            actions = toProcess[0].action.split(',')
            let length = actions.length
            for (let i = 0; i < length; i++) {
              if (actions[length - (i + 1)].indexOf('option') != -1) {
                mode = actions.pop().split(':')[1]
              } else if (actions[length - (i + 1)].indexOf('markAsStarted') != -1) {
                actions.pop()
                options.markAsStarted = true;
              } else if (actions[length - (i + 1)].indexOf('click') != -1) {
                actions.pop()
                options.click = true;
              } else if (actions[length - (i + 1)].indexOf('markAsImportant') != -1) {
                actions.pop()
                options.markAsImportant = true;
              } else if (actions[length - (i + 1)].indexOf('count') != -1) {
                c = actions.pop().split(':')[1]
              } else if (actions[length - (i + 1)].indexOf('pages') != -1) {
                pages = parseInt(actions.pop().split(':')[1])
              } else if (actions[length - (i + 1)].indexOf('subject') != -1) {
                subject = actions.pop().split(':')[1]
              }
            }
          }
          console.log(`Actions : ${actions}`);
          let r = ''
          for (let i = 0; i < actions.length; i++) {
            console.log(actions[i] + ' action start')
            r += await processManager.processing({ data: toProcess[0], action: actions[i], subject: subject, pages: pages, count: c, options: options, entity: data.entity, mode: mode })
            if (i < actions.length) {
              r += ', '
            }
          }
          let array = r.split(', ')
          array.pop()
          r = array.join((', '))
          console.log(r);
          await resultManager.saveFeedback({ feedback: r, id_seeds: toProcess[0].id_seeds, id_process: data.id_process })
          if (r.indexOf('invalid') == -1) {
            success++
            let end_in = new Date()
            let result
            await Promise.all([
              await resultManager.updateState([{ id_seeds: toProcess[0].id_seeds, id_process: data.id_process }], "finished"),
              result = {
                id_seeds: toProcess[0].id_seeds,
                end_in: end_in,
                id_process: data.id_process
              },
              await resultManager.endNow(result)
            ]);
            toProcess.shift()
            state = await processManager.getProcessState(data.id_process)
            if (state == "STOPPED") {
              break
            }
            if (toProcess.length < active && count < length && state != "STOPPED") {
              toProcess.push(seeds[count])
              await Promise.all([
                await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process }),
                await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
              ])
              count++
              let w = waiting - count + 3
              let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
              processStateManager.updateState(status)
            }
          } else {
            failed++
            let end_in = new Date()
            let result
            await Promise.all([
              await resultManager.updateState([{ id_seeds: toProcess[0].id_seeds, id_process: data.id_process }], "failed"),
              result = {
                id_seeds: toProcess[0].id_seeds,
                end_in: end_in,
                id_process: data.id_process
              },
              await resultManager.endNow(result)
            ]);
            toProcess.shift()
            state = await processManager.getProcessState(data.id_process)
            if (state == "STOPPED") {
              break
            }
            if (toProcess.length < active && count < length && state != "STOPPED") {
              toProcess.push(seeds[count])
              await Promise.all([
                await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process }),
                await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
              ])
              count++
              let w = waiting - count + 3
              let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
              processStateManager.updateState(status)
            }
          }
        }
        let w = waiting - count + 3
        if (w <= 0) {
          let status = { waiting: 0, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
          processStateManager.updateState(status)
        } else {
          let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
          processStateManager.updateState(status)
        }
        state = await processManager.getProcessState(data.id_process)
        if (state == "STOPPED") {
          break
        }
        if (toProcess.length == 0) {
          let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process }
          await processStateManager.updateState(status)
          processManager.finishedProcess({ id_process: data.id_process, status: `FINISHED` })
          console.log(`process with id : ${data.id_process} Finished At ${new Date().toLocaleString()}`);
          sendToAll(clients, 'reload')
        }
      }

    } else if (request == "resume") {
      processManager.resumedProcess(data.data)
      let seeds = await processManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "paused" })
      console.log(seeds[0].action + ' action resume')
      let active
      let waiting = seeds.length - 3
      if (seeds.length >= 3) {
        active = 3
      } else {
        active = seeds.length
        waiting = 0
      }
      for (let i = 0; i < seeds.length; i++) {
        await resultManager.updateState([{ id_seeds: seeds[i].id_seeds, id_process: data.id_process }], "waiting")
      }
      let status = await processStateManager.getState(data.id_process)
      sendToAll(clients, 'reload')
      let success = status[0].finished
      let failed = status[0].failed
      let count = 0
      let length = seeds.length
      let toProcess = []
      let stat = { waiting: waiting, active: active, finished: success, failed: failed, id_process: data.id_process }
      processStateManager.updateState(stat)
      for (let i = 0; i < active; i++) {
        count++
        toProcess.push(seeds[i])
        await resultManager.startNow({ id_seeds: seeds[i].id_seeds, id_process: data.id_process })
        await resultManager.updateState([{ id_seeds: seeds[i].id_seeds, id_process: data.id_process }], "running")
      }
      let state = await processManager.getProcessState(data.id_process)
      while (toProcess.length != 0 && state != "STOPPED") {
        state = await processManager.getProcessState(data.id_process)
        if (state == "STOPPED") {
          break
        }
        for (let i = 0; i < toProcess.length; i++) {
          state = await processManager.getProcessState(data.id_process)
          if (state == "STOPPED") {
            break
          }
          let actions
          let subject
          let pages
          let c
          let options = { markAsImportant: false, markAsStarted: false }
          let mode

          if (toProcess[0].action.indexOf('count') == -1 && toProcess[0].action.indexOf('pages') == -1 && toProcess[0].action.indexOf('subject') == -1 && toProcess[0].action.indexOf('option') == -1) {
            actions = [toProcess[0].action]
          } else {
            actions = toProcess[0].action.split(',')
            let length = actions.length
            for (let i = 0; i < length; i++) {
              if (actions[length - (i + 1)].indexOf('option') != -1) {
                mode = actions.pop().split(':')[1]
              } else if (actions[length - (i + 1)].indexOf('markAsStarted') != -1) {
                actions.pop()
                options.markAsStarted = true;
              } else if (actions[length - (i + 1)].indexOf('markAsImportant') != -1) {
                actions.pop()
                options.markAsImportant = true;
              } else if (actions[length - (i + 1)].indexOf('count') != -1) {
                c = actions.pop().split(':')[1]
              } else if (actions[length - (i + 1)].indexOf('pages') != -1) {
                pages = parseInt(actions.pop().split(':')[1])
              } else if (actions[length - (i + 1)].indexOf('subject') != -1) {
                subject = actions.pop().split(':')[1]
              }
            }
          }
          console.log(`Actions : ${actions}`);
          let r = ''
          for (let i = 0; i < actions.length; i++) {
            console.log(actions[i] + ' action start')
            r += await processManager.processing({ data: toProcess[0], action: actions[i], subject: subject, pages: pages, count: c, options: options, entity: data.entity, mode: mode })
            if (i < actions.length) {
              r += ', '
            }
          }
          let array = r.split(', ')
          array.pop()
          r = array.join((', '))
          console.log(r);
          await resultManager.saveFeedback({ feedback: r, id_seeds: toProcess[0].id_seeds, id_process: data.id_process })
          if (r.indexOf('invalid') == -1) {
            success++
            await resultManager.updateState([{ id_seeds: toProcess[0].id_seeds, id_process: data.id_process }], "finished")
            let end_in = new Date()
            let result = {
              id_seeds: toProcess[0].id_seeds,
              end_in: end_in,
              id_process: data.id_process
            }
            await resultManager.endNow(result)
            toProcess.shift()
            state = await processManager.getProcessState(data.id_process)
            if (state == "STOPPED") {
              break
            }
            if (toProcess.length < active && count < length && state != "STOPPED") {
              toProcess.push(seeds[count])
              await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process })
              await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
              count++
              let w = waiting - count + 3
              let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
              processStateManager.updateState(status)
            }
          } else {
            failed++
            await resultManager.updateState([{ id_seeds: toProcess[0].id_seeds, id_process: data.id_process }], "failed")
            let end_in = new Date()
            let result = {
              id_seeds: toProcess[0].id_seeds,
              end_in: end_in,
              id_process: data.id_process
            }
            await resultManager.endNow(result)
            toProcess.shift()
            state = await processManager.getProcessState(data.id_process)
            if (state == "STOPPED") {
              break
            }
            if (toProcess.length < active && count < length && state != "STOPPED") {
              toProcess.push(seeds[count])
              await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process })
              await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
              count++
              let w = waiting - count + 3
              let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
              processStateManager.updateState(status)
            }
          }
        }
        let w = waiting - count + 3
        if (w <= 0) {
          let status = { waiting: 0, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
          processStateManager.updateState(status)
        } else {
          let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
          processStateManager.updateState(status)
        }
        state = await processManager.getProcessState(data.id_process)
        if (state == "STOPPED") {
          break
        }
        if (toProcess.length == 0) {
          let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process }
          await processStateManager.updateState(status)
          processManager.finishedProcess({ id_process: data.id_process, status: `FINISHED` })
          console.log(`Process with id : ${data.id_process} Finished At ${new Date().toLocaleString()}`);
          sendToAll(clients, 'reload')
        }
      }
    } else if (request == "pause") {
      processManager.stoppedProcess(data.data)
      let seeds = await processManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "waiting" })
      let seedsRunning = await processManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "running" })
      let statechangeSeeds = []
      let statechangeSeedsRunning = []
      for (let i = 0; i < seeds.length; i++) {
        statechangeSeeds.push({ id_seeds: seeds[i].id_seeds, id_process: data.id_process })
      }
      for (let i = 0; i < seedsRunning.length; i++) {
        statechangeSeedsRunning.push({ id_seeds: seedsRunning[i].id_seeds, id_process: data.id_process })
      }
      await resultManager.updateState(statechangeSeeds, "paused")
      await resultManager.updateState(statechangeSeedsRunning, "paused")
      let state = await processStateManager.getState(data.id_process)
      let success = state[0].finished
      let failed = state[0].failed
      let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process }
      await processStateManager.updateState(status)
      if (seeds.length == 0) {
        processManager.processing({ action: 'kill', isp: seedsRunning[0].isp, id_process: data.id_process })
      } else {
        processManager.processing({ action: 'kill', isp: seeds[0].isp, id_process: data.id_process })
      }
      sendToAll(clients, 'reload')
    } else if (request == 'reset') {
      await processManager.restedProcess(data.data)
      await resultManager.deleteResultsProcess(data.id_process)
      let seeds = await processManager.getAllProcessSeedsServer(data.id_process)
      let statechangeSeeds = []
      for (let i = 0; i < seeds.length; i++) {
        statechangeSeeds.push({ id_seeds: seeds[i].id_seeds, id_process: data.id_process })
      }
      await resultManager.updateState(statechangeSeeds, "stopped")
      await processStateManager.deleteState(data.id_process)
      if (seeds.length > 0) {
        processManager.processing({ action: 'kill', isp: seeds[0].isp, id_process: data.id_process })
      } else {
        processManager.processing({ action: 'kill', isp: seedsRunning[0].isp, id_process: data.id_process })

      }
      sendToAll(clients, 'reload')
    } else if (request == 'restart') {
      let ip_process = await processManager.getAllProcessByState({ status: "RUNNING" })
      if (ip_process.length == 0) {
        await time(5000)
        var date = new Date().toLocaleString().split(',')[0].split('/').join("-");
        let file = `/home/LogReportingAction/${date}.txt`
        fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
          if (err) {
            console.error(
              `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
            fs.writeFile(file, `User : ${data.login},perform a system restart in ${new Date().toLocaleString()}\n`, (e) => {
              if (e) throw e
              console.log('log added');
              sendToAll(clients, 'location reload')
              process.exit(0)
            })
          } else {
            console.log(`${file} exists, and it is writable`);
            fs.appendFile(file, `User : ${data.login},perform a system restart in ${new Date().toLocaleString()}\n`, (e) => {
              if (e) throw e
              console.log('log added');
              sendToAll(clients, 'location reload')
              process.exit(0)
            })
          }
        });
      }
      let action = ip_process.length
      for (let i = 0; i < action; i++) {
        await time(5000)
        let val = {
          id_process: `${ip_process[0].id_process}`,
          status: `PAUSED`,
        }
        processManager.stoppedProcess(val)
        let seeds = await processManager.getAllProcessSeedsByState({ id_process: val.id_process, status: "waiting" })
        let seedsRunning = await processManager.getAllProcessSeedsByState({ id_process: val.id_process, status: "running" })
        let statechangeSeeds = []
        let statechangeSeedsRunning = []
        for (let i = 0; i < seeds.length; i++) {
          statechangeSeeds.push({ id_seeds: seeds[i].id_seeds, id_process: val.id_process })
        }
        for (let i = 0; i < seedsRunning.length; i++) {
          statechangeSeedsRunning.push({ id_seeds: seedsRunning[i].id_seeds, id_process: val.id_process })
        }
        await resultManager.updateState(statechangeSeeds, "paused")
        await resultManager.updateState(statechangeSeedsRunning, "paused")
        let state = await processStateManager.getState(val.id_process)
        console.log(state);
        let success = state[0].finished
        let failed = state[0].failed
        let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: val.id_process }
        console.log(status);
        await time(2000)
        await processStateManager.updateState(status)
        if (seeds.length == 0) {
          processManager.processing({ action: 'kill', isp: seedsRunning[0].isp, id_process: val.id_process })
        } else {
          processManager.processing({ action: 'kill', isp: seeds[0].isp, id_process: val.id_process })
        }
        ip_process.shift()
        console.log(ip_process);
        console.log(ip_process.length);
        if (ip_process.length == 0) {
          await time(5000)
          var date = new Date().toLocaleString().split(',')[0].split('/').join("-");
          let file = `${root}/logApp/${date}.txt`
          fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
            if (err) {
              console.error(
                `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
              fs.writeFile(file, `User : ${data.login},perform a system restart in ${new Date().toLocaleString()}\n`, (e) => {
                if (e) throw e
                console.log('log added');
                sendToAll(clients, 'location reload')
              })
            } else {
              console.log(`${file} exists, and it is writable`);
              fs.appendFile(file, `User : ${data.login},perform a system restart in ${new Date().toLocaleString()}\n`, (e) => {
                if (e) throw e
                console.log('log added');
                sendToAll(clients, 'location reload')
              })
            }
          });
        }
      }
    }
  })
})


function randomRange(myMin, myMax) {
  return Math.floor(
    Math.random() * (Math.ceil(myMax) - Math.floor(myMin) + 1) + myMin
  );
}
// composing
wsc.on('connection', (wss, req) => {

  let id = parseInt(url.parse(req.url).query.split('=')[1])

  wss.id = id

  clients.push(wss)

  console.log('connected!')

  let request = ""

  wss.on('message', async (message) => {

    let data = JSON.parse(message.toString())

    request = data.request
    if (request == "start") {

      composeManager.startedProcess(data.data)

      let seeds = await composeManager.getAllProcessSeedsServer(data.id_process)
      let active
      let waiting = seeds.length - 3

      if (seeds.length >= 3) {
        active = 3
      } else {
        active = seeds.length
        waiting = 0
      }

      for (let i = 0; i < seeds.length; i++) {
        let result = {
          id_process: data.id_process,
          id_list: seeds[i].id_list,
          id_seeds: seeds[i].id_seeds,
          feedback: 0,
          start_in: 0,
          end_in: 0,
          status: 'waiting'
        }
        await resultManager.saveResult(result)
      }

      let success = 0
      let failed = 0
      let count = 0
      let length = seeds.length
      await time(10000)

      let status = { waiting: waiting, active: active, finished: 0, failed: 0, id_process: data.id_process }
      console.log(status);

      processStateManager.addState(status)

      let toProcess = []
      for (let i = 0; i < active; i++) {
        toProcess[i] = []
        for (let j = 0; j < active; j++) {
          toProcess[i].push(seeds[count])
          count++
        }
      }
      let state = await composeManager.getProcessState(data.id_process)

      // ~ process !1k
      const process = async (toProcess, start) => {
        await time(1000 * start)
        await resultManager.startNow({ id_seeds: toProcess[0].id_seeds, id_process: data.id_process })
        await resultManager.updateState([{ id_seeds: toProcess[0].id_seeds, id_process: data.id_process }], "running")
        await time(3000)
        while (toProcess.length != 0 && state != "STOPPED") {
          state = await composeManager.getProcessState(data.id_process)
          if (state == "STOPPED") {
            break
          }
          for (let i = 0; i < toProcess.length; i++) {
            let t = 3000 * start
            await time(t)
            let seed = toProcess[0]
            console.log('process : ' + start);
            console.log('to process seed : ' + seed.id_seeds);
            state = await composeManager.getProcessState(data.id_process)
            if (state == "STOPPED") {
              break
            }
            let actions
            let subject
            let to
            if (seed.action.indexOf('subject') == -1 && seed.action.indexOf('to') == -1) {
              actions = [seed.action]
            } else {
              actions = seed.action.split(',')
              let length = actions.length
              for (let i = 0; i < length; i++) {
                if (actions[length - (i + 1)].indexOf('subject') != -1) {
                  subject = actions.pop().split(':')[1]
                } else if (actions[length - (i + 1)].indexOf('to') != -1) {
                  to = actions.pop().split(':')[1]
                }
              }
            }
            console.log(`Actions : ${actions}`);
            let r = ''
            for (let i = 0; i < actions.length; i++) {
              console.log(actions[i] + ' action start')
              r += await composeManager.processing({ data: seed, action: actions[i], subject: subject, to: to, entity: data.entity, mode: 'Cookies' })
              if (i < actions.length) {
                r += ', '
              }
            }
            let array = r.split(', ')
            array.pop()
            r = array.join((', '))
            console.log(r);
            // let r = 'test'
            await resultManager.saveFeedback({ feedback: r, id_seeds: toProcess[0].id_seeds, id_process: data.id_process })
            await time(3000)
            if (r.indexOf('invalid') == -1) {
              success++
              let end_in = new Date()
              let result
              await time(1000 * start)
              await resultManager.updateState([{ id_seeds: seed.id_seeds, id_process: data.id_process }], "finished")
              result = {
                id_seeds: seed.id_seeds,
                end_in: end_in,
                id_process: data.id_process
              }
              await resultManager.endNow(result)
              toProcess.shift()
              if (toProcess.length < active && count < length && state != "STOPPED") {
                seeds = await composeManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "waiting" })
                toProcess.push(seeds[seeds.length - (start + 1)])
                await resultManager.startNow({ id_seeds: seeds[seeds.length - (start + 1)].id_seeds, id_process: data.id_process })
                await resultManager.updateState([{ id_seeds: seeds[seeds.length - (start + 1)].id_seeds, id_process: data.id_process }], "running")
                count++
                let w = waiting - count + 3
                let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
                processStateManager.updateState(status)
              }
            }
            // else {
            //   failed++
            //   let end_in = new Date()
            //   let result
            //   await Promise.all([
            //     await resultManager.updateState([{ id_seeds: toProcess[0].id_seeds, id_process: data.id_process }], "failed"),
            //     result = {
            //       id_seeds: toProcess[0].id_seeds,
            //       end_in: end_in,
            //       id_process: data.id_process
            //     },
            //     await resultManager.endNow(result)
            //   ]);
            //   toProcess.shift()
            //   state = await composeManager.getProcessState(data.id_process)
            //   if (state == "STOPPED") {
            //     break
            //   }
            //   if (toProcess.length < active && count < length && state != "STOPPED") {
            //     seeds = await composeManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "waiting" })
            //     toProcess.push(seeds[count])
            //     await Promise.all([
            //       await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process }),
            //       await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
            //     ])
            //     count++
            //     let w = waiting - count + 3
            //     let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
            //     processStateManager.updateState(status)
            //   }
            // }
          }
          let w = waiting - count + 3
          if (w <= 0) {
            let status = { waiting: 0, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
            processStateManager.updateState(status)
          } else {
            let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
            processStateManager.updateState(status)
          }
          state = await composeManager.getProcessState(data.id_process)
          if (state == "STOPPED") {
            break
          }
          if (toProcess.length == 0) {
            let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process }
            await processStateManager.updateState(status)
            composeManager.finishedProcess({ id_process: data.id_process, status: `FINISHED` })
            console.log(`process with id : ${data.id_process} Finished At ${new Date().toLocaleString()}`);
            sendToAll(clients, 'reload')
          }
        }
      }

      async function repeat(array, number, start) {
        process(array[start], start)
        if (number - 1 > start) await repeat(array, number, start + 1);
      }

      await time(5000)
      await repeat(toProcess, active, 0)
    }

    else if (request == "resume") {
      composeManager.resumedProcess(data.data)
      let seeds = await composeManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "paused" })
      console.log(seeds[0].action + ' action resume')
      let active
      let waiting = seeds.length - 3
      if (seeds.length >= 3) {
        active = 3
      } else {
        active = seeds.length
        waiting = 0
      }
      for (let i = 0; i < seeds.length; i++) {
        await resultManager.updateState([{ id_seeds: seeds[i].id_seeds, id_process: data.id_process }], "waiting")
      }
      let status = await processStateManager.getState(data.id_process)
      sendToAll(clients, 'reload')
      let success = status[0].finished
      let failed = status[0].failed
      let count = 0
      let length = seeds.length
      let toProcess = []
      let stat = { waiting: waiting, active: active, finished: success, failed: failed, id_process: data.id_process }
      processStateManager.updateState(stat)
      for (let i = 0; i < active; i++) {
        count++
        toProcess.push(seeds[i])
        await resultManager.startNow({ id_seeds: seeds[i].id_seeds, id_process: data.id_process })
        await resultManager.updateState([{ id_seeds: seeds[i].id_seeds, id_process: data.id_process }], "running")
      }
      let state = await composeManager.getProcessState(data.id_process)
      while (toProcess.length != 0 && state != "STOPPED") {
        state = await composeManager.getProcessState(data.id_process)
        if (state == "STOPPED") {
          break
        }
        for (let i = 0; i < toProcess.length; i++) {
          state = await composeManager.getProcessState(data.id_process)
          if (state == "STOPPED") {
            break
          }
          let actions
          let subject
          let pages
          let c
          let options = { markAsImportant: false, markAsStarted: false }
          let mode

          if (toProcess[0].action.indexOf('count') == -1 && toProcess[0].action.indexOf('pages') == -1 && toProcess[0].action.indexOf('subject') == -1 && toProcess[0].action.indexOf('option') == -1) {
            actions = [toProcess[0].action]
          } else {
            actions = toProcess[0].action.split(',')
            let length = actions.length
            for (let i = 0; i < length; i++) {
              if (actions[length - (i + 1)].indexOf('option') != -1) {
                mode = actions.pop().split(':')[1]
              } else if (actions[length - (i + 1)].indexOf('markAsStarted') != -1) {
                actions.pop()
                options.markAsStarted = true;
              } else if (actions[length - (i + 1)].indexOf('markAsImportant') != -1) {
                actions.pop()
                options.markAsImportant = true;
              } else if (actions[length - (i + 1)].indexOf('count') != -1) {
                c = actions.pop().split(':')[1]
              } else if (actions[length - (i + 1)].indexOf('pages') != -1) {
                pages = parseInt(actions.pop().split(':')[1])
              } else if (actions[length - (i + 1)].indexOf('subject') != -1) {
                subject = actions.pop().split(':')[1]
              }
            }
          }
          console.log(`Actions : ${actions}`);
          let r = ''
          for (let i = 0; i < actions.length; i++) {
            console.log(actions[i] + ' action start')
            r += await composeManager.processing({ data: toProcess[0], action: actions[i], subject: subject, pages: pages, count: c, options: options, entity: data.entity, mode: mode })
            if (i < actions.length) {
              r += ', '
            }
          }
          let array = r.split(', ')
          array.pop()
          r = array.join((', '))
          console.log(r);
          await resultManager.saveFeedback({ feedback: r, id_seeds: toProcess[0].id_seeds, id_process: data.id_process })
          if (r.indexOf('invalid') == -1) {
            success++
            await resultManager.updateState([{ id_seeds: toProcess[0].id_seeds, id_process: data.id_process }], "finished")
            let end_in = new Date()
            let result = {
              id_seeds: toProcess[0].id_seeds,
              end_in: end_in,
              id_process: data.id_process
            }
            await resultManager.endNow(result)
            toProcess.shift()
            state = await composeManager.getProcessState(data.id_process)
            if (state == "STOPPED") {
              break
            }
            if (toProcess.length < active && count < length && state != "STOPPED") {
              toProcess.push(seeds[count])
              await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process })
              await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
              count++
              let w = waiting - count + 3
              let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
              processStateManager.updateState(status)
            }
          } else {
            failed++
            await resultManager.updateState([{ id_seeds: toProcess[0].id_seeds, id_process: data.id_process }], "failed")
            let end_in = new Date()
            let result = {
              id_seeds: toProcess[0].id_seeds,
              end_in: end_in,
              id_process: data.id_process
            }
            await resultManager.endNow(result)
            toProcess.shift()
            state = await composeManager.getProcessState(data.id_process)
            if (state == "STOPPED") {
              break
            }
            if (toProcess.length < active && count < length && state != "STOPPED") {
              toProcess.push(seeds[count])
              await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process })
              await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
              count++
              let w = waiting - count + 3
              let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
              processStateManager.updateState(status)
            }
          }
        }
        let w = waiting - count + 3
        if (w <= 0) {
          let status = { waiting: 0, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
          processStateManager.updateState(status)
        } else {
          let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
          processStateManager.updateState(status)
        }
        state = await composeManager.getProcessState(data.id_process)
        if (state == "STOPPED") {
          break
        }
        if (toProcess.length == 0) {
          let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process }
          await processStateManager.updateState(status)
          composeManager.finishedProcess({ id_process: data.id_process, status: `FINISHED` })
          console.log(`Process with id : ${data.id_process} Finished At ${new Date().toLocaleString()}`);
          sendToAll(clients, 'reload')
        }
      }
    } else if (request == "pause") {
      composeManager.stoppedProcess(data.data)
      let seeds = await composeManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "waiting" })
      let seedsRunning = await composeManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "running" })
      let statechangeSeeds = []
      let statechangeSeedsRunning = []
      for (let i = 0; i < seeds.length; i++) {
        statechangeSeeds.push({ id_seeds: seeds[i].id_seeds, id_process: data.id_process })
      }
      for (let i = 0; i < seedsRunning.length; i++) {
        statechangeSeedsRunning.push({ id_seeds: seedsRunning[i].id_seeds, id_process: data.id_process })
      }
      await resultManager.updateState(statechangeSeeds, "paused")
      await resultManager.updateState(statechangeSeedsRunning, "paused")
      let state = await processStateManager.getState(data.id_process)
      let success = state[0].finished
      let failed = state[0].failed
      let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process }
      await processStateManager.updateState(status)
      if (seeds.length == 0) {
        composeManager.processing({ action: 'kill', isp: seedsRunning[0].isp, id_process: data.id_process })
      } else {
        composeManager.processing({ action: 'kill', isp: seeds[0].isp, id_process: data.id_process })
      }
      sendToAll(clients, 'reload')
    } else if (request == 'reset') {
      await composeManager.restedProcess(data.data)
      await resultManager.deleteResultsProcess(data.id_process)
      let seeds = await composeManager.getAllProcessSeedsServer(data.id_process)
      let statechangeSeeds = []
      for (let i = 0; i < seeds.length; i++) {
        statechangeSeeds.push({ id_seeds: seeds[i].id_seeds, id_process: data.id_process })
      }
      await resultManager.updateState(statechangeSeeds, "stopped")
      await processStateManager.deleteState(data.id_process)
      if (seeds.length > 0) {
        composeManager.processing({ action: 'kill', isp: seeds[0].isp, id_process: data.id_process })
      } else {
        composeManager.processing({ action: 'kill', isp: seedsRunning[0].isp, id_process: data.id_process })

      }
      sendToAll(clients, 'reload')
    } else if (request == 'restart') {
      let ip_process = await composeManager.getAllProcessByState({ status: "RUNNING" })
      if (ip_process.length == 0) {
        await time(5000)
        var date = new Date().toLocaleString().split(',')[0].split('/').join("-");
        let file = `/home/LogReportingAction/${date}.txt`
        fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
          if (err) {
            console.error(
              `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
            fs.writeFile(file, `User : ${data.login},perform a system restart in ${new Date().toLocaleString()}\n`, (e) => {
              if (e) throw e
              console.log('log added');
              sendToAll(clients, 'location reload')
              process.exit(0)
            })
          } else {
            console.log(`${file} exists, and it is writable`);
            fs.appendFile(file, `User : ${data.login},perform a system restart in ${new Date().toLocaleString()}\n`, (e) => {
              if (e) throw e
              console.log('log added');
              sendToAll(clients, 'location reload')
              process.exit(0)
            })
          }
        });
      }
      let action = ip_process.length
      for (let i = 0; i < action; i++) {
        await time(5000)
        let val = {
          id_process: `${ip_process[0].id_process}`,
          status: `PAUSED`,
        }
        composeManager.stoppedProcess(val)
        let seeds = await composeManager.getAllProcessSeedsByState({ id_process: val.id_process, status: "waiting" })
        let seedsRunning = await composeManager.getAllProcessSeedsByState({ id_process: val.id_process, status: "running" })
        let statechangeSeeds = []
        let statechangeSeedsRunning = []
        for (let i = 0; i < seeds.length; i++) {
          statechangeSeeds.push({ id_seeds: seeds[i].id_seeds, id_process: val.id_process })
        }
        for (let i = 0; i < seedsRunning.length; i++) {
          statechangeSeedsRunning.push({ id_seeds: seedsRunning[i].id_seeds, id_process: val.id_process })
        }
        await resultManager.updateState(statechangeSeeds, "paused")
        await resultManager.updateState(statechangeSeedsRunning, "paused")
        let state = await processStateManager.getState(val.id_process)
        console.log(state);
        let success = state[0].finished
        let failed = state[0].failed
        let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: val.id_process }
        console.log(status);
        await time(2000)
        await processStateManager.updateState(status)
        if (seeds.length == 0) {
          composeManager.processing({ action: 'kill', isp: seedsRunning[0].isp, id_process: val.id_process })
        } else {
          composeManager.processing({ action: 'kill', isp: seeds[0].isp, id_process: val.id_process })
        }
        ip_process.shift()
        console.log(ip_process);
        console.log(ip_process.length);
        if (ip_process.length == 0) {
          await time(5000)
          var date = new Date().toLocaleString().split(',')[0].split('/').join("-");
          let file = `${root}/logApp/${date}.txt`
          fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
            if (err) {
              console.error(
                `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
              fs.writeFile(file, `User : ${data.login},perform a system restart in ${new Date().toLocaleString()}\n`, (e) => {
                if (e) throw e
                console.log('log added');
                sendToAll(clients, 'location reload')
              })
            } else {
              console.log(`${file} exists, and it is writable`);
              fs.appendFile(file, `User : ${data.login},perform a system restart in ${new Date().toLocaleString()}\n`, (e) => {
                if (e) throw e
                console.log('log added');
                sendToAll(clients, 'location reload')
              })
            }
          });
        }
      }
    }
  })
})

// ~ open connection to websocket view :
wsv.on('connection', async wsv => {
  const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  }
  // * Check if open : log the state.
  console.log("connected");
  // ? Need variables :
  /**
   * ! oldV => The old value.
   * ! newV => The new value.
   * ! c => request count.
   */
  let oldV
  let newV
  let c = 0
  // & On message event :
  wsv.on("message", async (event) => {
    // * get the data from the message event :
    let data = event.toString()
    // * get the result from database
    let result = await processStateManager.getState(data)
    /*
    ! while loop => 
    ~~ while the websocket is open :
    */
    while (wsv.readyState != 3 && wsv.readyState != 2) {
      // TODO => - count the request number. 
      c++
      // TODO => - if first request send data to client side (view) and set as the oldV to compare. 
      if (c === 1) {
        oldV = result
        wsv.send(JSON.stringify(oldV))
      } else {
        await time(2000)
        // TODO => - if not the first get new data and compare with old.
        newV = await processStateManager.getState(data)
        if (equalsCheck(newV, oldV)) {
          // TODO => - else continue process 
          continue
        } else {
          // TODO => - if deferent send the new data to client side (view).
          oldV = newV
          wsv.send(JSON.stringify(newV))
        }
      }
    }
  })
  wsv.on('close', () => {
    console.log('closed');
  })
  wsv.on('error', event => {
    console.log(`error : ${event.data}`);
  })
})

app.post("/installation/", installation.createTables)
app.post("/finish/installation/", (request, response) => {
  fs.unlink('../install.html', function (err) {
    if (err) throw err;
    response.status(200).send('installation done !');
  });
})

// user API
app.get("/users", userManager.getUsers);
app.get("/users/:id", userManager.getUserByLogin);
app.get("/users/pass/:id", userManager.checkPass)
app.post("/users", userManager.createUser);
app.put("/users/:id", userManager.updateUser);
app.delete("/users/:id", userManager.deleteUser);
app.patch('/users/:id', userManager.updatePass)

// entity API
app.get("/entity", entityManager.getEntities);
app.get("/entity/:id", entityManager.getEntityById);
app.post("/entity", entityManager.createEntity);
app.put("/entity/:id", entityManager.updateEntity);
app.delete("/entity/:id", entityManager.deleteEntity);

// lists API
app.get("/lists", listManager.getLists);
app.get("/sup/lists", listManager.getListsSup);
app.get("/lists/:id", listManager.getUserLists);
app.get("/lists/isp/:id", listManager.getIspList);
app.post("/lists", listManager.createList);
app.put("/lists/:id", listManager.updateName);
app.delete("/lists/:id", listManager.deleteList);

// seeds and proxy API
app.patch("/seeds/bulk/", seedManager.updateSeeds);
app.patch("/seeds/", seedManager.deleteSeeds);
app.get("/seeds/proxy/:id", seedManager.getProxy);
app.get("/seeds/:id", seedManager.getSeedsById);
app.get('/seeds/search/:id', seedManager.searchSeeds);
app.post("/seeds", seedManager.createSeed);
app.put("/seeds/", seedManager.updateSeed);
app.put("/seeds/proxy/", seedManager.updateProxy);
app.delete("/seeds/:id", seedManager.deleteSeed);

// process API
app.post("/process/", processManager.addProcess)
app.post("/process/actions/:id", processManager.updateActions)
app.get("/process/admin", processManager.getAllData)
app.get("/process/sup/", processManager.getAllSupDate)
app.get("/process/mailer/:id", processManager.getAllUserDate)
app.get("/process/seeds/:id", processManager.getAllProcessSeeds)
app.get('/process/page/:id', processManager.getAllProcessSeedsCount)
app.patch("/process/", processManager.deleteProcess);

// composing API
app.get('/compose/admin', composeManager.getAllData)
app.get('/compose/data/', composeManager.getData)
app.get('/compose/offers/', composeManager.getOffers)
app.post('/compose/offers', composeManager.addOfferData)
app.post('/compose/', composeManager.addProcess)
app.get("/compose/seeds/:id", composeManager.getAllProcessSeeds)
app.get('/compose/offerdata', composeManager.getOfferData)
app.patch("/compose/", composeManager.deleteProcess);
app.post('/compose/offers/upload/', (req, res) => {
  const file = req.files.File
  const fileName = req.files.File.name
  const path = '/home/offers/' + fileName
  file.mv(path, (error) => {
    if (error) {
      console.error(error)
      res.writeHead(500, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify({ status: 'error', message: error }))
      return
    }

    res.writeHead(200, {
      'Content-Type': 'application/json'
    })
    res.end(JSON.stringify({ status: 'success', path: '/home/offers/' + fileName }))
  })
})

// result API
app.get("/result/feedback/:id", resultManager.getFeedback)
app.get("/result/duration/:id", resultManager.getDuration)

// setting API
app.get("/settings/tables/", settingsManager.getTablesNames)
app.get("/settings/columns/:t", settingsManager.getTableColumns)
app.post("/settings/create/", settingsManager.createTable)
app.post("/settings/delete/", settingsManager.deleteTable)
app.post("/settings/add/", settingsManager.addColumns)
app.post("/settings/delete/column/", settingsManager.deleteColumn)

// IP API
app.post('/ip/', authorizationManager.addIp)
app.get('/ip/', authorizationManager.getIps)
app.get('/ip/:id', authorizationManager.getIpById)
app.patch('/ip/', authorizationManager.deleteIp)
app.put('/ip/', authorizationManager.editIp)

//node API
app.get('/node/env/', nodeEnvManager.getMode)
app.post('/node/env/', nodeEnvManager.setMode)
app.get('/node/access/', nodeEnvManager.getAccessGranted)
app.post('/node/access/', nodeEnvManager.grantAccess)
app.listen(port, result.parsed.IP, '0.0.0.0', () => {
  console.log(`Server ip : ${result.parsed.IP} running at ${port}`);
});
