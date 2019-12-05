
$(document).ready(function () {
	$('#tokens').select2({
		theme: "bootstrap",
		width: "none",
		insertTag: function (data, tag) {
			data.push(tag);
		},
		tags: true,
		tokenSeparators: [' ']
	});

	toastr.options = {
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": "5000",
	}

	$('#tokens').change(function () {
		setTimeout(function () { pegaTokens(); }, 100);
	});

	$('#inputToken').on('keyup', function (event) {
		var symbol = $(this).val();
		if (event.keyCode == 8) {
			(symbol.length == 0) ? reiniciarValidacao() : backtrack(symbol);
		} else {
			if (symbol[symbol.length - 1] == " " || event.keyCode == 13) {
				var finalState = $('.element-' + proxEstado + '-row').find('td:first').html();
				(finalState.indexOf("*") != -1 && !block) ? toastr.success('Token "' + symbol + '" válido') : toastr.error('Token "' + symbol + '" inválido');
				reiniciarValidacao();
			} else {
				verificaSymbol(symbol);
			}
		}
	});
});

function limpaTable() {
	$(".table-alfabeto thead tr").html("");
	$(".table-alfabeto thead tr").append("<th>#</th>")
	$(".table-alfabeto tbody").html("");
}

function reiniciarValidacao() {
	limpaClasses();
	$('#inputToken').val('')
	proxEstado = 0;
	ultimoEstado = 0;
	block = false;
}

function validaComponente(component) {
	if (component != undefined) {
		var state = $('.' + component + ' td:first').html();
		ultimoEstado = parseInt(state.replace("q", ""));
	} else {
		ultimoEstado = 0;
	}
}

function pegaTokens() {
	arrTokens = [];
	$("#tokens option").each(function (index) {
		arrTokens.push($(this).text());
	});
	$('#table_elements').fadeIn('slow');
	console.log(arrTokens)
	limpaTable()
	geraTabelaEstados(arrTokens);
	pegaAlfabeto(arrTokens);
}

function pegaAlfabeto(arrTokens) {
	var alfabeto = [];
	for (var i = 0; i < arrTokens.length; i++) {
		for (var idx = 0; idx < arrTokens[i].length; idx++) {
			if (alfabeto.indexOf(arrTokens[i][idx]) == -1) {
				alfabeto.push(arrTokens[i][idx]);
			}
		}
	}
	alfabeto.sort();
	geraTabela(alfabeto);
}

function geraTabela(alfabeto) {
	
	montaCabecalho(alfabeto);
	montaCorpo(alfabeto);


 	$('.select2-selection__choice__remove').click(function () {
		 setTimeout(function () { pegaTokens(); }, 100);
	}); 
}

function montaCabecalho(alfabeto){
	for (var i = 0; i < alfabeto.length; i++) {
		$(".table-alfabeto thead tr").append("<th>" + alfabeto[i] + "</th>");
	}
}

function montaCorpo(alfabeto){
	for (var [indice, valor] of mapEstados) {

		let final = (valor.indexOf("*") != -1) ? '*' : '';

		$(".table-alfabeto tbody").append('<tr class=element-' + indice + '-row><td>q' + indice + final + '</td></tr>');

		for (var col = 0; col < alfabeto.length; col++) {

			let posicaoQ = (valor.indexOf(alfabeto[col]) != -1) ? 'q' + valor[valor.indexOf(alfabeto[col]) + 1] : '';

			$(".element-" + indice + "-row").append('<td class="table-bordered symbol-' + alfabeto[col] + '">' + posicaoQ + '</td>');
		}
	}
	$(".table-alfabeto tbody").append('<tr><td style="padding: 0;"></td></tr>');

}
//cria um map com os estados, adionando cada simbolo do token para cada respectivo estado
function geraTabelaEstados(arrTokens) {

	var posicao = 0;
	mapEstados = new Map();
	for (var key in arrTokens) {
		console.log(key);
		let add = (key > 0) ? false : true;
		var estadoAtual = 0;
		for (i = 0; i < arrTokens[key].length; i++) {
			if (add) {
				mapEstados.set(posicao++, [arrTokens[key][i], posicao]);
				if (i == arrTokens[key].length - 1) { mapEstados.set(posicao++, ["*"]) } 
			} else {
				if (mapEstados.get(estadoAtual).indexOf(arrTokens[key][i]) == -1) {
					mapEstados.get(estadoAtual).push(arrTokens[key][i], posicao);
					if (i == arrTokens[key].length - 1) {
						mapEstados.set(posicao++, ["*"]);
					} 
					add = true;
				} else {
					estadoAtual = mapEstados.get(i)[mapEstados.get(i).indexOf(arrTokens[key][i]) + 1];
					if (i == arrTokens[key].length - 1) {
						mapEstados.get(i + 1).push("*");
					}
				}
			}
		}
	}
}

function limpaClasses() {
	$("#inputToken").css("background-color", "");
	$('tbody tr').removeClass('success wrong selected selectedWrong');
	$('td').removeClass('wrong selected success selectedWrong');
	$('td').removeClass('success wrong selected selectedWrong');
}

//tenta encontrar o estado do simbolo digitado no campo de validacao
//armazena o ultimo estado
//caso nao encontrar bloqueia a verificacao para novos simbolos digitados
function verificaSymbol(symbol) {
	if (!block) {
		var campo = $('.element-' + proxEstado + '-row .symbol-' + symbol[symbol.length - 1]).html();

		limpaClasses()

		ultimoEstado = proxEstado;
		if (campo) {
			$('.element-' + proxEstado + '-row').addClass('success');
			$('.element-' + proxEstado + '-row > .symbol-' + symbol[symbol.length - 1]).addClass('selected');
			$('.symbol-' + symbol[symbol.length - 1]).addClass('success');
			proxEstado = parseInt(campo.replace("q", ""));
			$("#inputToken").css("background-color", "#d0e9c6");
			
		} else {
			$('.element-' + proxEstado + '-row').addClass('wrong');
			$('.element-' + proxEstado + '-row > .symbol-' + symbol[symbol.length - 1]).addClass('selectedWrong');
			$('.symbol-' + symbol[symbol.length - 1]).addClass('wrong');
			$("#inputToken").css("background-color", "#f9bdbb");
			block = true;
			ultimoTamanho = symbol.length;
		}
	}
}

function backtrack(symbol) {

	if (ultimoTamanho > symbol.length || symbol.length == 0){
		block = false;
	}

	if (!block) {
		limpaClasses();
		let component = (ultimoEstado > 0) ? $('.table-alfabeto .table-bordered').filter(function () { return $(this).text() == 'q' + ultimoEstado; })["0"].parentNode.className : "element-0-row";

		$('.symbol-' + symbol[symbol.length - 1]).addClass('success');
		$('.' + component).addClass('success');
		$('.table-alfabeto .table-bordered').filter(function() { return $(this).text() == 'q' + ultimoEstado; }).addClass('selected');
		$("#inputToken").css("background-color", "#d0e9c6");

		proxEstado = ultimoEstado;
		validaComponente(component);
	}	
}
