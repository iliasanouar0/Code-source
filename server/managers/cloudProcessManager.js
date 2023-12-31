const pg = require("pg");
const fs = require('fs')
const data = require('../db');
const gmailManagement = require("../processes/gmailManagement");
const checkManagement = require("../processes/checkManagement");
const composeManagement = require("../processes/composeManagement");
const resultManager = require('./resultManager')
const root = __dirname
let path = root.slice(0, root.length - 31)
let config = data.data
const pool = new pg.Pool(config);

const updateProcess = (request, response) => {
    const obj = (request.body)
    resultManager.deleteResultsProcess(obj.id_process)
    let sql = `UPDATE cloudprocess SET id_list=$1,id_user=$2 ,action=$3 ,offer=$4,status=$5 WHERE id_process=$6 returning id_process`
    let data = [obj.id_list, obj.id_user, obj.action, obj.offer, obj.status, obj.id_process]
    pool.query(sql, data, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message })
        }
        response.status(200).send(`Compose updated with ID : ${obj.id_process}`)
    })

}

const addProcess = (request, response) => {
    const obj = (request.body)
    let sql = `INSERT INTO cloudprocess (id_list ,id_user ,action ,data ,offer,status ,count,dataorigin) values ($1,$2,$3,$4,$5,$6,$7,$8) returning id_process`
    let data = [obj.id_list, obj.id_user, obj.action, obj.data, obj.offer, obj.status, obj.count, obj.data]
    pool.query(sql, data, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message })
        }
        let arrayBcc = []
        if (obj.data != 'none') {
            let path = `/home/data/main/${obj.data}`
            let read = fs.readFileSync(path, 'utf8');
            let bccData = read.split('\n')
            bccData.flatMap(e => {
                let n = e.split(',')
                if (n[1] == undefined) {
                    arrayBcc.push(n[0])
                } else {
                    arrayBcc.push(n[1])
                }
            })
            if (arrayBcc[0] == '' || arrayBcc[0] == ' ') {
                arrayBcc.shift()
            }
            if (arrayBcc[arrayBcc.length - 1] == '' || arrayBcc[arrayBcc.length - 1] == ' ') {
                arrayBcc.pop()
            }
            let objData = `data${result.rows[0].id_process}`
            let processPath = `/home/data/process/${objData}`
            fs.writeFile(processPath, arrayBcc.join('\n'), function (err, data) {
                if (!err) {
                    let sql = `UPDATE cloudprocess SET data=($1),count=$2 WHERE id_process=($3)`
                    let values = [objData, arrayBcc.length, result.rows[0].id_process]
                    pool.query(sql, values, (err, res) => {
                        if (err) {
                            throw err
                        }
                    })
                } else {
                    throw err
                }
            });
        }
        response.status(200).send(`Compose added with ID : ${result.rows[0].id_process}`)
    })
}

const getAllData = (request, response) => {
    let sql = "SELECT cloudprocess.*,cloudlist.name AS list_name,cloudlist.isp,users.login, COUNT(id_seed) AS seedsCount FROM cloudprocess JOIN cloudlist ON cloudlist.id_list=cloudprocess.id_list JOIN users ON cloudprocess.id_user=users.id_user JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list GROUP BY cloudprocess.id_process,cloudlist.id_list,users.id_user"
    pool.query(sql, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getCounter = async (data) => {
    let sql = "SELECT counter FROM cloudprocess WHERE id_process=$1"
    let values = [data.id_process]
    const client = await pool.connect()
    const counter = await client.query(sql, values);
    client.release()
    return counter.rows
}

const getAllDataBtId = (request, response) => {
    const id = (request.params.id)
    let sql = "SELECT * FROM cloudprocess WHERE id_process=$1"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getData = (request, response) => {
    let path = '/home/data/main'
    let objects = []
    let fileObjs = fs.readdirSync(path);
    fileObjs.forEach(file => {
        let filePath = `${path}/${file}`
        const data = fs.readFileSync(filePath, 'utf8');
        let array = data.split('\n')
        if (array[0] == '' || array[0] == ' ') {
            array.shift()
        }
        if (array[array.length - 1] == '' || array[array.length - 1] == ' ') {
            array.pop()
        }
        objects.push({ count: array.length, file: file })
    })
    response.status(200).send(objects)
}

const saveCounter = async (data) => {
    let sql = `UPDATE cloudprocess SET counter=($1) WHERE id_process=($2)`
    let values = [data.counter, data.id_process]
    const client = await pool.connect()
    client.query(sql, values, (err) => {
        if (err) {
            return err;
        }
        client.release()
        return true
    })
}

const getOffers = (request, response) => {
    let objects = []
    let path = '/home/offers'
    let fileObjs = fs.readdirSync(path);
    fileObjs.forEach(file => {
        objects.push({ file: file })
    })
    response.status(200).send(objects)
}

const getOfferData = (request, response) => {
    let name = (request.query.offer)
    let objects = []
    let path = `/home/offers/${name}`
    fs.readFile(path, { encoding: 'utf-8' }, function (err, data) {
        if (!err) {
            response.status(200).send(data)
        } else {
            response.status(500).send(err)
        }
    });
}

const addOfferData = (request, response) => {
    let data = (request.body)
    let name = (request.query.offer)
    // response.status(200).send(data)
    let path = `/home/offers/${name}`
    fs.writeFile(path, data.data, function (err, data) {
        if (!err) {
            response.status(200).send(path)
        } else {
            response.status(500).send(err)
        }
    });
}

const uploadOffer = (request, response) => {
    let file = (request.body)
    console.log(file);
    response.status(200).send(file)
}

const deleteOffer = (request, response) => {
    let name = (request.params.offer)
    let path = `/home/offers/${name}`
    fs.unlink(path, function (err) {
        if (err) throw err;
        response.status(200).send('offer deleted')
    });
}

const getAllUserDate = (request, response) => {
    const id = (request.params.id)
    let sql = "SELECT cloudprocess.*,cloudlist.name AS list_name,cloudlist.isp,users.login, COUNT(id_seed) AS seedsCount FROM cloudprocess JOIN cloudlist ON cloudlist.id_list=cloudprocess.id_list JOIN users ON cloudprocess.id_user=users.id_user JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list WHERE cloudprocess.id_user=($1) GROUP BY cloudprocess.id_process,cloudlist.id_list,users.id_user"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getAllSupDate = (request, response) => {
    let sql = "SELECT cloudprocess.*,cloudlist.name AS list_name,cloudlist.isp,users.login, COUNT(id_seed) AS seedsCount FROM cloudprocess JOIN cloudlist ON cloudlist.id_list=cloudprocess.id_list JOIN users ON cloudprocess.id_user=users.id_user JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list WHERE users.type!='IT' GROUP BY cloudprocess.id_process,cloudlist.id_list,users.id_user"
    pool.query(sql, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getAllProcessSeeds = (request, response) => {
    const id = (request.params.id)
    let sql = "SELECT cloudprocess.id_process,cloudprocess.action,cloudprocess.status as pstatus, cloudseed.*,results.start_in, results.end_in, results.status as rStatus,results.statusdetails FROM cloudprocess JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list  LEFT JOIN results ON results.id_process=cloudprocess.id_process AND results.id_seeds=cloudseed.id_seed  WHERE cloudprocess.id_process=$1 GROUP BY cloudseed.id_list,cloudprocess.id_list,cloudprocess.id_process,cloudseed.id_seed,results.start_in,results.end_in, results.status,cloudprocess.status,results.statusdetails ORDER BY CASE WHEN results.status = 'running' then 1 WHEN results.status = 'finished' then 2  WHEN results.status = 'failed' then 3 WHEN results.status='waiting' then 4 END ASC"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getAllProcessSeedsCount = (request, response) => {
    const id = (request.params.id)
    let sql = "SELECT cloudprocess.id_process,cloudprocess.action, cloudseed.* FROM cloudprocess JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list WHERE cloudprocess.id_process=$1 GROUP BY cloudseed.id_list,cloudprocess.id_list,cloudprocess.id_process,cloudseed.id_seed"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(`${result.rowCount}`)
    })
}

const getAllProcessSeedsServer = async (id) => {
    // let sql = "SELECT cloudprocess.id_process,cloudprocess.action, cloudseed.* FROM cloudprocess JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list WHERE cloudprocess.id_process=$1 GROUP BY cloudseed.id_list,cloudprocess.id_list,cloudprocess.id_process,cloudseed.id_seed"
    let sql = "SELECT cloudprocess.*, cloudseed.* FROM cloudprocess JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list WHERE cloudprocess.id_process=$1 GROUP BY cloudseed.id_list,cloudprocess.id_list,cloudprocess.id_process,cloudseed.id_seed"
    const client = await pool.connect()
    const cloudlist = await client.query(sql, [id])
    client.release()
    return cloudlist.rows;
}

const getAllProcessSeedsProject = async (id) => {
    // let sql = "SELECT cloudprocess.id_process,cloudprocess.action, cloudseed.* FROM cloudprocess JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list WHERE cloudprocess.id_process=$1 GROUP BY cloudseed.id_list,cloudprocess.id_list,cloudprocess.id_process,cloudseed.id_seed"
    let sql = "SELECT cloudprocess.*, cloudseed.*, cloudproject.* FROM cloudprocess JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list JOIN cloudproject ON cloudproject.id_project=cloudseed.id_project WHERE cloudprocess.id_process=$1 GROUP BY cloudseed.id_list,cloudprocess.id_list,cloudprocess.id_process,cloudseed.id_seed,cloudproject.id_account, cloudproject.name, cloudproject.client_id, cloudproject.client_secret, cloudproject.redirect_url, cloudproject.scope, cloudproject.add_date, cloudproject.id_project, cloudproject.update_date"
    const client = await pool.connect()
    const cloudlist = await client.query(sql, [id])
    client.release()
    return cloudlist.rows;
}

const getAllProcessSeedsNotBounce = async (id) => {
    // let sql = "SELECT cloudprocess.id_process,cloudprocess.action, cloudseed.* FROM cloudprocess JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list WHERE cloudprocess.id_process=$1 GROUP BY cloudseed.id_list,cloudprocess.id_list,cloudprocess.id_process,cloudseed.id_seed"
    let sql = "SELECT cloudprocess.id_process,cloudprocess.action, cloudseed.*,results.bounced, results.status as rstatus FROM cloudprocess JOIN cloudseed ON cloudseed.id_list=cloudprocess.id_list JOIN results ON results.id_seeds=cloudseed.id_seed WHERE cloudprocess.id_process=$1 AND results.bounced IS NULL AND results.status='finished' GROUP BY cloudseed.id_list,cloudprocess.id_list,cloudprocess.id_process,cloudseed.id_seed,results.bounced,results.status"
    const client = await pool.connect()
    const cloudlist = await client.query(sql, [id])
    client.release()
    return cloudlist.rows;
}

const getAllProcessSeedsByState = async (data) => {
    let values = [data.id_process, data.status]
    let sql = "SELECT results.status as s, cloudprocess.action, cloudseed.* FROM results JOIN cloudprocess ON cloudprocess.id_process=results.id_process JOIN cloudseed ON cloudseed.id_seed=results.Id_seeds WHERE results.id_process=($1) AND results.status=($2)"
    const client = await pool.connect()
    const cloudlist = await client.query(sql, values);
    client.release()
    return cloudlist.rows
}

const getAllProcessByState = async (data) => {
    let values = [data.status]
    let sql = "SELECT id_process FROM cloudprocess WHERE cloudprocess.status=($1)"
    const client = await pool.connect()
    const cloudlist = await client.query(sql, values);
    client.release()
    return cloudlist.rows
}

const updateActions = (request, response) => {
    let query = "UPDATE cloudprocess SET action=($2) WHERE id_process=($1)"
    const id = (request.params.id)
    const actions = (request.body)
    let val = [id, actions.actions]
    pool.query(query, val, (err, res) => {
        if (err) {
            response.status(500).send(err.message)
        }
        response.status(200).send('action updated')
    })
}

const deleteProcess = (request, response) => {
    const ides = (request.body);
    const sql = "DELETE FROM cloudprocess WHERE id_process=$1";
    const params = [];
    for (let i = 0; i < ides.length; i++) {
        params.push(ides[i])
    }
    params.forEach(param => {
        pool.query(sql, [param.id], (err, result) => {
            if (err) {
                response.status(409).send(err)
            } else {
                var date = new Date().toLocaleString().split(',')[0].split('/').join("-");
                let file = `/home/LogReportingAction/${date}.txt`
                fs.access(file, fs.constants.F_OK | fs.constants.W_OK, (err) => {
                    if (err) {
                        console.error(
                            `${file} ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
                        fs.writeFile(file, `User : ${param.login}, delete cloudprocess ${param.id} action ${param.action} in  ${new Date().toLocaleString()}\n`, (e) => {
                            if (e) throw e
                            console.log('log added');
                        })
                    } else {
                        console.log(`${file} exists, and it is writable`);
                        fs.appendFile(file, `User : ${param.login}, delete cloudprocess ${param.id} action ${param.action} in  ${new Date().toLocaleString()}\n`, (e) => {
                            if (e) throw e
                            console.log('log added');
                        })
                    }
                });
                console.log(`records deleted`)
            }
        });
    });
    response.status(200).send('cloudprocess deleted');
}

const startedProcess = async (data) => {
    let start_in = new Date()
    let end_in
    let sql = "UPDATE cloudprocess SET status=($1), start_in=($2), end_in=($3) WHERE id_process=($4) RETURNING id_process"
    let values = [data.status, start_in, end_in, data.id_process]
    let obj = { query: sql, data: values }
    // pool.query(obj.query, obj.data, (error, result) => {
    //     if (error) {
    //         return `${error.name, error.stack, error.message, error}`
    //     }
    //     return 'Process started successfully'
    // })

    // sql = 'SELECT status FROM cloudprocess WHERE id_process=($1)'
    const client = await pool.connect()
    const cloudlist = await client.query(obj.query, obj.data);
    client.release()
    return true
}

const resumedProcess = (data) => {
    let query = "UPDATE cloudprocess SET status=($1) WHERE id_process=($2)"
    let values = [data.status, data.id_process]
    let obj = { query: query, data: values }
    pool.query(obj.query, obj.data, (error, result) => {
        if (error) {
            return `${error.name, error.stack, error.message, error}`
        }
        return 'Process resumed successfully'
    })
}

const finishedProcess = (data) => {
    let end_in = new Date()
    let query = "UPDATE cloudprocess SET status=($1), end_in=($2) WHERE id_process=($3)"
    let values = [data.status, end_in, data.id_process]
    let obj = { query: query, data: values }
    pool.query(obj.query, obj.data, (error, result) => {
        if (error) {
            return `${error.name, error.stack, error.message, error}`
        }
    })
    return true
}

const restedProcess = async (data) => {
    let query = "UPDATE cloudprocess SET status=($1),end_in=($2),counter=null WHERE id_process=($3)"
    let values = [data.status, data.end_in, data.id_process]
    let obj = { query: query, data: values }
    pool.query(obj.query, obj.data, (error, result) => {
        if (error) {
            throw `${error.name, error.stack, error.message, error}`
        }
    })
    return true
}

const stoppedProcess = (data) => {
    let query = "UPDATE cloudprocess SET status=($1) WHERE id_process=($2)"
    let values = [data.status, data.id_process]
    let obj = { query: query, data: values }
    pool.query(obj.query, obj.data, (error, result) => {
        if (error) {
            return `${error.name, error.stack, error.message, error}`
        }
        return true
    })
}

const processing = async (data) => {
    let result
    let seed = data.data
    let entity = data.entity
    let mode = data.mode
    // console.log(mode);
    // let subject = data.subject
    // let to = data.to
    // let bcc = data.bcc
    // let offer = data.offer
    switch (data.action) {
        case 'verify':
            switch (seed.isp) {
                case 'gmail':
                    await gmailManagement.verify(seed, entity, mode).then(e => {
                        result = e
                    })
                    return result
                default:
                    console.log('data invalid');
                    break;
            }
            break;
        case 'kill':
            switch (data.isp) {
                case 'gmail':
                    gmailManagement.kill(data.id_process)
                    composeManagement.kill(data.id_process)
                    checkManagement.kill(data.id_process)
                    break
                default:
                    console.log('data invalid');
                    break;
            }
            break;
        case 'checkProxy':
            await checkManagement.checkProxy(seed).then(e => {
                result = e
            })
            return result
        case 'authO':
            switch (seed.isp) {
                case 'gmail':
                    await gmailManagement.getRefreshToken(seed, mode).then(e => {
                        result = e
                    })
                    return result
                default:
                    console.log('data invalid');
                    break;
            }
            break;
        // case 'test-compose':
        //     switch (seed.isp) {
        //         case 'gmail':
        //             await composeManagement.TestComposeEmail(seed, { subject: subject, to: to, offer: offer }, mode).then(e => {
        //                 result = e
        //             })
        //             return result
        //         default:
        //             console.log('data invalid');
        //             break;
        //     }
        //     break;
        default:
            console.log('data invalid');
            break;
    }
}

const cloudprocess = async (data, action) => {
    let success = []
    let failed = []
    let line = 1
    let count = 0
    let length = data.length
    let max = 3
    let toProcess = []
    let cloudprocess = false
    for (let i = 0; i < max; i++) {
        count++
        toProcess.push(data[i])
    }
    while (cloudprocess == false) {
        for (let i = 0; i < toProcess.length; i++) {
            if (processing(toProcess[i], action)) {
                success.push(toProcess[i])
                toProcess.shift()
                if (toProcess.length < max) {
                    toProcess.push(data[count + line])
                    count++
                }
            } else {
                failed.push(toProcess[i])
                toProcess.shift()
                if (toProcess.length < max) {
                    toProcess.push(data[count + line])
                    count++
                }
            }
        }
        if (length == count) {
            cloudprocess = true
            return
        }
    }
}

const getProcessState = async (data) => {
    sql = 'SELECT status FROM cloudprocess WHERE id_process=($1)'
    const client = await pool.connect()
    const cloudlist = await client.query(sql, [data]);
    client.release()
    return cloudlist.rows[0].status;
}

const getProcessStateServer = (request, response) => {
    let data = request.params.id
    sql = 'SELECT status FROM cloudprocess WHERE id_process=($1)'
    pool.query(sql, [data], (error, result) => {
        if (error) {
            return `${error.name, error.stack, error.message, error}`
        }
        response.status(200).send(result.rows[0].status)
    })
}

module.exports = {
    addProcess,
    getAllData,
    updateProcess,
    deleteProcess,
    startedProcess,
    getAllProcessSeeds,
    stoppedProcess,
    finishedProcess,
    resumedProcess,
    restedProcess,
    getAllProcessSeedsByState,
    getAllProcessSeedsServer,
    cloudprocess,
    processing,
    getProcessState,
    getProcessStateServer,
    getAllProcessSeedsCount,
    getAllUserDate,
    getAllSupDate,
    getAllProcessByState,
    getData,
    getOffers,
    uploadOffer,
    getOfferData,
    addOfferData,
    deleteOffer,
    saveCounter,
    getAllDataBtId,
    getAllProcessSeedsNotBounce,
    getCounter,
    getAllProcessSeedsProject
}