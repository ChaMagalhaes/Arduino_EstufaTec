const five = require("johnny-five");

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class SensorUmidade {
    constructor(pinAnalogico, pinVCC) {
        this.sensor = new five.Sensor({ pin: pinAnalogico, freq: 300 });
        this.energia = new five.Pin(pinVCC);
        this.desligar();
    }

    ligar() {
        this.energia.high();
        console.log("Sensor Umidade Ligado");
    }

    desligar() {
        this.energia.low();
        console.log("Sensor Umidade Desligado");
    }

    async ler() {
        this.ligar();
        await esperar(5000);
        console.log("Umidade: ", this.sensor.value);
        this.desligar();
        return this.sensor.value;
    }

    async ler(espera = 5000) {
        this.ligar();
        await esperar(espera);
        const valor = this.sensor.value;
        console.log("Umidade: ", valor);
        this.desligar();
        return valor;
    }
}

module.exports = SensorUmidade;