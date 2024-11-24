async function main() {
    const [deployer] = await ethers.getSigners(); // Obtém as contas disponíveis
    console.log("Contas disponíveis:");
    
    // Exibe o endereço e o saldo das contas
    for (let i = 0; i < 10; i++) {
      const account = await ethers.getSigner(i);
      const balance = await account.getBalance();
      console.log(`Conta ${i}: ${account.address} | Saldo: ${ethers.utils.formatEther(balance)} ETH`);
    }
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  