const { readData, writeData } = require("./data.js");
const readline = require("readline");

function updateData() {
  const index = data.findIndex((user) => user.name === currentUser.name);
  data[index] = currentUser;
  writeData({ users: data });
}

function oweCheck(amount) {
  let remainingAmount = amount;

  if (!currentUser.debts || Object.keys(currentUser.debts).length === 0) {
    return remainingAmount;
  }

  for (const [debtAccount, debtAmount] of Object.entries(currentUser.debts)) {
    if (debtAmount > 0 && remainingAmount > 0) {
      const paymentAmount = Math.min(remainingAmount, debtAmount);
      const targetUser = data.find((user) => user.name === debtAccount);

      targetUser.balance += paymentAmount;
      currentUser.debts[debtAccount] -= paymentAmount;
      remainingAmount -= paymentAmount;

      if (currentUser.debts[debtAccount] === 0) {
        delete currentUser.debts[debtAccount];
      }

      console.log(`Transferred $${paymentAmount} to ${debtAccount}`);
      if (currentUser.debts[debtAccount] > 0) {
        console.log(`Owed $${currentUser.debts[debtAccount]} to ${debtAccount}`);
      }
    }
  }

  return remainingAmount;
}

function deposit(amount) {
  if (!amount || amount <= 0) {
    console.log("Please input valid amount");
    return currentUser.balance;
  }

  const remainingAmount = oweCheck(amount);
  if (remainingAmount > 0) {
    currentUser.balance += remainingAmount;
  }

  updateData();
  console.log(`Your balance is $${currentUser.balance}`);
  return currentUser.balance;
}

function withdraw(amount) {
  if (!amount || amount <= 0) {
    console.log("Please input a valid amount");
    return currentUser.balance;
  }

  if (amount > currentUser.balance) {
    console.log("You have insufficient funds");
    return currentUser.balance;
  }

  currentUser.balance -= amount;
  updateData();
  console.log(`Your balance is $${currentUser.balance}`);
  return currentUser.balance;
}

function transfer(amount, targetUsername) {
  if (!amount || amount <= 0) {
    console.log("Please input valid amount");
    return currentUser.balance;
  }

  const targetUser = data.find((item) => item.name === targetUsername);
  if (!targetUser) {
    console.log("Account doesn't exist");
    return currentUser.balance;
  }

  if (targetUser.debts && targetUser.debts[currentUser.name] > 0) {
    const debtPayment = Math.min(amount, targetUser.debts[currentUser.name]);
    targetUser.debts[currentUser.name] -= debtPayment;

    // Remove debt if fully paid
    if (targetUser.debts[currentUser.name] === 0) {
      delete targetUser.debts[currentUser.name];
    }

    console.log(`Your balance is $${currentUser.balance}`);
    if (targetUser.debts[currentUser.name] > 0) {
      console.log(
        `Owed $${targetUser.debts[currentUser.name]} from ${targetUsername}`
      );
    }

    const remainingAmount = amount - debtPayment;
    if (remainingAmount > 0) {
      if (remainingAmount <= currentUser.balance) {
        currentUser.balance -= remainingAmount;
        targetUser.balance += remainingAmount;
        console.log(`Transferred $${remainingAmount} to ${targetUsername}`);
      } else {
        const available = Math.min(remainingAmount, currentUser.balance);
        const newDebt = remainingAmount - available;

        currentUser.balance -= available;
        targetUser.balance += available;

        if (!currentUser.debts) currentUser.debts = {};
        currentUser.debts[targetUsername] = newDebt;

        console.log(`Transferred $${available} to ${targetUsername}`);
        console.log(`Owed $${newDebt} to ${targetUsername}`);
      }
    }
  } else {
    const availableAmount = Math.min(amount, currentUser.balance);
    const debtAmount = amount - availableAmount;

    currentUser.balance -= availableAmount;
    targetUser.balance += availableAmount;

    if (debtAmount > 0) {
      if (!currentUser.debts) currentUser.debts = {};
      currentUser.debts[targetUsername] = debtAmount;
      console.log(`Transferred $${availableAmount} to ${targetUsername}`);
      console.log(`Your balance is $${currentUser.balance}`);
      console.log(`Owed $${debtAmount} to ${targetUsername}`);
    } else {
      console.log(`Transferred $${availableAmount} to ${targetUsername}`);
      console.log(`Your balance is $${currentUser.balance}`);
    }
  }

  updateData();
  return currentUser.balance;
}

function mainMenu() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "$ ",
  });
  rl.prompt();
  rl.on("line", (line) => {
    let arrayinput = line.split(" ");

    switch (arrayinput[0]) {
      case "login":
        if (!loggedIn) {
          user = arrayinput[1];
          if (!user) {
            console.log("Please provide username");
            break;
          }

          currentUser = data.find((item) => item.name === user);
          if (!currentUser) {
            user = {
              name: user,
              balance: 0,
              debts: {},
            };

            data.push(user);
            writeData({ users: data });
            currentUser = user;
          }
        } else {
          console.log("Already Logged in, Please Logout First!");
          break;
        }
        loggedIn = true;
        console.log(`Hello, ${currentUser.name}!`);
        console.log(`Your balance is $${currentUser.balance}`);
        if (currentUser.debts) {
          Object.entries(currentUser.debts).forEach(([debtAccount, amount]) => {
            if (amount > 0) {
              console.log(`Owed $${amount} to ${debtAccount}`);
            }
          });
        }

        // Show debts owed by others
        data.forEach((user) => {
          if (user.debts && user.debts[currentUser.name] > 0) {
            console.log(
              `Owed $${user.debts[currentUser.name]} from ${user.name}`
            );
          }
        });
        break;

      case "deposit":
        if (!loggedIn) {
          console.log("Login dulu");
        } else {
          currentUser.balance = deposit(
            parseInt(arrayinput[1]),
            currentUser.balance
          );
        }

        break;
      case "withdraw":
        if (!loggedIn) {
          console.log("Login dulu");
        } else {
          currentUser.balance = withdraw(
            parseInt(arrayinput[1]),
            currentUser.balance
          );
        }
        break;
      case "transfer":
        if (!loggedIn) {
          console.log("Login dulu");
          break;
        }
        currentUser.balance = transfer(parseInt(arrayinput[2]), arrayinput[1]);

        break;
      case "logout":
        if (!loggedIn) {
          console.log("Login dulu");
          break;
        } else if (arrayinput[1]) {
          console.log("Usage: logout");
        } else {
          console.log(`Goodbye, ${currentUser.name}!`);
          loggedIn = false;
        }
        break;

      default:
        console.log("Please input a valid command");
    }
    rl.prompt();
  }).on("close", () => {
    console.log("\nExiting!");
    process.exit(0);
  });
}

let loggedIn = false;
let user = null;
data = readData();

mainMenu();

module.exports = {
  deposit,
  withdraw,
  transfer,
  updateData,
};
