async function main() {
    const [account] = await ethers.getSigners();  // Obtemos a primeira conta configurada
    const balance = await account.getBalance();  // Pegamos o saldo dessa conta
    console.log(`Saldo da conta ${account.address}: ${ethers.utils.formatEther(balance)} ETH`);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  