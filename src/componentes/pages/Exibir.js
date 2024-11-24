import './Exibir.css';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';

function Exibir({ pacientes, onDelete, onEdit, web3, contract }) {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [pacienteEmEdicao, setPacienteEmEdicao] = useState(null);

    const handleToggleExpand = (index) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleMultiSelectChange = (selectedOptions, name) => {
        setPacienteEmEdicao((prev) => ({
            ...prev,
            [name]: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
    };

    const handleDeleteClick = async (cpf) => {
        if (window.confirm("Tem certeza que deseja apagar este paciente?")) {
            await onDelete(cpf); // Chama a função onDelete, que pode interagir com o contrato.
        }
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setPacienteEmEdicao((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditFormSubmit = async (e) => {
        e.preventDefault();

        // Chama a função onEdit para atualizar o paciente no contrato Solidity
        await onEdit(pacienteEmEdicao.cpf, pacienteEmEdicao);
        setPacienteEmEdicao(null);
    };

    const handleEditClick = (paciente) => {
        setPacienteEmEdicao(paciente);
    };

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

    const renderPacienteInfo = (paciente, index) => {
        return (
            <div
                key={index}
                className={`informacoes-paciente ${expandedIndex === index ? 'expanded' : ''}`}
                onClick={() => handleToggleExpand(index)}
            >
                <div className="form-group">
                    <label>Nome Completo:</label> {paciente.nome}
                </div>
                <div className="form-group">
                    <label>Data da consulta:</label> {paciente.dataConsulta}
                </div>
                <div className="form-group">
                    <label>Relato:</label> {paciente.relato}
                </div>

                {expandedIndex === index && (
                    <>
                        <div className="form-group">
                            <label>CPF:</label> {paciente.cpf}
                        </div>
                        <div className="form-group">
                            <label>Data de nascimento:</label> {paciente.dataNascimento}
                        </div>
                        <div className="form-group">
                            <label>Medicações em uso:</label> {paciente.medicacoes}
                        </div>
                        <div className="form-group">
                            <label>Diagnóstico:</label> {paciente.diagnostico}
                        </div>
                        <div className="form-group">
                            <label>Exames Solicitados:</label> {paciente.examesSolicitados}
                        </div>
                        <div className="form-group">
                            <label>Anotações de Retorno:</label> {paciente.anotacoesRetorno}
                        </div>
                        <button type="button" className="apagar-button" onClick={() => handleDeleteClick(paciente.cpf)}>Apagar</button>
                        <button type="button" className="editar-button" onClick={() => handleEditClick(paciente)}>Editar</button>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="Pacientes">
            <p className='Titulo'>Pacientes: </p>
            {pacientes && pacientes.length > 0 ? (
                pacientes.map((paciente, index) => renderPacienteInfo(paciente, index))
            ) : (
                <p>Não há pacientes cadastrados.</p>
            )}

            {pacienteEmEdicao && (
                <form onSubmit={handleEditFormSubmit}>
                    <h3>Editando Paciente</h3>
                    <div className="form-group">
                        <label>Nome Completo:</label>
                        <input
                            type="text"
                            name="nome"
                            value={pacienteEmEdicao.nome}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>CPF:</label>
                        <input
                            type="text"
                            name="cpf"
                            value={pacienteEmEdicao.cpf}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data de nascimento:</label>
                        <input
                            type="date"
                            name="dataNascimento"
                            value={pacienteEmEdicao.dataNascimento}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Data da consulta:</label>
                        <input
                            type="date"
                            name="dataConsulta"
                            value={pacienteEmEdicao.dataConsulta}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Relato:</label>
                        <textarea
                            name="relato"
                            value={pacienteEmEdicao.relato}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Doenças Preexistentes:</label>
                        <Select
                            isMulti
                            options={doencasOptions}
                            value={doencasPreexistentes.map(value => ({ value, label: value }))}
                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'doencasPreexistentes')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Alergias:</label>
                        <Select
                            isMulti
                            options={alergiasOptions}
                            value={alergias.map(value => ({ value, label: value }))}
                            onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'alergias')}
                        />
                    </div>
                    <div className="form-group">
                        <label>Medicações em uso:</label>
                        <input
                            type="text"
                            name="medicacoes"
                            value={pacienteEmEdicao.medicacoes}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Diagnóstico:</label>
                        <input
                            type="text"
                            name="diagnostico"
                            value={pacienteEmEdicao.diagnostico}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Exames Solicitados:</label>
                        <input
                            type="text"
                            name="examesSolicitados"
                            value={pacienteEmEdicao.examesSolicitados}
                            onChange={handleEditFormChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Anotações de Retorno:</label>
                        <textarea
                            name="anotacoesRetorno"
                            value={pacienteEmEdicao.anotacoesRetorno}
                            onChange={handleEditFormChange}
                        />
                    </div>

                    <button type="submit" className="submit-button">Salvar</button>
                    <button type="button" onClick={() => setPacienteEmEdicao(null)}>Cancelar</button>
                </form>
            )}
        </div>
    );
}

export default Exibir;
