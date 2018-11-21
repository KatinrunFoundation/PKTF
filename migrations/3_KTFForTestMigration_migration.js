let KTFForTestMigration = artifacts.require("./KTFForTestMigration.sol");  
  
module.exports = function(deployer) {  
  deployer.deploy(KTFForTestMigration);  
};
