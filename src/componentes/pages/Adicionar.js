import React, { useState } from 'react';
import Select from 'react-select';

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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Chama a função passada como prop (addPatientData) para adicionar o paciente
        addPatientData({
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
            anotacoesRetorno
        });

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
                <div className="form-group">
                    <label>Nome Completo:</label>
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>CPF:</label>
                    <input
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Data de Nascimento:</label>
                    <input
                        type="date"
                        value={dataNascimento}
                        onChange={(e) => setDataNascimento(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Data da Consulta:</label>
                    <input
                        type="date"
                        value={dataConsulta}
                        onChange={(e) => setDataConsulta(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Relato:</label>
                    <textarea
                        value={relato}
                        onChange={(e) => setRelato(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Medicações em Uso:</label>
                    <input
                        type="text"
                        value={medicacoes}
                        onChange={(e) => setMedicacoes(e.target.value.split(','))}
                    />
                    <small>Separar medicações com vírgula</small>
                </div>
                <div className="form-group">
                    <label>Doenças Preexistentes:</label>
                    <Select
                        isMulti
                        options={doencasOptions}
                        value={doencasPreexistentes.map(value => ({ value, label: value }))}
                        onChange={(selectedOptions) => setDoencasPreexistentes(selectedOptions.map(option => option.value))}
                    />
                </div>
                <div className="form-group">
                    <label>Alergias:</label>
                    <Select
                        isMulti
                        options={alergiasOptions}
                        value={alergias.map(value => ({ value, label: value }))}
                        onChange={(selectedOptions) => setAlergias(selectedOptions.map(option => option.value))}
                    />
                </div>
                <div className="form-group">
                    <label>Diagnóstico:</label>
                    <input
                        type="text"
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Exames Solicitados:</label>
                    <input
                        type="text"
                        value={examesSolicitados}
                        onChange={(e) => setExamesSolicitados(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Anotações de Retorno:</label>
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
