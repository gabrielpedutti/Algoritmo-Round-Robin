document.addEventListener("DOMContentLoaded", function () {
    const btnPrinter = document.querySelector('#btnPrinter')
    const btnPhoto = document.querySelector('#btnPhoto')
    const btnGithub = document.querySelector('#btnGithub')
    const btnEmail = document.querySelector('#btnEmail')
    const tableBody = document.querySelector('tbody')
    const tbodyProcessFinished = document.querySelector('#tbodyProcessFinished')
    const gTime = document.querySelector('h2 span')
    
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
        let aux = arr.shift();
        arr.push(aux);
        return arr;
    };
    
    let globalTime = 0;

    const updateGlobalTime = () => {
        gTime.innerText = globalTime;
    }
    
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
    
    let processControlBlock = [processSecurity, processHost, processSystem, processRegistry];
    let allProcessesNames = [];
    processControlBlock.forEach(process => {
        allProcessesNames.push(process.name);
    });
    
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
        }

        updateTableFinishedProcess() {
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
                        this.updateTable()
                        this.updateTableFinishedProcess()
                        finishedProcesses.push(processControlBlock.shift());   
                    } else {
                        processControlBlock[0].status = statusProcess.ready;
                    }
                    globalTime += this.quantum;
                    this.updateTable()
                    this.updateTableFinishedProcess()
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
                    this.updateTableFinishedProcess()
                    finishedProcesses.push(processControlBlock.shift());   
                }
            }
            this.updateTable()
            this.updateTableFinishedProcess()
        }
    }
    
    
    
    let scheduler = new Scheduler(6, processControlBlock);
    
    scheduler.updateTable()

    function executaScheduler(i) {
        setTimeout(function () {
            scheduler.scaling();
            if (i < 99) {
                executaScheduler(i + 1);
                updateGlobalTime();
            }
        }, 1000);
    }

    executaScheduler(0);
    
    btnPrinter.addEventListener("click", () => {
        processControlBlock.push(new Process("Printer", 80 , 0, 0));
        this.updateTable()
    })

    btnPhoto.addEventListener("click", () => {
        processControlBlock.push(new Process("Photo", 30 , 0, 0));
        this.updateTable()
    })

    btnGithub.addEventListener("click", () => {
        processControlBlock.push(new Process("Github", 25 , 0, 0));
        this.updateTable()
    })

    btnEmail.addEventListener("click", () => {
        processControlBlock.push(new Process("E-mail", 48 , 0, 0));
        this.updateTable()
    })

    // for (let i = 0; i < 100; i++) {
    //     setTimeout(scheduler.scaling(), 5000);
    // }

    // =============== Chart JS ==========================
    const ctx = document.getElementById('myChart');

    new Chart(ctx, {
    type: 'bar',
    data: {
        labels: allProcessesNames,
        datasets: [{
            label: '# of Votes',
            data: [
                ['2022-02-01', '2022-02-03'],
                ['2022-02-03', '2022-02-06'],
                ['2022-02-06', '2022-02-08'],
                ['2022-02-08', '2022-02-13'],
            ],
            backgroundColor: [
                'rgba(255, 26, 104, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(5, 161, 65, 1)',
                'rgba(153, 102, 255, 1)',
            ],
            barPercentage: 0.2,//espessura da barra
        }]
    },
    options: {
        indexAxis: 'y',
        scales: {
        x: {
            min: '2022-02-01',
            type: 'time',
            time: {
                unit: 'day'
            }
        },
        y: {
            beginAtZero: true
        }
        }
    }
    });
})