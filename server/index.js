/**
 * @Crossorigin
 */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs')
const WebSocket = require('ws');

Date.prototype.toDateInputValue = function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};

const wsi = new WebSocket.Server({ port: 7071 });
const wsp = new WebSocket.Server({ port: 7072 })
const wss = new WebSocket.Server({ port: 7073 })
const wsv = new WebSocket.Server({ port: 7074 })

const userManager = require("./managers/userManager");
const entityManager = require("./managers/entityManager");
const listManager = require("./managers/listManager");
const seedManager = require("./managers/seedManager");
const processManager = require("./managers/processManager");
const installation = require("./managers/installation");
const gmailManagement = require("./processes/gmailManagement");
const processStateManager = require('./managers/processStateManager');
const { data } = require("./db");
const { log } = require("console");

const port = 3000;
const app = express(); // setup express application

app.options("*", cors());
// Parse incoming requests data
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
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

wsp.on('connection', ws => {
  ws.on('message', message => {
    if (message.includes('start_in')) {
      processManager.startedProcess(JSON.parse(message))
    } else {
      processManager.stoppedProcess(JSON.parse(message))
    }
  })
})

wss.on('connection', wss => {
  console.log('connected!')
  let request = ""
  wss.on('message', async (message) => {
    let data = JSON.parse(message.toString())
    request = data.request
    if (request == "start") {
      let seeds = await processManager.getAllProcessSeedsServer(data.id_process)
      let active
      let waiting
      if (seeds.length >= 3) {
        waiting = seeds.length - 3
        active = 3
      } else {
        active = seeds.length
        waiting = 0
      }
      let status = { waiting: waiting, active: active, finished: 0, failed: 0, id_process: data.id_process }
      processStateManager.addState(status)
      let statechangeSeeds = []
      for (let i = 0; i < seeds.length; i++) {
        statechangeSeeds.push(seeds[i].id_seeds)
      }
      seedManager.updateState(statechangeSeeds, "waiting")
      let success = 0
      let failed = 0
      let count = 0
      let length = seeds.length
      let toProcess = []
      for (let i = 0; i < active; i++) {
        count++
        seedManager.updateState([seeds[i].id_seeds], "running")
        toProcess.push(seeds[i])
      }
      let state = await processManager.getProcessState(data.id_process)
      while (toProcess.length != 0 && state != 'STOPPED') {
        console.log(toProcess.length);
        for (let i = 0; i < toProcess.length; i++) {
          seedManager.updateState([toProcess[i].id_seeds], "finished")
          success++
          toProcess.shift()
          if (toProcess.length < active && count < length) {
            toProcess.push(seeds[count])
            seedManager.updateState([seeds[count].id_seeds], "running")
            count++
          }
          // if (typeof (toProcess[i])) {
          //   seedManager.updateState([toProcess[i].id_seeds], "finished")
          //   success++
          //   toProcess.shift()
          //   if (toProcess.length < active && count < seeds.length) {
          //     toProcess.push(seeds[count])
          //     seedManager.updateState([seeds[count].id_seeds], "running")
          //     count++
          //   }
          // } else {
          //   failed++
          //   seedManager.updateState(toProcess[i].id_seeds, "failed")
          //   toProcess.shift()
          //   if (toProcess.length < active && count < seeds.length) {
          //     toProcess.push(seeds[count])
          //     seedManager.updateState([seeds[count].id_seeds], "running")
          //     count++
          //   }
          // }
        }
        let status
        let w = waiting - count + 3
        if (w <= 0) {
          status = { waiting: 0, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
          processStateManager.updateState(status)
          console.log(status);
        } else {
          status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
          processStateManager.updateState(status)
          console.log(status);
        }
        state = await processManager.getProcessState(data.id_process)
        if (toProcess.length == 0) {
          end_in = new Date().toDateInputValue()
          processManager.finishedProcess({ id_process: `${data.id_process}`, status: "FINISHED", end_in: `${end_in}` })
        }
      }

    } else if (request == "resume") {
      let seeds = await processManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "stopped" })
      let statechangeSeeds = []
      for (let i = 0; i < seeds.length; i++) {
        statechangeSeeds.push(seeds[i].id_seeds)
      }
      seedManager.updateState(statechangeSeeds, "waiting")
    } else if (request == "pause") {
      let seeds = await processManager.getAllProcessSeedsByState({ id_process: data.id_process, status: "waiting" })
      let statechangeSeeds = []
      for (let i = 0; i < seeds.length; i++) {
        statechangeSeeds.push(seeds[i].id_seeds)
      }
      seedManager.updateState(statechangeSeeds, "stopped")
    }
  })
})

wsv.on('connection', wsv => {
  console.log("connected");
  wsv.on("message", async (event) => {
    let data = event.toString()
    let result = await processStateManager.getState(data)
    wsv.send(JSON.stringify(result))
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
app.post("/users", userManager.createUser);
app.put("/users/:id", userManager.updateUser);
app.delete("/users/:id", userManager.deleteUser);

// entity API
app.get("/entity", entityManager.getEntities);
app.get("/entity/:id", entityManager.getEntityById);
app.post("/entity", entityManager.createEntity);
app.put("/entity/:id", entityManager.updateEntity);
app.delete("/entity/:id", entityManager.deleteEntity);

// lists API
app.get("/lists", listManager.getLists);
app.get("/lists/:id", listManager.getListByIdOrCount);
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
app.get("/process/admin", processManager.getAllData)
app.get("/process/seeds/:id", processManager.getAllProcessSeeds)

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
