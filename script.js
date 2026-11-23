
const dados = [
    {
        id: "esquerdo",
        max: 12,
        valor: 1,
        correto: 7,
        desbloqueado: true,
        resolvido: false
    },
    {
        id: "direito",
        max: 12,
        valor: 1,
        correto: 4,
        desbloqueado: true,
        resolvido: false
    },
    {
        id: "meio",
        max: 20,
        valor: 1,
        correto: 13,
        desbloqueado: false,
        resolvido: false
    },
    {
        id: "baixo",
        max: 6,
        valor: 1,
        correto: 2,
        desbloqueado: false,
        resolvido: false
    }
];

function atualizarDado(dado) {

    const elemento = document.getElementById(dado.id);
    const status = document.getElementById("status-" + dado.id);

    document.getElementById("valor-" + dado.id).textContent =
        dado.valor;

    if (dado.resolvido) {

        status.textContent = "CERTO";

    } else if (!dado.desbloqueado) {

        status.textContent = "TRANCADO";

    } 

    elemento.classList.toggle("travado", dado.resolvido);

    elemento.classList.toggle(
        "bloqueado",
        !dado.desbloqueado && !dado.resolvido
    );

    elemento.querySelectorAll("button").forEach(botao => {
        botao.disabled = !dado.desbloqueado || dado.resolvido;
    });

}

function girarDado(id, acao) {

    const dado = dados.find(item => item.id === id);

    if (!dado || !dado.desbloqueado || dado.resolvido) return;

    if (acao === "mais") {

        dado.valor++;

        if (dado.valor > dado.max) {
            dado.valor = 1;
        }

    }

    if (acao === "menos") {

        dado.valor--;

        if (dado.valor < 1) {
            dado.valor = dado.max;
        }

    }

    atualizarDado(dado);

    document.getElementById("status-" + dado.id).textContent =
        "AGUARDANDO";

}

document.querySelectorAll(".controles button").forEach(botao => {

    botao.addEventListener("click", () => {

        const id = botao.dataset.dado;
        const acao = botao.dataset.acao;

        girarDado(id, acao);

    });

});

function verificarMecanismo() {

    const mensagem = document.getElementById("mensagem");

    let erro = false;

    dados.forEach(dado => {

        if (!dado.desbloqueado || dado.resolvido) return;

        const status = document.getElementById("status-" + dado.id);

        if (dado.valor === dado.correto) {

            dado.resolvido = true;

            atualizarDado(dado);

        } else {

            erro = true;

            if (dado.valor > dado.correto) {

                status.textContent = "MUITO ALTO";

            } else {

                status.textContent = "MUITO BAIXO";

            }

        }

    });

    const d12Resolvidos =
        dados[0].resolvido && dados[1].resolvido;

    if (d12Resolvidos && !dados[2].desbloqueado) {

        dados[2].desbloqueado = true;

        atualizarDado(dados[2]);

        mensagem.textContent =
            "OS DOIS D12 FORAM ALINHADOS. D20 DESBLOQUEADO!";

        return;

    }

    if (dados[2].resolvido && !dados[3].desbloqueado) {

        dados[3].desbloqueado = true;

        atualizarDado(dados[3]);

        mensagem.textContent =
            "D20 ALINHADO. ÚLTIMO SELO DESBLOQUEADO!";

        return;

    }

    if (dados.every(dado => dado.resolvido)) {

        mensagem.textContent =
            "TODOS OS SELOS FORAM ALINHADOS. MECANISMO DESBLOQUEADO.";

        document.getElementById("confirmar").disabled = true;

        return;

    }

    if (erro) {

        mensagem.textContent =
            "A COMBINAÇÃO AINDA NÃO ESTÁ CORRETA.";

    }

}

function reiniciarMecanismo() {

    dados.forEach((dado, indice) => {

        dado.valor = 1;
        dado.resolvido = false;

        dado.desbloqueado = indice < 2;

        atualizarDado(dado);

    });

    mensagem.textContent =
        "O MECANISMO AGUARDA UMA COMBINAÇÃO.";

    document.getElementById("confirmar").disabled = false;

}

dados.forEach(atualizarDado);

document.getElementById("confirmar").addEventListener(
    "click",
    verificarMecanismo
);

document.getElementById("reiniciar").addEventListener(
    "click",
    reiniciarMecanismo
);
