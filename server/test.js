// let dotenv = require('dotenv')
// const replace = require('replace-in-file');
// const result = dotenv.config()
// if (result.error) {
//     throw result.error
// }

// let count = result.parsed.RUNNING_PROCESS

// if (parseInt(result.parsed.RUNNING_PROCESS) < parseInt(result.parsed.MAX_PROCESS)) {
//     count++
//     let options = {
//         files: '.env',
//         from: /RUNNING_PROCESS=\d+/g,
//         to: `RUNNING_PROCESS=${count}`,
//     }
//     try {
//         const results = replace.sync(options);
//         console.log('Replacement results:', results);
//         // res.status(200).send(granted)
//     } catch (error) {
//         console.error('Error occurred:', error);
//     }
// }
