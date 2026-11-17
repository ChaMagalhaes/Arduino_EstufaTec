const five = require("johnny-five");

class BombaDAgua {
    // pinRele: pino digital ligado ao IN do módulo relé (type "NC": liga com sinal LOW)
    constructor(pinRele) {
        this.rele = new five.Relay({ pin: pinRele, type: "NC" });
        this.ligada = false;
        this.desligar();
    }

    ligar() {
        this.rele.close();   // fecha o circuito: bomba recebe energia
        this.ligada = true;
        console.log("Bomba d'água ligada");
    }

    desligar() {
        this.rele.open();    // abre o circuito: bomba sem energia
        this.ligada = false;
        console.log("Bomba d'água desligada");
    }
}

module.exports = BombaDAgua;
