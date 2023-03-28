const dadosJson = require('./distancias.json');
const readline = require('node:readline/promises');
const readlineSync = require('readline-sync');
// import dadosJson from './distancias.json' assert { type: 'json' };
// import readline from 'node:readline/promises';
// import readlineSync from 'readline-sync';

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
  const cidadePartida = origem.toUpperCase();
  const name = await rl.question('Qual a cidade de destino? ');
  const cidadeDestino = name.toUpperCase();
  const caminhao = await rl.question(
    'Qual o tipo de caminhao? [PEQUENO-MEDIO-GRANDE] '
  );
  const tipoCaminhao = caminhao.toUpperCase();
  await consultarTrecho();
}

async function consultarTrecho() {
  const distancia = await dadosJson[cidadePartida][cidadeDestino];
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
  exibirMenu();
}

async function questaoDois() {
  const origem = await rl.question('Qual a cidade de origem? ');
  const cidadePartida = origem.toUpperCase();
  const name = await rl.question('Qual a cidade de destino? ');
  const cidadeDestino = name.toUpperCase();
  const parada = await rl.question('Qual a cidade de parada? ');
  const cidadeParada = parada.toUpperCase();
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
  console.log(opcao);

  while (opcao !== '') {
    switch (opcao) {
      case '1':
        let qtdCel = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdCel);
        qtdTotal += qtdCel;
        itens.push({ nome: 'CELULAR', peso: item.CELULAR.peso * qtdCel });
        break;
      case '2':
        let qtdGel = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdGel);
        qtdTotal += qtdGel;
        itens.push({ nome: 'GELADEIRA', peso: item.GELADEIRA.peso * qtdGel });
        break;
      case '3':
        let qtdFree = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdFree);
        qtdTotal += qtdFree;
        itens.push({ nome: 'FREEZER', peso: item.FREEZER.peso * qtdFree });
        break;
      case '4':
        let qtdCad = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdCad);
        qtdTotal += qtdCad;
        itens.push({ nome: 'CADEIRA', peso: item.CADEIRA.peso * qtdCad });
        break;
      case '5':
        let qtdLum = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdLum);
        qtdTotal += qtdLum;
        itens.push({ nome: 'LUMINARIA', peso: item.LUMINARIA.peso * qtdLum });
        break;
      case '6':
        let qtdLav = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdLav);
        qtdTotal += qtdLav;
        itens.push({
          nome: 'LAVADORA DE ROUPA',
          peso: item['LAVADORA DE ROUPA'].peso * qtdLav,
        });
        break;
      default:
        console.log('Opção inválida.');
        break;
    }
    opcao = readlineSync.question(
      'Digite o numero correspondente ao proximo item que deseja adicionar (ou pressione enter para finalizar): '
    );
    console.log(opcao);
  }
  await calcularPesoTotal();
  await descarregarItem();
  await cadastrarTransporte();
}

async function calcularPesoTotal() {
  for (const item of itens) {
    pesoTotal += item.peso;
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

  let opcao = await readlineSync.question(
    '\nDigite o numero correspondente ao item que deseja descarregar: '
  );
  console.log(opcao);

  while (opcao !== '') {
    switch (opcao) {
      case '1':
        let qtdCel1 = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdCel1);
        qtdParada += qtdCel1;
        itensParada.push({
          nome: 'CELULAR',
          peso: item.CELULAR.peso * qtdCel1,
        });
        break;
      case '2':
        let qtdGel1 = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdGel1);
        qtdParada += qtdGel1;
        itensParada.push({
          nome: 'GELADEIRA',
          peso: item.GELADEIRA.peso * qtdGel1,
        });
        break;
      case '3':
        let qtdFree1 = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdFree1);
        qtdParada += qtdFree1;
        itensParada.push({
          nome: 'FREEZER',
          peso: item.FREEZER.peso * qtdFree1,
        });
        break;
      case '4':
        let qtdCad1 = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdCad1);
        qtdParada += qtdCad1;
        itensParada.push({
          nome: 'CADEIRA',
          peso: item.CADEIRA.peso * qtdCad1,
        });
        break;
      case '5':
        let qtdLum1 = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdLum1);
        qtdParada += qtdLum1;
        itensParada.push({
          nome: 'LUMINARIA',
          peso: item.LUMINARIA.peso * qtdLum1,
        });
        break;
      case '6':
        let qtdLav1 = readlineSync.questionInt('Qual a quantidade? ');
        console.log(qtdLav1);
        qtdParada += qtdLav1;
        itens.push({
          nome: 'LAVADORA DE ROUPA',
          peso: item['LAVADORA DE ROUPA'].peso * qtdLav1,
        });
        break;
      default:
        console.log('Opção inválida.');
        break;
    }
    opcao = readlineSync.question(
      'Digite o numero correspondente ao proximo item que deseja adicionar (ou pressione enter para finalizar): '
    );
    console.log(opcao);
  }
  calcularPesoParada();
}

function calcularPesoParada() {
  for (const item of itensParada) {
    pesoParada += item.peso;
  }
  return pesoParada;
}

async function cadastrarTransporte() {
  const distancia = await dadosJson[cidadePartida][cidadeParada];
  const distancia2 = await dadosJson[cidadeParada][cidadeDestino];
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
    resto2 = pesoTotal % caminhoes.GRANDE.capacidade;
  }
  if (resto2 >= caminhoes.MEDIO.capacidade) {
    numMedio2 = Math.floor(resto2 / caminhoes.MEDIO.capacidade);
    resto2 = resto2 % caminhoes.MEDIO.capacidade;
  }

  if (resto2 >= caminhoes.PEQUENO.capacidade) {
    numPequeno2 = Math.floor(resto2 / caminhoes.PEQUENO.capacidade);
  }

  if (resto2 < caminhoes.PEQUENO.capacidade && resto2 != 0) {
    numPequeno2++;
  }
  ///////////////////////////////////////////////
  // Peso restante
  if (pesoTotal - pesoParada >= caminhoes.GRANDE.capacidade) {
    numGrande = Math.floor(pesoTotal / caminhoes.GRANDE.capacidade);
    resto = (pesoTotal - pesoParada) % caminhoes.GRANDE.capacidade;
  }

  if (resto >= caminhoes.MEDIO.capacidade) {
    numMedio = Math.floor(resto / caminhoes.MEDIO.capacidade);
    resto = resto % caminhoes.MEDIO.capacidade;
  }

  if (resto >= caminhoes.PEQUENO.capacidade) {
    numPequeno = Math.floor(resto / caminhoes.PEQUENO.capacidade);
  }

  if (resto < caminhoes.PEQUENO.capacidade && resto != 0) {
    numPequeno++;
  }

  if (pesoTotal != 0) {
    // calcula o custo do transporte
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

await exibirMenu();
