// const Storage = artifacts.require("Storage");

// module.exports = function(deployer) {
//   deployer.deploy(Storage);
// };

// const Multisig = artifacts.require("Multisig");
// module.exports = function(deployer) {
//   deployer.deploy(Multisig);
// };

// const DutchAuction = artifacts.require("DutchAuction");
// module.exports = function(deployer) {
//   deployer.deploy(DutchAuction);
// };
// const EnglishAuction = artifacts.require("EnglishAuction");

// module.exports = function(deployer) {
//   deployer.deploy(EnglishAuction);
// };
const MyNFT = artifacts.require("MyNFT");

module.exports = function(deployer) {
  deployer.deploy(MyNFT);
};

