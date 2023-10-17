let seeds = await processManager.getAllProcessSeedsServer(data.id_process)
let active
let waiting = seeds.length - 3
if (seeds.length >= 3) {
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
let toProcess = []
for (let i = 0; i < active; i++) {
  count++
  seedManager.updateState([seeds[i].id_seeds], "running")
  toProcess.push(seeds[i])
}
let state = await processManager.getProcessState(data.id_process)
while (toProcess.length != 0 && state != 'STOPPED') {
  console.log(seeds.length);
  for (let i = 0; i < toProcess.length; i++) {
    seedManager.updateState([toProcess[0].id_seeds], "finished")
    success++
    toProcess.shift()
    console.log('after shift length : ' + toProcess.length);
    if (toProcess.length < active && count < seeds.length) {
      // toProcess.push(seeds[count])
      console.log('after push length : ' + toProcess.push(seeds[count]));
      console.log(seeds[count].id_seeds);
      seedManager.updateState([seeds[count].id_seeds], "running")
      console.log("count : " + count);
      count++
    }
    // if (typeof (toProcess[0])) {
    //   seedManager.updateState([toProcess[0].id_seeds], "finished")
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
    //     count++
    //   } else {
    //     toProcess.push(seeds[count])
    //     count++
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
  state = await processManager.getProcessState(data.id_process)
  if (toProcess.length == 0) {
    let status = { waiting: 0, active: 0, finished: success, failed: failed, id_process: data.id_process }
    await processStateManager.updateState(status)
    end_in = new Date().toDateInputValue()
    processManager.finishedProcess({ id_process: data.id_process, status: `FINISHED`, end_in: `${end_in}` })
    console.log("updated is finished now");
  }
}