import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  image_url: string | null;
  quantity?: number;
}

const Cart: React.FC = () => {
  const username = localStorage.getItem('username');
  const [cart, setCart] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      navigate('/login');
      return;
    }
    const cartKey = `cart_${username}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    setCart(storedCart);
  }, [username, navigate]);

  const handleRemove = (index: number) => {
    const cartKey = `cart_${username}`;
    const newCart = [...cart];
    if (newCart[index].quantity && newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    } else {
      newCart.splice(index, 1);
    }
    setCart(newCart);
    localStorage.setItem(cartKey, JSON.stringify(newCart));
  };

  const total = cart.reduce((sum, item) => sum + Number(item.price) * (item.quantity || 1), 0);

  if (!cart.length) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 'clamp(20px, 5vw, 40px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: 'clamp(30px, 6vw, 50px)',
          textAlign: 'center',
          maxWidth: 'clamp(300px, 90vw, 500px)',
          width: '100%'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            color: '#333',
            marginBottom: 'clamp(15px, 3vw, 20px)'
          }}>
            Your Cart
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            color: '#6b7280',
            marginBottom: 'clamp(20px, 4vw, 30px)'
          }}>
            Your cart is empty.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              background: '#3182ce',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 30px)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2c5aa0'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3182ce'}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: 'clamp(15px, 4vw, 30px)'
    }}>
      <div style={{
        maxWidth: 'clamp(800px, 95vw, 1200px)',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
          color: 'white',
          marginBottom: 'clamp(20px, 4vw, 30px)',
          textAlign: 'center'
        }}>
          Your Cart
        </h2>
        
        {/* Mobile/Tablet Card Layout */}
        <div style={{
          display: 'grid',
          gap: 'clamp(15px, 3vw, 20px)',
          marginBottom: 'clamp(20px, 4vw, 30px)'
        }}>
          {cart.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: 'clamp(15px, 3vw, 20px)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                display: 'grid',
                gridTemplateColumns: 'auto 1fr auto',
                gap: 'clamp(12px, 2.5vw, 16px)',
                alignItems: 'center'
              }}
            >
              {/* Product Image */}
              <div style={{
                width: 'clamp(60px, 15vw, 80px)',
                height: 'clamp(60px, 15vw, 80px)',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6'
              }}>
                {item.image_url ? (
                  <img 
                    src={`http://localhost:8000${item.image_url}`} 
                    alt={item.name} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: 'clamp(0.5rem, 2vw, 0.75rem)'
                  }}>
                    No Image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(4px, 1vw, 8px)'
              }}>
                <h3 style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: 0
                }}>
                  {item.name}
                </h3>
                <p style={{
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  color: '#3182ce',
                  fontWeight: 600,
                  margin: 0
                }}>
                  ${item.price}
                </p>
                <p style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  color: '#6b7280',
                  margin: 0
                }}>
                  Quantity: {item.quantity || 1}
                </p>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(idx)}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 2.5vw, 16px)',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#b91c1c'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#dc2626'}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* Total and Checkout */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: 'clamp(20px, 4vw, 30px)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(15px, 3vw, 20px)',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            color: '#1f2937',
            margin: 0,
            fontWeight: 600
          }}>
            Total: ${total.toFixed(2)}
          </h3>
          <button
            onClick={() => navigate('/buy')}
            style={{
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: 'clamp(12px, 3vw, 16px) clamp(24px, 5vw, 40px)',
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s, transform 0.1s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#15803d';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#16a34a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 