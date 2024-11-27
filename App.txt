import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web3 from 'web3';
import PatientContractABI from './artifacts/PatientData.json';
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

    useEffect(() => {
        if (!window.ethereum) {
            alert('MetaMask não detectado! Instale o MetaMask para usar a aplicação.');
        }
    }, []);

    // Conectar à blockchain
    useEffect(() => {
        const connectBlockchain = async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const networkId = await web3.eth.net.getId();
                const deployedNetwork = PatientContractABI.networks[networkId];

                if (deployedNetwork) {
                    const contractInstance = new web3.eth.Contract(
                        PatientContractABI.abi,
                        deployedNetwork.address
                    );
                    setContract(contractInstance);

                    const userAccounts = await web3.eth.getAccounts();
                    setAccounts(userAccounts);

                    // Carregar pacientes armazenados na blockchain
                    const totalPacientes = await contractInstance.methods.getPatientCount().call();
                    const loadedPacientes = [];
                    for (let i = 0; i < totalPacientes; i++) {
                        const paciente = await contractInstance.methods.getPatient(i).call();
                        loadedPacientes.push(paciente);
                    }
                    setPacientes(loadedPacientes);
                } else {
                    console.error('Contrato não encontrado na rede atual.');
                }
            } else {
                console.error('Ethereum não detectado. Instale o MetaMask!');
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
        // Para deletar, seria necessário implementar a lógica no contrato Solidity.
        console.warn('A função de deletar ainda não está integrada à blockchain.');
        setPacientes((prevPacientes) => prevPacientes.filter(paciente => paciente.cpf !== cpf));
    };

    const handleEditPaciente = (cpf, dadosAtualizados) => {
        // Atualizar um paciente na blockchain também exigiria uma função no contrato.
        console.warn('A função de editar ainda não está integrada à blockchain.');
        setPacientes((prevPacientes) =>
            prevPacientes.map(paciente =>
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
                            <Route exact path='/' element={<Home />} />
                            <Route
                                path='/Exibir'
                                element={
                                    <Exibir
                                        pacientes={pacientes}
                                        onDelete={handleDeletePaciente}
                                        onEdit={handleEditPaciente}
                                    />
                                }
                            />
                            <Route
                                path='/Adicionar'
                                element={
                                    <Adicionar
                                        onAddPaciente={handleAddPaciente}
                                    />
                                }
                            />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
}

export default App;
