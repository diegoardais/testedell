const dadosJson = require('./distancias.json');
const readline = require('readline');
const readlineSync = require('readline-sync');
const inquirer = require('inquirer');

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

function exibirMenu() {
  console.log('---------------------------');
  console.log('Selecione uma opção:');
  console.log('1. Consultar trechos x modalidade');
  console.log('2. Cadastrar transporte');
  console.log('3. Dados estatísticos');
  console.log('4. Finalizar o programa');
  rl.question('Opção: ', option => {
    switch (option) {
      case '1':
        questaoUm();
        break;
      case '2':
        questaoDois();
        break;
      case '3':
        questaoTres();
        break;
      case '4':
        console.log('Saindo...');
        rl.close();
        process.exit();
        break;
      default:
        console.log('Opção inválida.');
        exibirMenu();
        break;
    }
  });
}

function questaoUm() {
  rl.question('Qual a cidade de origem? ', origem => {
    cidadePartida = origem.toUpperCase();
    rl.question('Qual a cidade de destino? ', name => {
      cidadeDestino = name.toUpperCase();
      rl.question(
        'Qual o tipo de caminhao? [Pequeno-médio-grande] ',
        caminhao => {
          tipoCaminhao = caminhao.toUpperCase();
          consultarTrecho();
        }
      );
    });
  });
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

function questaoDois() {
  rl.question('Qual a cidade de origem? ', origem => {
    cidadePartida = origem.toUpperCase();
    rl.question('Qual a cidade de destino? ', name => {
      cidadeDestino = name.toUpperCase();
      rl.question('Qual a cidade de parada? ', parada => {
        cidadeParada = parada.toUpperCase();
        cadastrarItem();
      });
    });
  });
}

async function cadastrarItem() {
  const itens = [
    { nome: 'CELULAR', peso: 0.5 },
    { nome: 'GELADEIRA', peso: 60 },
    { nome: 'FREEZER', peso: 100 },
    { nome: 'CADEIRA', peso: 5 },
    { nome: 'LUMINÁRIA', peso: 0.8 },
    { nome: 'LAVADORA DE ROUPA', peso: 10000 },
  ];

  const respostas = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcao',
      message: 'Escolha os itens:',
      choices: itens.map(item => ({
        name: `${item.nome} (peso: ${item.peso})`,
        value: item,
      })),
      loop: false,
    },
  ]);

  const itemSelecionado = respostas.opcao;
  const qtd = await inquirer.prompt({
    type: 'number',
    name: 'qtd',
    message: `Quantidade de ${itemSelecionado.nome}:`,
    default: 1,
  });

  itensParada.push({
    nome: itemSelecionado.nome,
    peso: itemSelecionado.peso * qtd,
  });
  qtdParada += qtd;

  const opcao = await inquirer.prompt({
    type: 'list',
    name: 'opcao',
    message: 'Deseja adicionar mais algum item?',
    choices: ['Sim', 'Não'],
  });

  if (opcao.opcao === 'Sim') {
    await cadastrarItem();
  } else {
    calcularPesoTotal();
    descarregarItem();
  }
}

function calcularPesoTotal() {
  for (const item of itens) {
    pesoTotal += item.peso;
  }
  return pesoTotal;
}

async function descarregarItem() {
  console.log('\nEscolha os itens para descarregar na primeira parada: ');
  const itens = [
    { nome: 'CELULAR', peso: 0.5 },
    { nome: 'GELADEIRA', peso: 60 },
    { nome: 'FREEZER', peso: 100 },
    { nome: 'CADEIRA', peso: 5 },
    { nome: 'LUMINÁRIA', peso: 0.8 },
    { nome: 'LAVADORA DE ROUPA', peso: 10000 },
  ];

  const respostas = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcao',
      message: 'Escolha os itens:',
      choices: itens.map(item => ({
        name: `${item.nome} (peso: ${item.peso})`,
        value: item,
      })),
      loop: false,
    },
  ]);

  const itemSelecionado = respostas.opcao;
  const qtd = await inquirer.prompt({
    type: 'number',
    name: 'qtd',
    message: `Quantidade de ${itemSelecionado.nome}:`,
    default: 1,
  });

  itensParada.push({
    nome: itemSelecionado.nome,
    peso: itemSelecionado.peso * qtd,
  });
  qtdParada += qtd;

  const opcao = await inquirer.prompt({
    type: 'list',
    name: 'opcao',
    message: 'Deseja adicionar mais algum item?',
    choices: ['Sim', 'Não'],
  });

  if (opcao.opcao === 'Sim') {
    await descarregarItem();
  } else {
    calcularPesoParada();
    cadastrarTransporte();
  }
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
        )},\nserá necessário utilizar ${numGrande2} caminhão(s) grande(s), ${numMedio2} caminhão(s) médio(s) e ${numPequeno2} caminhão(s) pequeno(s).\ncom o custo de R$${custoTotal2.toFixed(
        2
      )} neste primeiro trajeto. O custo unitário é de R$${(
        custoTotal2 / qtdParada
      ).toFixed(2)} \nPara transportar o restante de ${
        pesoTotal - pesoParada
      } kg até ${cidadeDestino}, será necessário utilizar ${numGrande} caminhão(s) grande(s), ${numMedio} caminhão(s) médio(s) e ${numPequeno} caminhão(s) pequeno(s),\ncom custo total de R$${custoTotal.toFixed(
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
  exibirMenu();
}

exibirMenu();
