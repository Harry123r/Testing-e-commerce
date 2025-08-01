import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:8000/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email,
          password,
        })
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || 'Registration successful!');
        if (data.access) localStorage.setItem('access_token', data.access);
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError(
          data.message ||
          Object.values(data).flat().join(' ') ||
          'Registration failed.'
        );
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(15px, 4vw, 30px)',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: 'clamp(20px, 5vw, 40px)',
        width: '100%',
        maxWidth: 'clamp(300px, 90vw, 400px)',
        margin: '0 auto'
      }}>
        <h2 style={{
          marginBottom: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          color: '#333',
          fontWeight: 600
        }}>
          Register
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'clamp(15px, 3vw, 20px)' }}>
            <label 
              htmlFor="username" 
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontWeight: 500,
                color: '#374151'
              }}
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'clamp(10px, 2.5vw, 12px)',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3182ce';
                e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: 'clamp(15px, 3vw, 20px)' }}>
            <label 
              htmlFor="email" 
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontWeight: 500,
                color: '#374151'
              }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'clamp(10px, 2.5vw, 12px)',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3182ce';
                e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: 'clamp(15px, 3vw, 20px)' }}>
            <label 
              htmlFor="password" 
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontWeight: 500,
                color: '#374151'
              }}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: 'clamp(10px, 2.5vw, 12px)',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3182ce';
                e.target.style.boxShadow = '0 0 0 3px rgba(49, 130, 206, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: 'clamp(8px, 2vw, 12px)',
              borderRadius: '6px',
              marginBottom: 'clamp(15px, 3vw, 20px)',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{
              background: '#f0fdf4',
              color: '#16a34a',
              padding: 'clamp(8px, 2vw, 12px)',
              borderRadius: '6px',
              marginBottom: 'clamp(15px, 3vw, 20px)',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              border: '1px solid #bbf7d0'
            }}>
              {success}
            </div>
          )}
          <button 
            type="submit" 
            style={{
              width: '100%',
              background: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: 'clamp(12px, 3vw, 16px)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2c5aa0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3182ce'}
          >
            Register
          </button>
        </form>
        <div style={{
          textAlign: 'center',
          marginTop: 'clamp(15px, 3vw, 20px)',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
          color: '#6b7280'
        }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{
            color: '#3182ce',
            textDecoration: 'none',
            fontWeight: 500
          }}>
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register; 