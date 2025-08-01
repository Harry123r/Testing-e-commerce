import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Buy: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Clear the cart
      if (username) {
        localStorage.removeItem(`cart_${username}`);
      }
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(15px, 4vw, 30px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        padding: 'clamp(30px, 6vw, 50px)',
        width: '100%',
        maxWidth: 'clamp(350px, 90vw, 450px)',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          color: '#1f2937',
          marginBottom: 'clamp(20px, 4vw, 30px)',
          fontWeight: 700
        }}>
          Payment Gateway
        </h2>
        
        {!loading && !success && (
          <>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              color: '#6b7280',
              marginBottom: 'clamp(25px, 5vw, 35px)',
              lineHeight: '1.6'
            }}>
              Click below to simulate payment and place your order.
            </p>
            <button 
              onClick={handlePay}
              style={{
                width: '100%',
                background: '#3182ce',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: 'clamp(14px, 3vw, 18px)',
                fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s, transform 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2c5aa0';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3182ce';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Pay
            </button>
          </>
        )}
        
        {loading && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(15px, 3vw, 20px)'
          }}>
            <div style={{
              width: 'clamp(40px, 8vw, 60px)',
              height: 'clamp(40px, 8vw, 60px)',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3182ce',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              color: '#6b7280',
              margin: 0
            }}>
              Processing payment...
            </p>
          </div>
        )}
        
        {success && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(15px, 3vw, 20px)'
          }}>
            <div style={{
              width: 'clamp(60px, 12vw, 80px)',
              height: 'clamp(60px, 12vw, 80px)',
              background: '#16a34a',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              color: 'white'
            }}>
              ✓
            </div>
            <h4 style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
              color: '#16a34a',
              margin: 0,
              fontWeight: 600
            }}>
              Order placed successfully!
            </h4>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              color: '#6b7280',
              margin: 0
            }}>
              Redirecting to home page...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Buy; 