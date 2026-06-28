import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/authentication/login', { email, password });
      const token = response.data.data.token;
      localStorage.setItem('token', token);

      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw', }}>
      <form
        onSubmit={handleLogin}
        style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', width: '300px', textAlign: 'center', background: '#80AB31' }}
      >
        <h2>Login</h2>

        {/* Aquí mostramos el mensaje de error si existe */}
        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}

        <div style={{ marginBottom: '10px' }}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '90%' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '90%' }} />
        </div>
        <button type="submit" style={{ marginTop: '10px', width: '90%' }}>Login</button>
        <div style={{ marginTop: '15px' }}>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{ background: 'none', border: 'none', color: 'black', textDecoration: 'underline', cursor: 'pointer' }}
          >
            Regístrate aquí
          </button>
        </div>
      </form>
    </div>
  );
}