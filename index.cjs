const dadosJson = require('./distancias.json');
const readline = require('node:readline/promises');
const fs = require('fs');

let cidadePartida = '';
let cidadeDestino = '';
let cidadeParada = '';
let tipoCaminhao = '';
let pesoTotal = 0;
let pesoParada = 0;
let itens = [];
let itensParada = [];
let qtdTotal = 0;
let qtdParada = 0;
let tipoProduto = 0;
let qtdCaminhoes = 0;
let qtdCaminhoes2 = 0;

const caminhoes = {
  PEQUENO: {
    capacidade: 1000,
    custo_por_km: 4.87,
  },
  MEDIO: {
    capacidade: 4000,
    custo_por_km: 11.92,
  },
  GRANDE: {
    capacidade: 10000,
    custo_por_km: 27.44,
  },
};

let item = {
  CELULAR: {
    peso: 0.5,
  },
  GELADEIRA: {
    peso: 60,
  },
  FREEZER: {
    peso: 100,
  },
  CADEIRA: {
    peso: 5,
  },
  LUMINARIA: {
    peso: 0.8,
  },
  'LAVADORA DE ROUPA': {
    peso: 10000,
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function exibirMenu() {
  console.log('---------------------------');
  console.log('Selecione uma opção:');
  console.log('1. Consultar trechos x modalidade');
  console.log('2. Cadastrar transporte');
  console.log('3. Dados estatísticos');
  console.log('4. Finalizar o programa');
  const option = await rl.question('Opção: ');
  switch (option) {
    case '1':
      await questaoUm();
      break;
    case '2':
      await questaoDois();
      break;
    case '3':
      await questaoTres();
      break;
    case '4':
      console.log('Saindo...');
      rl.close();
      process.exit();
      break;
    default:
      console.log('Opção inválida.');
      await exibirMenu();
      break;
  }
}

async function questaoUm() {
  const origem = await rl.question('Qual a cidade de origem? ');
  cidadePartida = removerAcentos(origem.toUpperCase());
  const name = await rl.question('Qual a cidade de destino? ');
  cidadeDestino = removerAcentos(name.toUpperCase());
  const caminhao = await rl.question(
    'Qual o tipo de caminhao? [PEQUENO-MEDIO-GRANDE] '
  );
  tipoCaminhao = removerAcentos(caminhao.toUpperCase());
  await consultarTrecho();
}

function removerAcentos(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function consultarTrecho() {
  const distancia = dadosJson[cidadePartida][cidadeDestino];
  let precoKm;
  switch (tipoCaminhao) {
    case 'PEQUENO':
      precoKm = 4.87;
      break;
    case 'MEDIO':
      precoKm = 11.92;
      break;
    case 'GRANDE':
      precoKm = 27.44;
      break;
    default:
      console.log('Tipo de caminhão inválido.');
      rl.close();
      return;
  }
  const custoTotal = distancia * precoKm;
  console.log(
    `De ${cidadePartida} para ${cidadeDestino}, utilizando um caminhão de ${tipoCaminhao} porte, a distância é de ${distancia} km e o custo será de R$ ${custoTotal.toFixed(
      2
    )}.`
  );
  await exibirMenu();
}

async function questaoDois() {
  const origem = await rl.question('Qual a cidade de origem? ');
  cidadePartida = removerAcentos(origem.toUpperCase());
  const name = await rl.question('Qual a cidade de destino? ');
  cidadeDestino = removerAcentos(name.toUpperCase());
  const parada = await rl.question('Qual a cidade de parada? ');
  cidadeParada = removerAcentos(parada.toUpperCase());
  cadastrarItem();
}

async function cadastrarItem() {
  console.log('\nEscolha os itens: ');
  console.log('1 - [Celular]: ');
  console.log('2 - [Geladeira]: ');
  console.log('3 - [Freezer]: ');
  console.log('4 - [Cadeira]: ');
  console.log('5 - [Luminária]: ');
  console.log('6 - [Lavadora de roupa]: ');

  let opcao = await rl.question(
    'Digite o numero correspondente ao item que deseja adicionar: '
  );

  while (opcao !== '') {
    switch (opcao) {
      case '1':
        let qtdCel = await rl.question('Qual a quantidade? ');
        qtdTotal += +qtdCel;
        if (qtdCel > 0) {
          tipoProduto++;
        }
        itens.push({ nome: 'CELULAR', peso: item.CELULAR.peso * qtdCel });
        break;
      case '2':
        let qtdGel = await rl.question('Qual a quantidade? ');
        qtdTotal += +qtdGel;
        if (qtdGel > 0) {
          tipoProduto++;
        }
        itens.push({ nome: 'GELADEIRA', peso: item.GELADEIRA.peso * qtdGel });
        break;
      case '3':
        let qtdFree = await rl.question('Qual a quantidade? ');
        qtdTotal += +qtdFree;
        if (qtdFree > 0) {
          tipoProduto++;
        }
        itens.push({ nome: 'FREEZER', peso: item.FREEZER.peso * qtdFree });
        break;
      case '4':
        let qtdCad = await rl.question('Qual a quantidade? ');
        qtdTotal += +qtdCad;
        if (qtdCad > 0) {
          tipoProduto++;
        }
        itens.push({ nome: 'CADEIRA', peso: item.CADEIRA.peso * qtdCad });
        break;
      case '5':
        let qtdLum = await rl.question('Qual a quantidade? ');
        qtdTotal += +qtdLum;
        if (qtdLum > 0) {
          tipoProduto++;
        }
        itens.push({ nome: 'LUMINARIA', peso: item.LUMINARIA.peso * qtdLum });
        break;
      case '6':
        let qtdLav = await rl.question('Qual a quantidade? ');
        qtdTotal += +qtdLav;
        if (qtdLav > 0) {
          tipoProduto++;
        }
        itens.push({
          nome: 'LAVADORA DE ROUPA',
          peso: item['LAVADORA DE ROUPA'].peso * qtdLav,
        });
        break;
      default:
        console.log('Opção inválida.');
        break;
    }
    opcao = await rl.question(
      'Digite o numero correspondente ao proximo item que deseja adicionar (ou pressione enter para finalizar): '
    );
  }
  await calcularPesoTotal();
  await descarregarItem();
  await cadastrarTransporte();
}

async function calcularPesoTotal() {
  for (const item of itens) {
    pesoTotal += +item.peso;
  }
  return pesoTotal;
}

async function descarregarItem() {
  console.log('\nEscolha os itens para descarregar na primeira parada: ');
  console.log('1 - [Celular]: ');
  console.log('2 - [Geladeira]: ');
  console.log('3 - [Freezer]: ');
  console.log('4 - [Cadeira]: ');
  console.log('5 - [Luminária]: ');
  console.log('6 - [Lavadora de roupa]: ');

  let opcao = await rl.question(
    '\nDigite o numero correspondente ao item que deseja descarregar (ou pressione enter para finalizar): '
  );

  while (opcao !== '') {
    switch (opcao) {
      case '1':
        let qtdCel1 = await rl.question('Qual a quantidade? ');
        qtdParada += +qtdCel1;
        itensParada.push({
          nome: 'CELULAR',
          peso: item.CELULAR.peso * qtdCel1,
        });
        break;
      case '2':
        let qtdGel1 = await rl.question('Qual a quantidade? ');
        qtdParada += +qtdGel1;
        itensParada.push({
          nome: 'GELADEIRA',
          peso: item.GELADEIRA.peso * qtdGel1,
        });
        break;
      case '3':
        let qtdFree1 = await rl.question('Qual a quantidade? ');
        qtdParada += +qtdFree1;
        itensParada.push({
          nome: 'FREEZER',
          peso: item.FREEZER.peso * qtdFree1,
        });
        break;
      case '4':
        let qtdCad1 = await rl.question('Qual a quantidade? ');
        qtdParada += +qtdCad1;
        itensParada.push({
          nome: 'CADEIRA',
          peso: item.CADEIRA.peso * qtdCad1,
        });
        break;
      case '5':
        let qtdLum1 = await rl.question('Qual a quantidade? ');
        qtdParada += +qtdLum1;
        itensParada.push({
          nome: 'LUMINARIA',
          peso: item.LUMINARIA.peso * qtdLum1,
        });
        break;
      case '6':
        let qtdLav1 = await rl.question('Qual a quantidade? ');
        qtdParada += +qtdLav1;
        itensParada.push({
          nome: 'LAVADORA DE ROUPA',
          peso: item['LAVADORA DE ROUPA'].peso * qtdLav1,
        });
        break;
      default:
        console.log('Opção inválida.');
        break;
    }
    opcao = await rl.question(
      'Digite o numero correspondente ao proximo item que deseja descarregar (ou pressione enter para finalizar): '
    );
  }
  calcularPesoParada();
}

async function calcularPesoParada() {
  for (const item of itensParada) {
    pesoParada += +item.peso;
  }
  return pesoParada;
}

async function cadastrarTransporte() {
  const distancia = dadosJson[cidadePartida][cidadeParada];
  const distancia2 = dadosJson[cidadeParada][cidadeDestino];
  const distanceTotal = distancia + distancia2;

  let numGrande = 0;
  let numMedio = 0;
  let numPequeno = 0;
  let numGrande2 = 0;
  let numMedio2 = 0;
  let numPequeno2 = 0;
  let resto = pesoTotal - pesoParada;
  let resto2 = pesoParada;

  //////////////////////////////////////////
  // Peso PARADA
  if (pesoParada >= caminhoes.GRANDE.capacidade) {
    numGrande2 = Math.floor(pesoParada / caminhoes.GRANDE.capacidade);
    qtdCaminhoes += numGrande2;
    resto2 = pesoTotal % caminhoes.GRANDE.capacidade;
  }
  if (resto2 >= caminhoes.MEDIO.capacidade) {
    numMedio2 = Math.floor(resto2 / caminhoes.MEDIO.capacidade);
    qtdCaminhoes += numMedio2;
    resto2 = resto2 % caminhoes.MEDIO.capacidade;
  }

  if (resto2 >= caminhoes.PEQUENO.capacidade) {
    numPequeno2 = Math.floor(resto2 / caminhoes.PEQUENO.capacidade);
    qtdCaminhoes += numPequeno2;
  }

  if (resto2 < caminhoes.PEQUENO.capacidade && resto2 != 0) {
    numPequeno2++;
    qtdCaminhoes += numPequeno2;
  }
  ///////////////////////////////////////////////
  // Peso restante
  if (pesoTotal - pesoParada >= caminhoes.GRANDE.capacidade) {
    numGrande = Math.floor(pesoTotal / caminhoes.GRANDE.capacidade);
    qtdCaminhoes2 += numGrande;
    resto = (pesoTotal - pesoParada) % caminhoes.GRANDE.capacidade;
  }

  if (resto >= caminhoes.MEDIO.capacidade) {
    numMedio = Math.floor(resto / caminhoes.MEDIO.capacidade);
    qtdCaminhoes2 += numMedio;
    resto = resto % caminhoes.MEDIO.capacidade;
  }

  if (resto >= caminhoes.PEQUENO.capacidade) {
    numPequeno = Math.floor(resto / caminhoes.PEQUENO.capacidade);
    qtdCaminhoes2 += numPequeno;
  }

  if (resto < caminhoes.PEQUENO.capacidade && resto != 0) {
    numPequeno++;
    qtdCaminhoes2 += numPequeno;
  }

  if (pesoTotal != 0) {
    // Calula o do transporte total e do primeiro trecho
    const custoTotal2 =
      numGrande2 * caminhoes.GRANDE.custo_por_km * distancia +
      numMedio2 * caminhoes.MEDIO.custo_por_km * distancia +
      numPequeno2 * caminhoes.PEQUENO.custo_por_km * distancia;

    const custoTotal =
      numGrande * caminhoes.GRANDE.custo_por_km * distanceTotal +
      numMedio * caminhoes.MEDIO.custo_por_km * distanceTotal +
      numPequeno * caminhoes.PEQUENO.custo_por_km * distanceTotal;

    console.log(
      `\nDe ${cidadePartida} parando em ${cidadeParada}, descarregando um total de ${pesoParada}kg de ${itensParada
        .map(i => i.nome)
        .join(
          ', '
        )},\nserá necessário utilizar ${numGrande2} caminhão(oes) grande(s), ${numMedio2} caminhão(oes) médio(s) e ${numPequeno2} caminhão(oes) pequeno(s)\ncom o custo de R$${custoTotal2.toFixed(
        2
      )} neste primeiro trajeto. O custo unitário é de R$${(
        custoTotal2 / qtdParada
      ).toFixed(2)} \nPara transportar o restante de ${
        pesoTotal - pesoParada
      } kg até ${cidadeDestino}, será necessário utilizar ${numGrande} caminhão(oes) grande(s), ${numMedio} caminhão(oes) médio(s) e ${numPequeno} caminhão(oes) pequeno(s),\ncom custo total de R$${custoTotal.toFixed(
        2
      )} e um custo unitário de R$${(
        custoTotal /
        (qtdTotal - qtdParada)
      ).toFixed(2)}`
    );
    let dadosGravados = `
      Transporte:
      Cidade de Partida: ${cidadePartida},
      Cidade de Destino: ${cidadeDestino},
      Cidade de Parada: ${cidadeParada},
      Custo Total: R$${custoTotal.toFixed(2)},
      Custo Trecho até a Parada: R$${custoTotal2.toFixed(2)},
      Custo Trecho Final: R$${(custoTotal - custoTotal2).toFixed(2)},
      Custo Médio por km: R$${(custoTotal / distanceTotal).toFixed(2)},
      Custo Médio por tipo de produto: R$${(custoTotal / tipoProduto).toFixed(
        2
      )},
      Custo Total para Caminhão Grande: R$${(
        custoTotal /
        (numGrande + numGrande2)
      ).toFixed(2)}
      Custo Total para Caminhão Medio: R$${(
        custoTotal /
        (numMedio + numMedio2)
      ).toFixed(2)}
      Custo Total para Caminhão Pequeno: R$${(
        custoTotal /
        (numPequeno + numPequeno2)
      ).toFixed(2)},
      Numero Total de veículos: ${(qtdCaminhoes + qtdCaminhoes2).toFixed(2)},
      Total de itens transportados: ${qtdTotal}
      -------------------------------`;
    await save(dadosGravados);
  } else {
    console.log(
      `Não há caminhões disponíveis para transportar ${pesoTotal} kg de ${itens
        .map(item => item.nome)
        .join(
          ', '
        )} de ${cidadePartida} até ${cidadeDestino} com parada em ${cidadeParada}.`
    );
  }
  await exibirMenu();
}

async function questaoTres() {
  fs.readFile('relatorio.txt', 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log(data);
      exibirMenu();
    }
  });
}

async function save(content) {
  fs.appendFile('relatorio.txt', content, err => {
    if (err) {
      console.log(err);
      return;
    }
  });
}

exibirMenu();
