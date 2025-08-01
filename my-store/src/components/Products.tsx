import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string | null;
  image_url: string | null;
}

const API_BASE_URL = 'http://localhost:8000';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const username = localStorage.getItem('username');
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.reload();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await axios.get<Product[]>('http://localhost:8000/products/');
        console.log('Full API Response:', JSON.stringify(response.data, null, 2));
        response.data.forEach(product => {
          console.log(`Product ${product.name} full data:`, product);
        });
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const cartKey = username ? `cart_${username}` : null;
    function updateCartCount() {
      if (cartKey) {
        const cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
        setCartCount(cart.length); 
      } else {
        setCartCount(0);
      }
    }
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('focus', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('focus', updateCartCount);
    };
  }, [username]);

  const handleAddToCart = (product: Product) => {
    if (!username) {
      alert('Please log in to add items to your cart.');
      return;
    }
    const cartKey = `cart_${username}`;
    let cart = JSON.parse(localStorage.getItem(cartKey) || '[]');

    const existingIndex = cart.findIndex((item: any) => item.id === product.id);
    if (existingIndex !== -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem(cartKey, JSON.stringify(cart));

    const totalCount = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    setCartCount(totalCount);
  };

  if (loading) {
    return (
      <div style={{ 
        color: 'black', 
        padding: '20px', 
        background: '#000', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        color: 'black', 
        padding: '20px', 
        background: '#000', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h2>Error loading products</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div style={{ 
        color: 'black', 
        padding: '20px', 
        background: '#000', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <h2>No products found</h2>
        <p>Please add some products through the Django admin interface.</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* Responsive Navigation */}
      <nav style={{
        width: '100%',
        background: '#222',
        padding: '15px 0',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h1 style={{
          color: 'white',
          textAlign: 'left',
          margin: 0,
          paddingLeft: '20px',
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          letterSpacing: '2px',
          fontWeight: 700,
          flex: '1 1 auto'
        }}>
          E-Commerce
        </h1>
        <div style={{ 
          paddingRight: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end'
        }}>
          {username ? (
            <>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                flexWrap: 'wrap'
              }}>
                <span style={{ 
                  color: 'white', 
                  fontWeight: 500,
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
                }}>
                  {username}
                </span>
                <Link to="/cart">
                  <button
                    style={{
                      background: '#3182ce',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontWeight: 500,
                      fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    🛒 {cartCount}
                  </button>
                </Link>
              </div>
              <button 
                onClick={handleLogout} 
                style={{ 
                  background: '#c53030', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4, 
                  padding: '6px 12px', 
                  cursor: 'pointer', 
                  fontWeight: 500,
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  whiteSpace: 'nowrap'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <h4 style={{ margin: 0 }}>
              <Link to="/login" style={{ 
                color: 'white', 
                textDecoration: 'none',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)'
              }}>
                Login
              </Link>
            </h4>
          )}
        </div>
      </nav>

      {/* Responsive Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(15px, 3vw, 20px)',
        padding: '0 clamp(15px, 4vw, 20px) 20px clamp(15px, 4vw, 20px)',
        maxWidth: '100vw',
        margin: '0 auto'
      }}>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              padding: 'clamp(15px, 3vw, 20px)',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              minHeight: 'clamp(320px, 50vh, 350px)',
              justifyContent: 'flex-start',
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ 
              width: '100%', 
              height: 'clamp(180px, 30vh, 200px)', 
              marginBottom: '15px',
              overflow: 'hidden',
              borderRadius: '4px',
              backgroundColor: '#f0f0f0'
            }}>
              {product.image_url ? (
                <img 
                  src={`${API_BASE_URL}${product.image_url}`}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    console.error('Error loading image:', product.image_url);
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
                }}>
                  No Image Available
                </div>
              )}
            </div>
            <h3 style={{ 
              margin: '0 0 10px 0',
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              lineHeight: '1.3'
            }}>
              {product.name}
            </h3>
            <p style={{ 
              fontWeight: 'bold', 
              color: '#2c5282',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              margin: '5px 0'
            }}>
              Price: ${product.price}
            </p>
            <p style={{ 
              color: product.stock > 0 ? '#2f855a' : '#c53030',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              margin: '5px 0'
            }}>
              Stock: {product.stock}
            </p>
            {username && (
              <button
                onClick={e => {
                  e.preventDefault();
                  navigate(`/products/${product.id}`);
                }}
                style={{
                  marginTop: 'auto',
                  background: '#3182ce',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: 'clamp(8px, 2vw, 12px) clamp(12px, 3vw, 16px)',
                  cursor: 'pointer',
                  fontWeight: 500,
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2c5aa0'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#3182ce'}
              >
                View More
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products; 