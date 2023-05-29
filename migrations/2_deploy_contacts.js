const MyContract = artifacts.require("./Contest.sol");

module.exports = function(deployer) {
  deployer.deploy(MyContract);
//   deployer.deploy(MyContract, constructorArg1, constructorArg2);
};
