const five = require("johnny-five");
const SensorUmidade = require("./componentes/sensorUmidade");
const BombaDAgua = require("./componentes/bombaDAgua");

const LIMITE_SECO = 600;                 // >= 600: solo seco, liga a bomba
const LIMITE_MOLHADO = 500;              // <= 500: solo molhado, desliga a bomba
const INTERVALO_VERIFICACAO = 60 * 1000; // com o solo ok, lê a cada 1 minuto
const TEMPO_MAXIMO_BOMBA = 60 * 1000;    // trava de segurança: 60 s por irrigação

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const board = new five.Board({ repl: false, debug: false });

board.on("ready", async () => {
    console.log("Placa conectada!");

    const sensor = new SensorUmidade("A5", 8);
    const bomba = new BombaDAgua(7);

    // garantia de bomba desligada ao encerrar
    board.on("exit", () => bomba.desligar());
    const emergencia = (erro) => {
        console.error("Erro:", erro);
        bomba.desligar();
        setTimeout(() => process.exit(1), 300);
    };
    process.on("uncaughtException", emergencia);
    process.on("unhandledRejection", emergencia);

    while (true) {
        let valor = await sensor.ler();               // leitura normal (5 s)

        if (valor >= LIMITE_SECO) {
            console.log("Solo seco, irrigando...");
            const inicio = Date.now();
            bomba.ligar();
            try {
                while (valor > LIMITE_MOLHADO) {
                    if (Date.now() - inicio > TEMPO_MAXIMO_BOMBA) {
                        console.log("Tempo máximo atingido, parando a bomba");
                        break;
                    }
                    valor = await sensor.ler(2000);   // leitura rápida (2 s) enquanto irriga
                }
            } finally {
                bomba.desligar();
            }
            console.log("Irrigação terminou");
        }

        await esperar(INTERVALO_VERIFICACAO);
    }
});