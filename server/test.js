// const process = async (number) => {
//     state = await composeManager.getProcessState(data.id_process)
//     if (state == "STOPPED") {
//         return
//     }
//     let actions
//     let subject
//     let to
//     if (toProcess[number].action.indexOf('subject') == -1 && toProcess[number].action.indexOf('to') == -1) {
//         actions = [toProcess[number].action]
//     } else {
//         actions = toProcess[number].action.split(',')
//         let length = actions.length
//         for (let i = 0; i < length; i++) {
//             if (actions[length - (i + 1)].indexOf('subject') != -1) {
//                 subject = actions.pop().split(':')[1]
//             } else if (actions[length - (i + 1)].indexOf('to') != -1) {
//                 to = actions.pop().split(':')[1]
//             }
//         }
//     }
//     console.log(`Actions : ${actions}`);
//     let r = ''
//     for (let i = 0; i < actions.length; i++) {
//         console.log(actions[i] + ' action start')
//         r += await composeManager.processing({ data: toProcess[number], action: actions[i], subject: subject, to: to, entity: data.entity, mode: 'Cookies' })
//         if (i < actions.length) {
//             r += ', '
//         }
//     }
//     let array = r.split(', ')
//     array.pop()
//     r = array.join((', '))
//     await resultManager.saveFeedback({ feedback: r, id_seeds: toProcess[number].id_seeds, id_process: data.id_process })
//     if (r.indexOf('invalid') == -1) {
//         success++
//         let end_in = new Date()
//         let result
//         await time(5000)
//         await Promise.all([
//             await resultManager.updateState([{ id_seeds: toProcess[number].id_seeds, id_process: data.id_process }], "finished"),
//             result = {
//                 id_seeds: toProcess[number].id_seeds,
//                 end_in: end_in,
//                 id_process: data.id_process
//             },
//             await resultManager.endNow(result)
//         ]);
//         toProcess.shift()
//         state = await composeManager.getProcessState(data.id_process)
//         if (state == "STOPPED") {
//             return
//         }
//         if (toProcess.length < active && count < length && state != "STOPPED") {
//             toProcess.push(seeds[count])
//             await Promise.all([
//                 await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process }),
//                 await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
//             ])
//             count++
//             let w = waiting - count + 3
//             let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
//             processStateManager.updateState(status)
//         }
//     } else {
//         failed++
//         let end_in = new Date()
//         let result
//         await time(5000)
//         await Promise.all([
//             await resultManager.updateState([{ id_seeds: toProcess[number].id_seeds, id_process: data.id_process }], "failed"),
//             result = {
//                 id_seeds: toProcess[number].id_seeds,
//                 end_in: end_in,
//                 id_process: data.id_process
//             },
//             await resultManager.endNow(result)
//         ]);
//         toProcess.shift()
//         state = await composeManager.getProcessState(data.id_process)
//         if (state == "STOPPED") {
//             return
//         }
//         if (toProcess.length < active && count < length && state != "STOPPED") {
//             toProcess.push(seeds[count])
//             await Promise.all([
//                 await resultManager.startNow({ id_seeds: seeds[count].id_seeds, id_process: data.id_process }),
//                 await resultManager.updateState([{ id_seeds: seeds[count].id_seeds, id_process: data.id_process }], "running")
//             ])
//             count++
//             let w = waiting - count + 3
//             let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
//             processStateManager.updateState(status)
//         }
//     }
//     let w = waiting - count + 3
//     if (w <= 0) {
//         let status = { waiting: 0, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
//         processStateManager.updateState(status)
//     } else {
//         let status = { waiting: w, active: toProcess.length, finished: success, failed: failed, id_process: data.id_process }
//         processStateManager.updateState(status)
//     }
//     state = await composeManager.getProcessState(data.id_process)
//     if (state == "STOPPED") {
//         return
//     }
//     if (toProcess.length == 0) {
//         let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process }
//         await processStateManager.updateState(status)
//         composeManager.finishedProcess({ id_process: data.id_process, status: `FINISHED` })
//         console.log(`process with id : ${data.id_process} Finished At ${new Date().toLocaleString()}`);
//         sendToAll(clients, 'reload')
//     }
// }

// console.log(active);

// (function repeat(number) {
//     process(number - 1)
//     if (number > 1) repeat(number - 1);
// })(active);