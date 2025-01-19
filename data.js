const fs = require("fs");

function readData() {
  if (!fs.existsSync("data.json")) {
    return [];
  }

  try {
    const data = fs.readFileSync("data.json");
    const user = JSON.parse(data);
    return user.users;
  } catch (error) {
    console.error("Error reading data: ", error.message);
    return;
  }
}

function writeData(data) {
  try {
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data : ", error.message);
  }
}

module.exports = { readData, writeData };
