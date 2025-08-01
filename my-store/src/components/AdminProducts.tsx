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
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/products/', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError('Failed to fetch products.');
        }
      } catch (err) {
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(20px, 5vw, 40px)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: 'clamp(30px, 6vw, 50px)',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: 'clamp(40px, 8vw, 60px)',
            height: 'clamp(40px, 8vw, 60px)',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #1e3a8a',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto clamp(20px, 4vw, 30px)'
          }}></div>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            color: '#6b7280',
            margin: 0
          }}>
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(15px, 4vw, 30px)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: 'clamp(20px, 5vw, 40px)',
          textAlign: 'center',
          maxWidth: 'clamp(300px, 90vw, 500px)',
          width: '100%'
        }}>
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: 'clamp(12px, 3vw, 16px)',
            borderRadius: '6px',
            marginBottom: 'clamp(20px, 4vw, 30px)',
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
          <button 
            onClick={() => navigate('/admin-dashboard')}
            style={{
              background: '#1e3a8a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: 'clamp(12px, 3vw, 16px) clamp(20px, 4vw, 30px)',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1e3a8a'}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
      padding: 'clamp(15px, 4vw, 30px)'
    }}>
      <div style={{
        maxWidth: 'clamp(1000px, 95vw, 1400px)',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'clamp(20px, 4vw, 30px)',
          flexWrap: 'wrap',
          gap: 'clamp(10px, 2vw, 15px)'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
            color: 'white',
            margin: 0,
            fontWeight: 700
          }}>
            All Products
          </h2>
          <button 
            onClick={() => navigate('/admin-dashboard')}
            style={{
              background: 'transparent',
              color: 'white',
              border: '2px solid white',
              borderRadius: '6px',
              padding: 'clamp(8px, 2vw, 12px) clamp(12px, 2.5vw, 16px)',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s, color 0.2s',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#1e3a8a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'white';
            }}
          >
            Back to Dashboard
          </button>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(15px, 3vw, 20px)'
        }}>
          {products.map(product => (
            <div
              key={product.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: 'clamp(15px, 3vw, 20px)',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                transition: 'box-shadow 0.2s, transform 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Product Image */}
              <div style={{
                width: '100%',
                height: 'clamp(150px, 25vh, 200px)',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f3f4f6',
                marginBottom: 'clamp(12px, 2.5vw, 16px)'
              }}>
                {product.image_url ? (
                  <img 
                    src={`http://localhost:8000${product.image_url}`} 
                    alt={product.name} 
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
                    fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                  }}>
                    No Image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(8px, 2vw, 12px)'
              }}>
                <h3 style={{
                  fontSize: 'clamp(1.125rem, 2.5vw, 1.25rem)',
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: 0,
                  lineHeight: '1.3'
                }}>
                  {product.name}
                </h3>
                
                <p style={{
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.5',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {product.description}
                </p>
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: 'clamp(8px, 2vw, 12px)'
                }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <span style={{
                      fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                      fontWeight: 600,
                      color: '#1e3a8a'
                    }}>
                      ${product.price}
                    </span>
                    <span style={{
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      color: product.stock > 0 ? '#16a34a' : '#dc2626',
                      fontWeight: 500
                    }}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  
                  <button
                    onClick={() => navigate('/admin-dashboard', { state: { product } })}
                    style={{
                      background: '#1e3a8a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 20px)',
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#1e3a8a'}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: 'clamp(40px, 8vw, 60px)',
            textAlign: 'center',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            <p style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              color: '#6b7280',
              margin: 0
            }}>
              No products found. Add some products through the dashboard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts; 