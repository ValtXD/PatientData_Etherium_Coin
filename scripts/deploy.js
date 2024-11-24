const { ethers } = require("hardhat");

async function main() {
  // Obtenha o contrato e o deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Carregue o contrato
  const Contract = await ethers.getContractFactory("PatientData");
  const contract = await Contract.deploy();

  console.log("Contract deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
