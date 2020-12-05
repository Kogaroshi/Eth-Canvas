const Pixel = artifacts.require("Pixel");

module.exports = async function(deployer) {
  await deployer.deploy(Pixel)
  const pixel = await Pixel.deployed()
};