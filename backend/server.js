const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const { savePatientOnBlockchain } = require('./blockchain'); // Importa função para salvar na blockchain

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rota para adicionar paciente
app.post('/api/pacientes', async (req, res) => {
  const {
    nome, cpf, dataNascimento, dataConsulta,
    relato, doencasPreexistentes, alergias,
    medicacoes, diagnostico, examesSolicitados,
    anotacoesRetorno
  } = req.body;

  const query = `
    INSERT INTO Pacientes 
    (nome, cpf, dataNascimento, dataConsulta, relato, doencasPreexistentes, 
     alergias, medicacoes, diagnostico, examesSolicitados, anotacoesRetorno)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    // 1. Salvar no banco SQLite
    db.run(query, [
      nome, cpf, dataNascimento, dataConsulta,
      relato, doencasPreexistentes, alergias,
      medicacoes, diagnostico, examesSolicitados,
      anotacoesRetorno
    ], async function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // 2. Salvar dados principais na blockchain
      try {
        const receipt = await savePatientOnBlockchain(
          nome,
          JSON.stringify({ diagnostico, examesSolicitados, anotacoesRetorno }) // Exemplo de dados que podem ir para a blockchain
        );
        res.status(201).json({ id: this.lastID, blockchainReceipt: receipt });
      } catch (blockchainError) {
        res.status(500).json({ error: 'Erro ao salvar na blockchain', details: blockchainError.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar a solicitação', details: error.message });
  }
});

// Configuração do servidor
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
