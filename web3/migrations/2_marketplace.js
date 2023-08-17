const Marketplace = artifacts.require("Marketplace");

module.exports = function(deployer) {
  const feePercent = 2; // Modifier cette valeur selon vos besoins
  deployer.deploy(Marketplace, feePercent);
};
