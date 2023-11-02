d#!/bin/bash

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
index=$(wc -l <views/layout/admin_sidebar.html)
n=$(($index - 4))
t=$(mktemp)
sed "$n i <li class='nav-item'><a href='./$filename/' class='nav-link $filename'><i class='fas fa-database nav-icon'></i><p>$filename</p></a></li>" views/layout/admin_sidebar.html > "$t" && mv "$t" views/layout/admin_sidebar.html
