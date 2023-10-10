/**
 * @Crossorigin
 */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require('fs')
const WebSocket = require('ws');
const wsi = new WebSocket.Server({ port: 7071 });
const wsp = new WebSocket.Server({ port: 7072 })

const userManager = require("./managers/userManager");
const entityManager = require("./managers/entityManager");
const listManager = require("./managers/listManager");
const seedManager = require("./managers/seedManager");
const processManager = require("./managers/processManager");
const installation = require("./managers/installation");
const { request } = require("http");

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
// web socket =>

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
    if (message.includes('start')) {
      processManager.updateProcess(JSON.parse(message))
    }
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
app.put("/process/", processManager.updateProcess)

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
