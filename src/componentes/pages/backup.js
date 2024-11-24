import './Exibir.css';
import React, { useState } from 'react';
import Select from 'react-select';

function Exibir({ pacientes, onDelete, onEdit }) {
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [pacienteEmEdicao, setPacienteEmEdicao] = useState(null);

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

    const handleToggleExpand = (index) => {
        setExpandedIndex(prevIndex => (prevIndex === index ? null : index));
    };

    const handleDeleteClick = (cpf) => {
        if (window.confirm("Tem certeza que deseja apagar este paciente?")) {
            onDelete(cpf);
        }
    };

    const handleEditClick = (paciente) => {
        setPacienteEmEdicao({
            ...paciente,
            doencasPreexistentes: paciente.doencasPreexistentes || [],
            alergias: paciente.alergias || [],
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setPacienteEmEdicao((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMultiSelectChange = (selectedOptions, name) => {
        setPacienteEmEdicao((prev) => ({
            ...prev,
            [name]: selectedOptions ? selectedOptions.map(option => option.value) : [],
        }));
    };

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        onEdit(pacienteEmEdicao.cpf, pacienteEmEdicao);
        setPacienteEmEdicao(null);
    };

    if (!pacientes || pacientes.length === 0) {
        return (
            <div className="Pacientes">
                <p className="Titulo">Pacientes:</p>
                <p>Nenhum paciente adicionado!</p>
            </div>
        );
    }

    return (
        <div className="Pacientes">
            <p className="Titulo">Pacientes:</p>
            {pacienteEmEdicao ? (
                <form onSubmit={handleEditFormSubmit}>
                    <h3>Editando Paciente</h3>
                    <InputField label="Nome Completo:" name="nome" value={pacienteEmEdicao.nome} onChange={handleEditFormChange} />
                    <InputField label="CPF:" name="cpf" value={pacienteEmEdicao.cpf} onChange={handleEditFormChange} />
                    <InputField label="Data de nascimento:" name="dataNascimento" value={pacienteEmEdicao.dataNascimento} type="date" onChange={handleEditFormChange} />
                    <InputField label="Data da consulta:" name="dataConsulta" value={pacienteEmEdicao.dataConsulta} type="date" onChange={handleEditFormChange} />
                    <TextareaField label="Relato:" name="relato" value={pacienteEmEdicao.relato} onChange={handleEditFormChange} />
                    <MultiSelectField
                        label="Doenças preexistentes:"
                        options={doencasOptions}
                        value={pacienteEmEdicao.doencasPreexistentes.map(value => ({ value, label: value }))}
                        onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'doencasPreexistentes')}
                    />
                    <MultiSelectField
                        label="Alergias:"
                        options={alergiasOptions}
                        value={pacienteEmEdicao.alergias.map(value => ({ value, label: value }))}
                        onChange={(selectedOptions) => handleMultiSelectChange(selectedOptions, 'alergias')}
                    />
                    <InputField label="Medicações em uso:" name="medicacoes" value={pacienteEmEdicao.medicacoes} onChange={handleEditFormChange} />
                    <InputField label="Diagnóstico:" name="diagnostico" value={pacienteEmEdicao.diagnostico} onChange={handleEditFormChange} />
                    <TextareaField label="Anotações de Retorno:" name="anotacoesRetorno" value={pacienteEmEdicao.anotacoesRetorno} onChange={handleEditFormChange} />
                    <button type="submit" className="submit-button">Salvar</button>
                    <button type="button" onClick={() => setPacienteEmEdicao(null)}>Cancelar</button>
                </form>
            ) : (
                pacientes.map((paciente, index) => (
                    <div
                        key={index}
                        className={`informacoes-paciente ${expandedIndex === index ? 'expanded' : ''}`}
                        onClick={() => handleToggleExpand(index)}
                    >
                        <PacienteCard paciente={paciente} expanded={expandedIndex === index} onDelete={handleDeleteClick} onEdit={handleEditClick} />
                    </div>
                ))
            )}
        </div>
    );
}

function PacienteCard({ paciente, expanded, onDelete, onEdit }) {
    return (
        <div>
            <div className="form-group">
                <label>Nome Completo:</label> {paciente.nome}
            </div>
            <div className="form-group">
                <label>Data da consulta:</label> {paciente.dataConsulta}
            </div>
            {expanded && (
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
                    <button type="button" onClick={() => onEdit(paciente)}>Editar</button>
                    <button type="button" onClick={() => onDelete(paciente.cpf)}>Apagar</button>
                </>
            )}
        </div>
    );
}

function InputField({ label, name, value, onChange, type = "text" }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input type={type} name={name} value={value} onChange={onChange} />
        </div>
    );
}

function TextareaField({ label, name, value, onChange }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <textarea name={name} value={value} onChange={onChange} />
        </div>
    );
}

function MultiSelectField({ label, options, value, onChange }) {
    return (
        <div className="form-group">
            <label>{label}</label>
            <Select
                isMulti
                options={options}
                value={value}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={onChange}
            />
        </div>
    );
}

export default Exibir;
