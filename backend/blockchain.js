const Web3 = require('web3');
require('dotenv').config();

// Configuração do provedor Ethereum
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// ABI e endereço do contrato
const contractABI = [/* ABI do contrato aqui */];
const contractAddress = process.env.CONTRACT_ADDRESS;

// Instanciando o contrato
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Função para salvar dados do paciente na blockchain
async function savePatientOnBlockchain(nome, healthData) {
  try {
    // Conta do remetente
    const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

    // Transação para enviar dados ao contrato
    const tx = contract.methods.setPatientData(nome, healthData);
    const gas = await tx.estimateGas({ from: account.address });
    const data = tx.encodeABI();

    const signedTx = await account.signTransaction({
      to: contractAddress,
      data,
      gas,
    });

    // Enviando a transação
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('Transaction receipt:', receipt);
    return receipt;
  } catch (error) {
    console.error('Erro ao salvar na blockchain:', error);
    throw error;
  }
}

// Exporta a função para uso no servidor
module.exports = { savePatientOnBlockchain };
