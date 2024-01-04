const inquirer = require("inquirer");
const chalk = require("chalk");

const fs = require("fs");

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar conta",
          "Consultar saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      switch (action) {
        case "Criar conta":
          createAccont();
          break;

        case "Consultar saldo":
          getAccountBalance();
          break;
        case "Depositar":
          deposit();
          break;
        case "Sacar":
          withdraw();
          break;

        case "Sair":
          console.log(
            chalk.bgBlue.black("Obrigado por escolher o nosso banco!")
          );
          process.exit();
          break;

        default:
          break;
      }
    })
    .catch((err) => console.log(err));
}

function createAccont() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções do sua conta a seguir"));
  buildAccont();
}
function buildAccont() {
  inquirer
    .prompt([
      {
        name: "accontName",
        message: "Digite um nome para sua conta: ",
      },
    ])
    .then((answer) => {
      const accontName = answer["accontName"];

      //console.info(accontName);

      if (!fs.existsSync("acconts")) {
        fs.mkdirSync("acconts");
      }

      if (fs.existsSync(`acconts/${accontName}.json`)) {
        console.log(chalk.bgRed.black("Esta conta já existe!"));
        buildAccont();
        return;
      }

      fs.writeFileSync(
        `acconts/${accontName}.json`,
        '{"balance": 0}',
        (err) => {
          console.log(err);
        }
      );
      console.log(chalk.green("Conta criada com sucesso!"));
      operation();
    })
    .catch((err) => console.log(err));
}
function deposit() {
  inquirer
    .prompt([
      {
        name: "accontName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accontName = answer["accontName"];

      if (!checkAccount(accontName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja depositar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          addAmount(accontName, amount);
          operation();
        });
    });
}

function checkAccount(accontName) {
  if (!fs.existsSync(`acconts/${accontName}.json`)) {
    console.log(
      chalk.bgRed.black("Esta conta não existe, escolha outro nome!")
    );
    return false;
  }
  return true;
}

function getAccount(accontName) {
  const accountJSON = fs.readFileSync(`acconts/${accontName}.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(accountJSON);
}

function addAmount(accontName, amount) {
  const accountData = getAccount(accontName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde!")
    );
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `acconts/${accontName}.json`,
    JSON.stringify(accountData),
    (err) => {
      console.log(err);
    }
  );

  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
  );
}

function getAccountBalance() {
  inquirer
    .prompt([
      {
        name: "accontName",
        message: "Qual o nome da sua conta? ",
      },
    ])
    .then((answer) => {
      const acountName = answer["accontName"];

      if (!checkAccount(acountName)) {
        return getAccountBalance();
      }

      const accontData = getAccount(acountName);
      console.log(
        chalk.bgBlue.black(
          `Olá, o saldo da sua conta é R$${accontData.balance}`
        )
      );
    })
    .catch((err) => console.log(err));
}
function withdraw() {
  inquirer
    .prompt([
      {
        name: "accontName",
        message: "Qual o nome da sua conta? ",
      },
    ])
    .then((answer) => {
      const accountName = answer["accontName"];

      if (!checkAccount(accountName)) {
        return withdraw();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Quanto você deseja retirar? ",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];
          removeAmount(accountName, amount);
          operation();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}


function removeAmount(accountName, amount){
  const accountData = getAccount(accountName)

  if (!amount) {
    console.log(
      chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'),
    )
    return withdraw()
  }

  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black('Valor indisponível!'))
    return withdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

  fs.writeFileSync(
    `acconts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    },
  )

  console.log(
    chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`),
  )
}