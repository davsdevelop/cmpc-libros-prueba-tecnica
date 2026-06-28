import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/authentication/register', { email, password });
      alert("Registro exitoso, ahora puedes iniciar sesión.");
      navigate('/');
    } catch (err) {
      setError('Error al registrar. El email podría estar duplicado.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#347734' }}>
      <form onSubmit={handleRegister} style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', background: 'gray' }}>
        <h2>Registro</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required style={{ display: 'block', marginBottom: '10px' }} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required style={{ display: 'block', marginBottom: '10px' }} />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}