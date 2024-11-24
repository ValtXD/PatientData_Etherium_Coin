import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className="home-container">
            <h1>Bem-vindo ao Sistema de Gerenciamento de Pacientes</h1>
            <p>Gerencie dados de pacientes com segurança utilizando tecnologia blockchain.</p>
            
            <div className="menu">
                <ul>
                    <li>
                        <Link to="/adicionar">Adicionar Paciente</Link>
                    </li>
                    <li>
                        <Link to="/exibir">Exibir Pacientes</Link>
                    </li>
                    <li>
                        <Link to="/patient-management">Gerenciar Pacientes</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Home;
