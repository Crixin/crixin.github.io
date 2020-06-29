let entrada = [];
let contador = 1;
let aceito = null;
let tabelaFinal = [];
let pilha = ['$', 'S'];
let sentencaAtual = '';
let continuarSentenca = true;

function geradorSenteca() {
    let regraInicial = 'S';
    let continuarGerando = true;
    let sentenca = '';
    while (continuarGerando) {
        let novaSentenca = gramatica[regraInicial][Math.floor(Math.random() * gramatica[regraInicial].length)];
        sentenca = !sentenca ? novaSentenca : sentenca.replace(regraInicial, novaSentenca);
        let indexRegra = -1;
        for (i = 0; i < sentenca.length; i++) {
            indexRegra = naoTerminais.indexOf(sentenca[i]);
            if (indexRegra !== -1) {
                regraInicial = naoTerminais[indexRegra];
                break;
            }
        }
        continuarGerando = indexRegra === -1 ? false : continuarGerando;
    }
    return sentenca.replace(/[^a-zA-Z0-9]/g,'');
}

function validaSentenca(direto) {   
    let sentenca = calculaTabela($('#sentenca').val(), direto);
    validacao(sentenca.aceito);
    montaTabela(sentenca.table);
}

function montaTabela(table) {
    if (table === undefined) table = tabelaFinal;
    let htmlTable = $('.debug-table > tbody').empty();
    for (let i = 0; i < table.length; i++) {
        htmlTable.append('<tr><td>' + table[i].pilha + '</td><td>' + table[i].entrada + '</td><td>' + table[i].acao + '</td></tr>');
    }
}

function preparaLinha() {
    return {
        pilha: pilha.join(''),
        entrada: entrada.join('')
    };
}

function calculaTabela(sentenca, direto) {
    if (direto) {
        resetarVariaveis();
        entrada = (sentenca + '$').split('');
        while (continuarSentenca) novaIteracao();
    } else {
        if (sentenca != sentencaAtual || !continuarSentenca) {
            resetarVariaveis();
            sentencaAtual = sentenca;
            entrada = (sentenca + '$').split('');
        }
        novaIteracao();
    }
    return {
        entrada: entrada.join(''), pilha: pilha.join(''), aceito: aceito, table: tabelaFinal
    };
}

function validacao(aceito) {
    $('#sentenca').removeClass('is-invalid is-valid');
    if (aceito === true) $('#sentenca').addClass('is-valid');
    else if (aceito === false) $('#sentenca').addClass('is-invalid');
}

function novaIteracao() {
    let linha = preparaLinha();
    let topo = pilha[pilha.length - 1];
    let simbolo = entrada[0];
    if (topo === '$' && simbolo === '$') {
        aceito = true;
        continuarSentenca = false;
        linha.acao = 'Aceito em ' + contador + ' iterações';
    } else {
        if (topo == simbolo) {
            pilha.pop();
            entrada.shift();
            linha.acao = "Ler " + simbolo;
        } else if (parsingTable[topo][simbolo]) {
            let valorTopo = parsingTable[topo][simbolo];
            linha.acao = topo + ' -> ' + valorTopo.join('');
            pilha.pop();
            if (valorTopo.join('') !== '&') {
                for (let it = valorTopo.length - 1; it >= 0; it--) {
                    pilha.push(valorTopo[it])
                }
            }
        } else {
            aceito = false;
            continuarSentenca = false;
            linha.acao = 'Erro em ' + contador + ' iterações';
        }
    }
    contador++;
    tabelaFinal.push(linha);
}

function resetarVariaveis() {
    entrada = [];
    contador = 1;
    aceito = null;
    tabelaFinal = [];
    pilha = ['$', 'S'];
    continuarSentenca = true;
}
