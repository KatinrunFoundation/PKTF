let KTFForTestMigration = artifacts.require("./KTFForTestMigration.sol");  
let PrivateKatinrunFoudation = artifacts.require("./PrivateKatinrunFoudation.sol");  

module.exports = function(deployer) {  
  deployer.deploy(KTFForTestMigration, PrivateKatinrunFoudation.address);  
};
