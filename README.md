# Digital-Voting

## Start the server

    npm start

## Credentials

### Admin Credentials

`username`: `admin@admin.com`  
`password`: `admin`

### Test User Credentials

`username`: `user@user.com`  
`password`: `userpassword`

## Project setup

Install git, node.js and clone the repository

    git clone https://github.com/rkmurthy366/Digital-Voting.git
    cd ./Digital-Voting

Global install truffle, and install all project dependencies

    npm install -g truffle
    npm install

[Download Ganache](https://trufflesuite.com/ganache/)  
[Download MetaMask](https://metamask.io/)

### Compiling & Deploying Contracts

Open Ganache -> New Workspace -> add project -> select `truffle-config.js` from the project folder.

Compile the smart contract and migrate it.

    truffle compile
    truffle migrate
  
To re-deploy the same contract

    truffle migrate --reset

### MetaMask setup

Copy the `MNEMONIC` string from Ganache and paste at the `Secret Recovery Phrase` in MetaMask

Go to metamask settings -> network -> Add a network manually  
`RPC`: `http://127.0.0.1:7545`  
`Chain Id`  : `1337`  
`Symbol`    : `ETH`

## MySQL Database

[Download MySQL](https://dev.mysql.com/downloads/windows/installer/8.0.html)
Make a database with name `aadhar`  
Import the `aadhar.sql` file to this database

## .env

Rename `env.env` to `.env` and fill the details  
`DB_PASSWORD` = MySQL password  
`MAIL_USERNAME` = Gmail username  
`MAIL_PASSWORD` = App password  
[Sign in with app passwords](https://support.google.com/accounts/answer/185833?hl=en)
