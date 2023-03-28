const inquirer = require('inquirer');

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

const answers = inquirer.prompt([
  {
    message: 'QUAL QUAL',
    type: 'input',
    default: 'oi',
    name: 'sabor',
  },
]);

answers.then(answers => {
  console.log(`humm delicia ${answers.sabor}`);
});
