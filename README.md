# User Authentication Program

A simple CLI-based ATM

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Farizptr/atm-1.git
```

2. Navigate to the project directory:
```bash
cd atm-1
```

3. Install dependencies:
```bash
npm install
```

## Usage

1. Start the program:
```bash
npm start
```

2. Available commands:
```bash
* `login [name]` - Logs in as this customer and creates the customer if not exist

* `deposit [amount]` - Deposits this amount to the logged in customer

* `withdraw [amount]` - Withdraws this amount from the logged in customer

* `transfer [target] [amount]` - Transfers this amount from the logged in customer to the target customer

* `logout` - Logs out of the current customer
```

## Important Notes

- The program must be running before executing any commands
- You must log out before logging in as a different user
- To exit the program, use `Control + C`

## Example Usage

```bash
$ npm start
> Authentication program started...

$ login Alice
> Alice logged in successfully

$ login Bob
> Error: Another user is currently logged in. Please logout first

$ logout
> Logged out successfully

$ login Bob
> Bob logged in successfully
```

## Command Reference

### Login
- Format: `login [username]`
- Description: Authenticates a user into the system
- Requirements: No other user should be currently logged in

### Logout
- Format: `logout`
- Description: Logs out the currently authenticated user
- Requirements: A user must be logged in to use this command

## Error Handling

The program will display appropriate error messages for:
- Attempting to login while another user is already logged in
- Attempting to logout when no user is logged in
- Invalid command syntax

## Contributing

[Add contribution guidelines if applicable]

## License

[Add license information if applicable]