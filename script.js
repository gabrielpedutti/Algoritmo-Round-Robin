document.addEventListener("DOMContentLoaded", function () {
const btnPrinter = document.querySelector('#btnPrinter')
const btnPhoto = document.querySelector('#btnPhoto')
const btnGithub = document.querySelector('#btnGithub')
const btnEmail = document.querySelector('#btnEmail')
const tableBody = document.querySelector('tbody')

const statusProcess = {
    ready: "ready",
    running: "running",
    finished: "finished"
}

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
    }
}
  
let processSystem = new Process("System", 100 , 0, 0);
let processHost = new Process("Host", 10, 1, 1);
let processSecurity = new Process("Security", 15, 2, 2);
let processRegistry = new Process("Registry", 18, 3, 3);

let pcb = [processSystem, processHost, processSecurity, processRegistry];

class Scheduler {
    constructor(quantum, pcb) {
        this.quantum = quantum;
        this.pcb = pcb;
    }

    updateTable() {
        tableBody.innerHTML = "";
        pcb.forEach(process => {
            tableBody.innerHTML += `
                <tr>
                    <td>${process.name}</td>
                    <td>${process.burst}</td>
                    <td>${process.executionTime}</td>
                </tr>
            `
        });
    }
    
}

let scheduler = new Scheduler(6, pcb);
scheduler.updateTable()

})