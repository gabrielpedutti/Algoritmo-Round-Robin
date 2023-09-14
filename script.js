document.addEventListener("DOMContentLoaded", function () {
    const btnPrinter = document.querySelector('#btnPrinter')
    const btnPhoto = document.querySelector('#btnPhoto')
    const btnGithub = document.querySelector('#btnGithub')
    const btnEmail = document.querySelector('#btnEmail')
    const tableBody = document.querySelector('tbody')
    const tbodyProcessFinished = document.querySelector('#tbodyProcessFinished')
    const gTime = document.querySelector('h2 span')
    const tableChartHead = document.querySelector('#tableChart thead')
    const tableChartBody = document.querySelector('#tableChart tbody tr')
    
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
            this.startIn = globalTime;
        }
    }
      
    let processSystem = new Process("System", 100 , 0, 0);
    let processHost = new Process("Host", 10, 1, 1);
    let processSecurity = new Process("Security", 15, 2, 2);
    let processRegistry = new Process("Registry", 18, 3, 3);
    
    let processControlBlock = [processSystem, processHost, processSecurity, processRegistry];
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
                    globalTime += this.quantum;
                    for (let i = 1; i < processControlBlock.length; i++) {
                        processControlBlock[i].waitTime += this.quantum;                    
                    }
                    
                    if (processControlBlock[0].remainingTime == 0) {
                        
                        processControlBlock[0].status = statusProcess.finished;  
                        updateChart(processControlBlock)
                        this.updateTable()
                        this.updateTableFinishedProcess()
                        finishedProcesses.push(processControlBlock.shift());   
                    } else {
                        updateChart(processControlBlock)
                        processControlBlock[0].status = statusProcess.ready;
                        this.updateTable()
                        this.updateTableFinishedProcess()
                        processControlBlock = rotate(processControlBlock)
                    }
                    
                    
                } else {
                    globalTime += processControlBlock[0].remainingTime;
                    processControlBlock[0].status = statusProcess.running;
                    processControlBlock[0].executionTime += processControlBlock[0].remainingTime;
                    processControlBlock[0].remainingTime = 0;
                    for (let i = 1; i < processControlBlock.length; i++) {
                        processControlBlock[i].waitTime += this.quantum;                    
                    }

                    updateChart(processControlBlock)
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
            if (i < 2000) {
                updateGlobalTime();
                executaScheduler(i + 1);
            }
        }, 1000);
    }

    executaScheduler(0);
    
    btnPrinter.addEventListener("click", () => {
        processControlBlock.push(new Process("Printer", 80 , 0, processControlBlock.length+finishedProcesses.length));
        this.updateTable
    })

    btnPhoto.addEventListener("click", () => {
        this.updateTable
        processControlBlock.push(new Process("Photo", 30 , 0, processControlBlock.length+finishedProcesses.length));
    })

    btnGithub.addEventListener("click", () => {
        processControlBlock.push(new Process("Github", 25 , 0, processControlBlock.length+finishedProcesses.length));
        this.updateTable
    })

    btnEmail.addEventListener("click", () => {
        processControlBlock.push(new Process("E-mail", 48 , 0, processControlBlock.length+finishedProcesses.length));
        this.updateTable
    })

    // ===================================================

    function updateChart(processControlBlock) {
        const ganttChart = document.querySelector('#gantt-chart tr');
        const taskCell = document.createElement('th');
        taskCell.textContent = globalTime;
        ganttChart.appendChild(taskCell);
        
        const processosChart = document.querySelector('#gantt-chart tbody')
        const lastElementId = parseInt(document.querySelector('#gantt-chart tbody').lastElementChild.getAttribute('id'))
        
        if(processControlBlock.length + finishedProcesses.length > lastElementId+1){
            const novoProcesso = document.createElement('tr');
            novoProcesso.textContent = processControlBlock[processControlBlock.length-1].name
            novoProcesso.setAttribute("id", lastElementId+1)
            processosChart.appendChild(novoProcesso)
            for(let i = 0; i<ganttChart.childElementCount-2; i++){
                const alinhamento = document.createElement('td');
                alinhamento.textContent = ' ';
                alinhamento.style.backgroundColor = '#ffffff';
                novoProcesso.appendChild(alinhamento);
            }
        }

        processControlBlock.forEach(process => {
            if(process.status != 'finished') {
                if(process.status == 'running') {
                    const processTrChart = document.getElementById(`${process.pID}`);
                    const taskCell = document.createElement('td');
                    taskCell.textContent = ' ';
                    taskCell.style.backgroundColor = '#4bc0c0';
                    processTrChart.appendChild(taskCell);
                } else {
                    const processTrChart = document.getElementById(`${process.pID}`);
                    const taskCell = document.createElement('td');
                    taskCell.textContent = ' ';
                    taskCell.style.backgroundColor = '#4bc00';
                    processTrChart.appendChild(taskCell);
                }
            }
        })
        
    }
})