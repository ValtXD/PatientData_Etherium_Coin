// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientData {
    struct Patient {
        string nome;
        string cpf;
        string dataNascimento;
        string dataConsulta;
        string relato;
        string[] medicacoes;
        string[] doencasPreexistentes;
        string[] alergias;
        string diagnostico;
        string examesSolicitados;
        string anotacoesRetorno;
    }

    mapping(uint256 => Patient) public patients;
    uint256 public patientCount;

    // Função para adicionar um paciente
    function setPatientData(
        string memory nome,
        string memory cpf,
        string memory dataNascimento,
        string memory dataConsulta,
        string memory relato,
        string[] memory medicacoes,
        string[] memory doencasPreexistentes,
        string[] memory alergias,
        string memory diagnostico,
        string memory examesSolicitados,
        string memory anotacoesRetorno
    ) public {
        patients[patientCount] = Patient(
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
        );
        patientCount++;
    }

    // Função para editar os dados de um paciente (pelo índice)
    function editPatientData(
        uint256 patientId,
        string memory nome,
        string memory cpf,
        string memory dataNascimento,
        string memory dataConsulta,
        string memory relato,
        string[] memory medicacoes,
        string[] memory doencasPreexistentes,
        string[] memory alergias,
        string memory diagnostico,
        string memory examesSolicitados,
        string memory anotacoesRetorno
    ) public {
        Patient storage patient = patients[patientId];
        patient.nome = nome;
        patient.cpf = cpf;
        patient.dataNascimento = dataNascimento;
        patient.dataConsulta = dataConsulta;
        patient.relato = relato;
        patient.medicacoes = medicacoes;
        patient.doencasPreexistentes = doencasPreexistentes;
        patient.alergias = alergias;
        patient.diagnostico = diagnostico;
        patient.examesSolicitados = examesSolicitados;
        patient.anotacoesRetorno = anotacoesRetorno;
    }

    // Função para excluir um paciente (pelo índice)
    function deletePatient(uint256 patientId) public {
        delete patients[patientId];
        patientCount--;
    }
}
