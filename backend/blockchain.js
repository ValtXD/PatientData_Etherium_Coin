require('dotenv').config();

console.log('QUICKNODE_URL:', process.env.QUICKNODE_URL);

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.QUICKNODE_URL));
//const web3 = new Web3(process.env.QUICKNODE_URL);


// Importar o ABI do contrato
const PatientContractABI = require('./artifacts/contracts/PatientData.sol/PatientData.json');
const contractAddress = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

// Verificar se as variáveis estão configuradas corretamente
if (!process.env.QUICKNODE_URL || !contractAddress || !privateKey) {
  throw new Error('Variáveis de ambiente faltando. Verifique seu .env.');
}

// Inicializar o contrato
const patientContract = new web3.eth.Contract(PatientContractABI.abi, contractAddress);

// Configurar a conta do proprietário
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

// Função para salvar paciente na blockchain
async function savePatientOnBlockchain(nome, detalhes) {
  try {
    // Construir transação para chamar o método `addPatient`
    const transaction = patientContract.methods.addPatient(nome, detalhes);
    const gas = await transaction.estimateGas({ from: account.address });
    const gasPrice = await web3.eth.getGasPrice();

    // Enviar a transação assinada
    const receipt = await transaction.send({
      from: account.address,
      gas,
      gasPrice,
    });

    console.log('Paciente salvo na blockchain:', receipt);
    return receipt; // Retorna o recibo da transação
  } catch (error) {
    console.error('Erro ao salvar paciente na blockchain:', error);
    throw error;
  }
}

module.exports = {
  savePatientOnBlockchain,
};
