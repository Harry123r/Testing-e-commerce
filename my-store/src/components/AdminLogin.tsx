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

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const csrftoken = getCookie('csrftoken');
    try {
      const response = await fetch('http://localhost:8000/admin-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken || '',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok && data.is_admin) {
        navigate('/admin-dashboard');
      } else {
        setError(data.detail || 'Not authorized as admin.');
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
        maxWidth: 'clamp(300px, 90vw, 400px)',
        margin: '0 auto'
      }}>
        <h2 style={{
          marginBottom: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          color: '#1e3a8a',
          fontWeight: 700
        }}>
          Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
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
          <button 
            type="submit" 
            style={{
              width: '100%',
              background: '#1e3a8a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: 'clamp(12px, 3vw, 16px)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1e3a8a'}
          >
            Login
          </button>
        </form>
        <div style={{
          textAlign: 'center',
          marginTop: 'clamp(15px, 3vw, 20px)'
        }}>
          <p style={{
            fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
            color: '#6b7280',
            margin: '0 0 clamp(8px, 2vw, 12px) 0'
          }}>
            Don't have an admin account?
          </p>
          <button 
            onClick={() => navigate('/admin')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1e3a8a',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0
            }}
          >
            Register as Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 