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
        choices: ["Criar conta", "Consultar saldo", "Sacar", "Sair"],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      switch (action) {
        case "Criar conta":
          createAccont();
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
        return
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
