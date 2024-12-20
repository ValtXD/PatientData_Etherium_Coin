import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import PatientContractABI from './artifacts/contracts/PatientData.sol/PatientData.json'; // Caminho correto do ABI
import BarraSuperior from './componentes/layout/BarraSuperior';
import BarraLateral from './componentes/layout/BarraLateral';
import Exibir from './componentes/pages/Exibir';
import Adicionar from './componentes/pages/Adicionar';
import Home from './componentes/pages/Home';
import './App.css';

function App() {
    const [pacientes, setPacientes] = useState([]);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);

    // Exibir alerta se não houver provedor de Web3
    useEffect(() => {
        if (!window.ethereum && !window.web3) {
            alert('Nenhum provedor Web3 detectado! Certifique-se de que uma carteira Web3 (como MetaMask ou Argent) está instalada.');
        }
    }, []);

    // Conectar à blockchain
    useEffect(() => {
        const connectBlockchain = async () => {
            try {
                const provider = window.ethereum || window.web3.currentProvider;

                if (!provider) {
                    console.error('Nenhum provedor Web3 detectado.');
                    return;
                }

                const web3 = new Web3(provider);
                await provider.request({ method: 'eth_requestAccounts' });

                const networkId = await web3.eth.net.getId();
                const deployedNetwork = PatientContractABI.networks[networkId];

                console.log('Network ID:', networkId);
                console.log('Deployed Network:', deployedNetwork);

                if (deployedNetwork) {
                    const contractInstance = new web3.eth.Contract(
                        PatientContractABI.abi,
                        deployedNetwork.address
                    );
                    setContract(contractInstance);

                    const userAccounts = await web3.eth.getAccounts();
                    console.log('User Accounts:', userAccounts);
                    setAccounts(userAccounts);

                    // Carregar pacientes armazenados na blockchain
                    const totalPacientes = await contractInstance.methods.getPatientCount().call();
                    console.log('Total de Pacientes:', totalPacientes);

                    const loadedPacientes = [];
                    for (let i = 0; i < totalPacientes; i++) {
                        const paciente = await contractInstance.methods.getPatient(i).call();
                        loadedPacientes.push(paciente);
                    }
                    setPacientes(loadedPacientes);
                } else {
                    console.error('Contrato não encontrado na rede atual.');
                }
            } catch (error) {
                console.error('Erro ao conectar à blockchain:', error);
            }
        };

        connectBlockchain();
    }, []);

    const handleAddPaciente = async (novoPaciente) => {
        if (contract && accounts.length > 0) {
            const { nome, cpf, dataNascimento } = novoPaciente;

            try {
                await contract.methods
                    .addPatient(nome, cpf, dataNascimento)
                    .send({ from: accounts[0] });

                // Atualizar a lista local após adicionar na blockchain
                setPacientes((prevPacientes) => [...prevPacientes, novoPaciente]);
            } catch (err) {
                console.error('Erro ao adicionar paciente na blockchain:', err);
            }
        } else {
            console.error('Contrato ou contas não disponíveis.');
        }
    };

    const handleDeletePaciente = (cpf) => {
        console.warn('A função de deletar ainda não está integrada à blockchain.');
        setPacientes((prevPacientes) => prevPacientes.filter((paciente) => paciente.cpf !== cpf));
    };

    const handleEditPaciente = (cpf, dadosAtualizados) => {
        console.warn('A função de editar ainda não está integrada à blockchain.');
        setPacientes((prevPacientes) =>
            prevPacientes.map((paciente) =>
                paciente.cpf === cpf ? { ...paciente, ...dadosAtualizados } : paciente
            )
        );
    };

    return (
        <Router>
            <div className="page-background">
                <BarraSuperior />
                <div className="content-container">
                    <BarraLateral />
                    <div className="pages planodefundo">
                        <Routes>
                            <Route exact path="/" element={<Home />} />
                            <Route
                                path="/Exibir"
                                element={
                                    <Exibir
                                        pacientes={pacientes}
                                        onDelete={handleDeletePaciente}
                                        onEdit={handleEditPaciente}
                                    />
                                }
                            />
                            <Route
                                path="/Adicionar"
                                element={<Adicionar onAddPaciente={handleAddPaciente} />}
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
