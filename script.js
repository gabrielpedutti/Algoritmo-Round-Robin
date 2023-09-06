document.addEventListener("DOMContentLoaded", function () {
    const btnPrinter = document.querySelector('#btnPrinter')
    const btnPhoto = document.querySelector('#btnPhoto')
    const btnGithub = document.querySelector('#btnGithub')
    const btnEmail = document.querySelector('#btnEmail')
    const tableBody = document.querySelector('tbody')
    const tbodyProcessFinished = document.querySelector('#tbodyProcessFinished')
    
    //remainingTime = Tempo restante até o término do processo
    //Burst = Tempo total do processo (fixo)
    //ExecutionTime = Quanto tempo já executou
    
    const statusProcess = {
        ready: "ready",
        running: "running",
        finished: "finished"
    }
    
    finishedProcesses = [];
    
    const rotate = (arr) => {
        let a = [arr[arr.length - 1]];
        for (let i = 0; i < arr.length - 1; i++) {
          a.push(arr[i]);
        }
        return a;
      };
    
    let globalTime = 0;
    
    class Process {
        constructor(name, burst, arrivalTime, id) {
            this.name = name;
            this.pID = id;
            this.burst = burst;
            this.status = statusProcess.ready;
            this.waitTime = 0;
            this.executionTime = 0;
            this.arrivalTime = arrivalTime;
            this.remainingTime = burst;
        }
    }
      
    let processSystem = new Process("System", 100 , 0, 0);
    let processHost = new Process("Host", 10, 1, 1);
    let processSecurity = new Process("Security", 15, 2, 2);
    let processRegistry = new Process("Registry", 18, 3, 3);
    
    let processControlBlock = [processSystem, processHost, processSecurity, processRegistry];
    
    class Scheduler {
        constructor(quantum, processControlBlock) {
            this.quantum = quantum;
            this.processControlBlock = processControlBlock;
        }
    
        updateTable() {
            tableBody.innerHTML = "";
            processControlBlock.forEach(process => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${process.name}</td>
                        <td>${process.burst}</td>
                        <td>${process.executionTime}</td>
                        <td>${process.remainingTime}</td>
                        <td>${process.waitTime}</td>
                    </tr>
                `
            });
    
            tbodyProcessFinished.innerHTML = "";
            finishedProcesses.forEach(process => {
                tbodyProcessFinished.innerHTML += `
                    <tr>
                        <td>${process.name}</td>
                        <td>${process.burst}</td>
                        <td>${process.executionTime}</td>
                        <td>${process.remainingTime}</td>
                        <td>${process.waitTime}</td>
                    </tr>
                `
            });
        }
    
        scaling() {
            if(processControlBlock.length > 0) {
                if(processControlBlock[0].remainingTime >= this.quantum) {
                    processControlBlock[0].status = statusProcess.running;
                    processControlBlock[0].executionTime += this.quantum;
                    processControlBlock[0].remainingTime -= this.quantum;
                    for (let i = 1; i < processControlBlock.length; i++) {
                        processControlBlock[i].waitTime += this.quantum;                    
                    }
                    if (processControlBlock[0].remainingTime == 0) {
                        processControlBlock[0].status = statusProcess.finished;
                    } else {
                        processControlBlock[0].status = statusProcess.ready;
                    }
                    globalTime += this.quantum;
                    this.updateTable()
                    processControlBlock = rotate(processControlBlock)
                } else {
                    globalTime += processControlBlock[0].remainingTime;
                    processControlBlock[0].status = statusProcess.running;
                    processControlBlock[0].executionTime += processControlBlock[0].remainingTime;
                    processControlBlock[0].remainingTime = 0;
                    for (let i = 1; i < processControlBlock.length; i++) {
                        processControlBlock[i].waitTime += this.quantum;                    
                    }
                        processControlBlock[0].status = statusProcess.finished;
                    
                        this.updateTable()
                        finishedProcesses.push(processControlBlock[0]);
                        processControlBlock.shift()
                }
            }
        }
    }
    
    
    
    let scheduler = new Scheduler(6, processControlBlock);
    
    scheduler.updateTable()
    for (let i = 0; i < 100; i++) {
        setTimeout(scheduler.scaling(), 5000);
    }
    
    })