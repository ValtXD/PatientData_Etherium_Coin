const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const { savePatientOnBlockchain } = require('./blockchain'); // Função para salvar na blockchain

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Validação simples para campos obrigatórios
function validatePatientData(data) {
  const requiredFields = ['nome', 'cpf', 'dataNascimento'];
  for (const field of requiredFields) {
    if (!data[field]) {
      return `O campo ${field} é obrigatório.`;
    }
  }
  return null;
}

// Rota para adicionar paciente
app.post('/api/pacientes', async (req, res) => {
  const {
    nome, cpf, dataNascimento, dataConsulta,
    relato, doencasPreexistentes, alergias,
    medicacoes, diagnostico, examesSolicitados,
    anotacoesRetorno
  } = req.body;

  // Validação básica dos dados
  const validationError = validatePatientData(req.body);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const query = `
    INSERT INTO Pacientes 
    (nome, cpf, dataNascimento, dataConsulta, relato, doencasPreexistentes, 
     alergias, medicacoes, diagnostico, examesSolicitados, anotacoesRetorno)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // Salvar no banco SQLite
    db.run(query, [
      nome, cpf, dataNascimento, dataConsulta,
      relato, doencasPreexistentes, alergias,
      medicacoes, diagnostico, examesSolicitados,
      anotacoesRetorno
    ], async function (err) {
      if (err) {
        console.error('Erro ao salvar no banco de dados:', err);
        return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
      }

      // Salvar na blockchain
      try {
        const receipt = await savePatientOnBlockchain(
          nome,
          JSON.stringify({ diagnostico, examesSolicitados, anotacoesRetorno }) // Apenas dados principais para a blockchain
        );
        res.status(201).json({ id: this.lastID, blockchainReceipt: receipt });
      } catch (blockchainError) {
        console.error('Erro ao salvar na blockchain:', blockchainError);
        res.status(500).json({ error: 'Erro ao salvar na blockchain', details: blockchainError.message });
      }
    });
  } catch (error) {
    console.error('Erro geral no processamento:', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação', details: error.message });
  }
});

// Configuração do servidor
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
