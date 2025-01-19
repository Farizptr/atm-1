const { readData, writeData } = require("../data.js");
const { deposit, withdraw, transfer } = require("../index.js");

jest.mock("../data.js");
jest.mock("../index.js");

let data;
let currentUser;

beforeEach(() => {
  // Reset the data and currentUser before each test
  data = [
    {
      name: "Alice",
      balance: 100,
      debts: {
        Bob: 50,
      },
    },
    {
      name: "Bob",
      balance: 50,
      debts: {
        Alice: 50,
      },
    },
  ];

  // Mock the readData function to return the initial data
  readData.mockReturnValue(data);
  writeData.mockImplementation(() => {}); // Mock writeData to do nothing

  // Set the currentUser to Alice
  currentUser = data[0];
});

describe("Deposit Function", () => {
  test("should not deposit invalid amount", () => {
    deposit(-10); // Call the actual deposit function
    expect(currentUser.balance).toBe(100); // Expect balance to remain unchanged
  });
});
