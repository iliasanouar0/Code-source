const pg = require("pg");
const fs = require('fs')
const data = require('../db');
const gmailManagement = require("../processes/gmailManagement");
const checkManagement = require("../processes/checkManagement");
const root = __dirname
let path = root.slice(0, root.length - 31)
console.log(path);
let config = data.data

const pool = new pg.Pool(config);

const addProcess = (request, response) => {
    const obj = (request.body)
    let sql = `INSERT INTO process (name ,action ,status ,date_add ,date_update,id_list ,id_user) values ($1,$2,$3,$4,$5,$6,$7) returning id_process`
    let data = [obj.name, obj.action, obj.status, obj.date_add, obj.date_update, obj.id_list, obj.id_user]
    pool.query(sql, data, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message })
        }
        response.status(200).send(`Process added with ID : ${result.rows[0].id_process}`)
    })
}

const getAllData = (request, response) => {
    let sql = "SELECT process.*,list.name AS list_name,list.isp,users.login, COUNT(id_seeds) AS count FROM process JOIN list ON list.id_list=process.id_list JOIN users ON process.id_user=users.id_user JOIN seeds ON seeds.id_list=process.id_list GROUP BY process.id_process,list.id_list,users.id_user"
    pool.query(sql, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getAllUserDate = (request, response) => {
    const id = (request.params.id)
    let sql = "SELECT process.*,list.name AS list_name,list.isp,users.login, COUNT(id_seeds) AS count FROM process JOIN list ON list.id_list=process.id_list JOIN users ON process.id_user=users.id_user JOIN seeds ON seeds.id_list=process.id_list WHERE process.id_user=($1) GROUP BY process.id_process,list.id_list,users.id_user"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getAllSupDate = (request, response) => {
    let sql = "SELECT process.*,list.name AS list_name,list.isp,users.login, COUNT(id_seeds) AS count FROM process JOIN list ON list.id_list=process.id_list JOIN users ON process.id_user=users.id_user JOIN seeds ON seeds.id_list=process.id_list WHERE users.type!='IT' GROUP BY process.id_process,list.id_list,users.id_user"
    pool.query(sql, (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getAllProcessSeeds = (request, response) => {
    const id = (request.params.id)
    let sql = "SELECT process.id_process,process.action,process.status as pstatus, seeds.*,results.start_in, results.end_in, results.status as rStatus,results.statusdetails FROM process JOIN seeds ON seeds.id_list=process.id_list  LEFT JOIN results ON results.id_process=process.id_process AND results.id_seeds=seeds.id_seeds  WHERE process.id_process=$1 GROUP BY seeds.id_list,process.id_list,process.id_process,seeds.id_seeds,results.start_in,results.end_in, results.status,process.status,results.statusdetails ORDER BY CASE WHEN results.status = 'running' then 1 WHEN results.status = 'finished' then 2  WHEN results.status = 'failed' then 3 WHEN results.status='waiting' then 4 END ASC"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(result.rows)
    })
}

const getAllProcessSeedsCount = (request, response) => {
    const id = (request.params.id)
    let sql = "SELECT process.id_process,process.action, seeds.* FROM process JOIN seeds ON seeds.id_list=process.id_list WHERE process.id_process=$1 GROUP BY seeds.id_list,process.id_list,process.id_process,seeds.id_seeds"
    pool.query(sql, [id], (error, result) => {
        if (error) {
            response.status(500).send({ name: error.name, stack: error.stack, message: error.message, error: error })
        }
        response.status(200).send(`${result.rowCount}`)
    })
}

const getAllProcessSeedsServer = async (id) => {
    let sql = "SELECT process.id_process,process.action, seeds.* FROM process JOIN seeds ON seeds.id_list=process.id_list WHERE process.id_process=$1 GROUP BY seeds.id_list,process.id_list,process.id_process,seeds.id_seeds"
    const client = await pool.connect()
    const list = await client.query(sql, [id])
    client.release()
    return list.rows;
}

const getAllProcessSeedsByState = async (data) => {
    let values = [data.id_process, data.status]
    let sql = "SELECT results.status as s, process.action, seeds.* FROM results JOIN process ON process.id_process=results.id_process JOIN seeds ON seeds.Id_seeds=results.Id_seeds WHERE results.id_process=($1) AND results.status=($2)"
    const client = await pool.connect()
    const list = await client.query(sql, values);
    client.release()
    return list.rows
}

const getAllProcessByState = async (data) => {
    let values = [data.status]
    let sql = "SELECT id_process FROM process WHERE process.status=($1)"
    const client = await pool.connect()
    const list = await client.query(sql, values);
    client.release()
    return list.rows
}

const updateActions = (request, response) => {
    let query = "UPDATE process SET action=($2) WHERE id_process=($1)"
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
    const sql = "DELETE FROM process WHERE id_process=$1";
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
                        fs.writeFile(file, `User : ${param.login}, delete process ${param.id} action ${param.action} in  ${new Date().toLocaleString()}\n`, (e) => {
                            if (e) throw e
                            console.log('log added');
                        })
                    } else {
                        console.log(`${file} exists, and it is writable`);
                        fs.appendFile(file, `User : ${param.login}, delete process ${param.id} action ${param.action} in  ${new Date().toLocaleString()}\n`, (e) => {
                            if (e) throw e
                            console.log('log added');
                        })
                    }
                });
                console.log(`records deleted`)
            }
        });
    });
    response.status(200).send('process deleted');
}

const startedProcess = (data) => {
    let start_in = new Date()
    let end_in
    let query = "UPDATE process SET status=($1), start_in=($2), end_in=($3) WHERE id_process=($4)"
    let values = [data.status, start_in, end_in, data.id_process]
    let obj = { query: query, data: values }
    pool.query(obj.query, obj.data, (error, result) => {
        if (error) {
            return `${error.name, error.stack, error.message, error}`
        }
        return 'Process started successfully'
    })
}

const resumedProcess = (data) => {
    let query = "UPDATE process SET status=($1) WHERE id_process=($2)"
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
    let query = "UPDATE process SET status=($1), end_in=($2) WHERE id_process=($3)"
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
    let query = "UPDATE process SET status=($1),end_in=($2) WHERE id_process=($3)"
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
    let query = "UPDATE process SET status=($1) WHERE id_process=($2)"
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
    let pages = data.pages
    let count = data.count
    let options = data.options
    let entity = data.entity
    let mode = data.mode
    let subject = data.subject
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
        case 'notSpam':
            switch (seed.isp) {
                case 'gmail':
                    await gmailManagement.notSpam(seed, pages, mode, subject).then(e => {
                        result = e
                    })
                    return result
                default:
                    console.log('data invalid');
                    break;
            }
            break;
        case 'markAsSpam':
            switch (seed.isp) {
                case 'gmail':
                    await gmailManagement.markAsSpam(seed, pages, mode, subject).then(e => {
                        result = e
                    })
                    return result
                default:
                    console.log('data invalid');
                    break;
            }
            break;
        case 'markAsUnread':
            switch (seed.isp) {
                case 'gmail':
                    await gmailManagement.markAsUnread(seed, pages, mode, subject).then(e => {
                        result = e
                    })
                    return result
                default:
                    console.log('data invalid');
                    break;
            }
            break;
        case 'openInbox':
            switch (seed.isp) {
                case 'gmail':
                    await gmailManagement.openInbox(seed, count, options, mode, subject).then(e => {
                        result = e
                    })
                    return result
                default:
                    console.log('data invalid');
                    break;
            }
            break;
        case 'markAsRead':
            switch (seed.isp) {
                case 'gmail':
                    await gmailManagement.markAsRead(seed, pages, mode, subject).then(e => {
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
        default:
            console.log('data invalid');
            break;
    }
}

const process = async (data, action) => {
    let success = []
    let failed = []
    let line = 1
    let count = 0
    let length = data.length
    let max = 3
    let toProcess = []
    let process = false
    for (let i = 0; i < max; i++) {
        count++
        toProcess.push(data[i])
    }
    while (process == false) {
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
            process = true
            return
        }
    }
}

const getProcessState = async (data) => {
    sql = 'SELECT status FROM process WHERE id_process=($1)'
    const client = await pool.connect()
    const list = await client.query(sql, [data]);
    client.release()
    return list.rows[0].status;
}

const getProcessStateServer = (request, response) => {
    let data = request.params.id
    sql = 'SELECT status FROM process WHERE id_process=($1)'
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
    updateActions,
    deleteProcess,
    startedProcess,
    getAllProcessSeeds,
    stoppedProcess,
    finishedProcess,
    resumedProcess,
    restedProcess,
    getAllProcessSeedsByState,
    getAllProcessSeedsServer,
    process,
    processing,
    getProcessState,
    getProcessStateServer,
    getAllProcessSeedsCount,
    getAllUserDate,
    getAllSupDate,
    getAllProcessByState
}