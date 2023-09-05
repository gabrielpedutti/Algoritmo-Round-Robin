const btnImpressora = document.querySelector('#btnImpressora')
const btnFoto = document.querySelector('#btnFoto')
const btnGithub = document.querySelector('#btnGithub')
const btnEmail = document.querySelector('#btnEmail')

const statusProcesso = {
    pronto: "pronto",
    executando: "executando",
    terminado: "terminado"
}

class Processo {
    constructor(burst, arrivalTime, id) {
        this.pID = id;
        this.burst = burst;
        this.status = statusProcesso.pronto;
        this.waitTime = 0;
        this.executionTime = 0;
        this.arrivalTime = arrivalTime;
    }


}
  
let processo = new Processo(1,0,0);
  