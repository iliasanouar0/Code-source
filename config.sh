#!/bin/bash

echo "write file name : "
read filename

touch server/managers/$filename'Manager.js'
echo 'const pg = require("pg");' >server/managers/$filename'Manager.js'
echo 'var IdGenerator = require("auth0-id-generator");' >>server/managers/$filename'Manager.js'
echo 'const data = require("../db");' >>server/managers/$filename'Manager.js'
echo 'let config = data.data' >>server/managers/$filename'Manager.js'
echo 'const pool = new pg.Pool(config)' >>server/managers/$filename'Manager.js'

mkdir views/admin/$filename
touch views/admin/$filename/index.html
touch views/assets/script/$filename'Uiscript.js'
cat views/layout/admin_sidebar.html | awk '{print index($0, "a")}'
