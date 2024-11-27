require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.27",  // Certifique-se de que a versão esteja correta
    settings: {
      optimizer: {
        enabled: true,  // Ativa o otimizador
        runs: 200,      // Número de vezes que o código será otimizado
      }
    }
  },
  networks: {
    sepolia: {
      url: process.env.QUICKNODE_URL,  // Usando a variável de ambiente QUICKNODE_URL
      accounts: [process.env.PRIVATE_KEY],  // A chave privada do usuário
    },
  },
};
