import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Utility to get the CSRF token from cookies
function getCookie(name: string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const Admin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    const csrftoken = getCookie('csrftoken');
    try {
      const response = await fetch('http://localhost:8000/admin-register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken || '',
        },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok && data.is_admin) {
        setSuccess('Admin registered successfully! Redirecting to dashboard...');
        if (data.access) localStorage.setItem('access_token', data.access);
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh);
        setTimeout(() => navigate('/admin-dashboard'), 1500);
      } else {
        setError(data.detail || 'Registration failed.');
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
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: 'clamp(20px, 5vw, 40px)',
        width: '100%',
        maxWidth: 'clamp(350px, 90vw, 500px)',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(20px, 4vw, 30px)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: '#1e3a8a',
            marginBottom: 'clamp(10px, 2vw, 15px)',
            fontWeight: 700
          }}>
            Admin Registration
          </h2>
          <p style={{
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            color: '#6b7280',
            margin: 0
          }}>
            Register as an admin to manage products
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 'clamp(15px, 3vw, 20px)' }}>
            <label 
              htmlFor="registerUsername" 
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
              id="registerUsername"
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
                e.target.style.borderColor = '#1e3a8a';
                e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: 'clamp(15px, 3vw, 20px)' }}>
            <label 
              htmlFor="registerEmail" 
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
              id="registerEmail"
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
                e.target.style.borderColor = '#1e3a8a';
                e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{ marginBottom: 'clamp(15px, 3vw, 20px)' }}>
            <label 
              htmlFor="registerPassword" 
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
              id="registerPassword"
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
                e.target.style.borderColor = '#1e3a8a';
                e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
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
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: 'clamp(12px, 3vw, 16px)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#15803d'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#16a34a'}
          >
            Register as Admin
          </button>
        </form>
        
        <div style={{
          textAlign: 'center',
          marginTop: 'clamp(15px, 3vw, 20px)'
        }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1e3a8a',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            Back to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin;
  
