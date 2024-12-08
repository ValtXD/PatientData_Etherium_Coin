import React, { useState } from 'react';
import Select from 'react-select';
import { ethers } from 'ethers';
import PatientContractABI from '../../artifacts/contracts/PatientData.sol/PatientData.json'; 

function Adicionar({ addPatientData }) {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [dataConsulta, setDataConsulta] = useState('');
    const [relato, setRelato] = useState('');
    const [medicacoes, setMedicacoes] = useState([]);
    const [doencasPreexistentes, setDoencasPreexistentes] = useState([]);
    const [alergias, setAlergias] = useState([]);
    const [diagnostico, setDiagnostico] = useState('');
    const [examesSolicitados, setExamesSolicitados] = useState('');
    const [anotacoesRetorno, setAnotacoesRetorno] = useState('');

    const contractAddress = "0x365F49CC2eb782B1a6537aaA7a9361466Aa3dfdC"; // Substituir pelo endereço do contrato

    const doencasOptions = [
        { value: 'Hipertensão', label: 'Hipertensão' },
        { value: 'Diabetes tipo I', label: 'Diabetes tipo I' },
        { value: 'Diabetes tipo II', label: 'Diabetes tipo II' },
        { value: 'Hipotensão', label: 'Hipotensão' },
        { value: 'Outros', label: 'Outros' },
    ];

    const alergiasOptions = [
        { value: 'Glúten', label: 'Glúten' },
        { value: 'Leite', label: 'Leite' },
        { value: 'Ovo', label: 'Ovo' },
        { value: 'Amendoim', label: 'Amendoim' },
        { value: 'Outros', label: 'Outros' },
    ];

    const handleBlockchainSubmit = async (patientData) => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, PatientContractABI.abi, signer);

            const tx = await contract.addPatient(
                patientData.nome,
                patientData.cpf,
                patientData.dataNascimento,
                patientData.dataConsulta,
                patientData.relatos || '',
                JSON.stringify(patientData.medicacoes),
                JSON.stringify(patientData.doencasPreexistentes),
                JSON.stringify(patientData.alergias),
                patientData.diagnostico,
                patientData.examesSolicitados || '',
                patientData.anotacoesRetorno || ''
            );

            console.log('Enviando transação para a blockchain...');
            await tx.wait();
            console.log('Dados adicionados à blockchain com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar dados para a blockchain:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const patientData = {
            nome,
            cpf,
            dataNascimento,
            dataConsulta,
            relato,
            medicacoes,
            doencasPreexistentes,
            alergias,
            diagnostico,
            examesSolicitados,
            anotacoesRetorno,
        };

        // Enviar dados para o backend, se aplicável
        if (addPatientData) {
            addPatientData(patientData);
        }

        // Enviar os dados para a blockchain
        await handleBlockchainSubmit(patientData);

        // Limpar campos após o envio
        setNome('');
        setCpf('');
        setDataNascimento('');
        setDataConsulta('');
        setRelato('');
        setMedicacoes([]);
        setDoencasPreexistentes([]);
        setAlergias([]);
        setDiagnostico('');
        setExamesSolicitados('');
        setAnotacoesRetorno('');
    };

    return (
        <div className="Adicionar">
            <h2>Adicionar Paciente</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>CPF:</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Data de Nascimento:</label>
                    <input
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Data da Consulta:</label>
                    <input
                        type="date"
                        value={dataConsulta}
                        onChange={(e) => setDataConsulta(e.target.value)}
                    />
                </div>
                <div>
                    <label>Relato:</label>
                    <textarea
                        value={relato}
                        onChange={(e) => setRelato(e.target.value)}
                    />
                </div>
                <div>
                    <label>Medicações:</label>
                    <input
                        type="text"
                        value={medicacoes}
                        onChange={(e) => setMedicacoes(e.target.value.split(','))}
                        placeholder="Separar por vírgulas"
                    />
                </div>
                <div>
                    <label>Doenças Preexistentes:</label>
                    <Select
                        isMulti
                        options={doencasOptions}
                        onChange={(selected) => setDoencasPreexistentes(selected.map(option => option.value))}
                    />
                </div>
                <div>
                    <label>Alergias:</label>
                    <Select
                        isMulti
                        options={alergiasOptions}
                        onChange={(selected) => setAlergias(selected.map(option => option.value))}
                    />
                </div>
                <div>
                    <label>Diagnóstico:</label>
                    <textarea
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                    />
                </div>
                <div>
                    <label>Exames Solicitados:</label>
                    <textarea
                        value={examesSolicitados}
                        onChange={(e) => setExamesSolicitados(e.target.value)}
                    />
                </div>
                <div>
                    <label>Anotações para Retorno:</label>
                    <textarea
                        value={anotacoesRetorno}
                        onChange={(e) => setAnotacoesRetorno(e.target.value)}
                    />
                </div>
                <button type="submit" className="submit-button">Salvar Paciente</button>
            </form>
        </div>
    );
}

export default Adicionar;
