import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

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

const AdminDashboard: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authorized as admin
    fetch('http://localhost:8000/admin-login/', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Not authorized');
        return res.json();
      })
      .then(data => {
        if (data.is_admin) {
          setIsAuthorized(true);
        } else {
          setError('You are not authorized to access this page.');
        }
      })
      .catch(() => {
        setError('You are not authorized to access this page.');
      })
      .finally(() => {
        setIsLoading(false);
      });

    // If navigated with a product to edit, prefill the form
    if (location.state && (location.state as any).product) {
      const product = (location.state as any).product;
      setSelectedProduct(product);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
      setImage(null);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !description || !price || !stock || (!image && !selectedProduct)) {
      setError('All fields are required.');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('stock', stock);
    if (image) formData.append('image', image);
    const csrftoken = getCookie('csrftoken');
    try {
      let response;
      if (selectedProduct) {
        // Update product
        response = await fetch(`http://localhost:8000/products/${selectedProduct.id}`, {
          method: 'PUT',
          body: formData,
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrftoken || '',
          },
        });
      } else {
        // Create product
        response = await fetch('http://localhost:8000/products/', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            'X-CSRFToken': csrftoken || '',
          },
        });
      }
      if (response.ok) {
        setSuccess(selectedProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setImage(null);
        setSelectedProduct(null);
        const fileInput = document.getElementById('productImage') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const data = await response.json();
        setError(data.detail || 'Failed to save product.');
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    fetch('http://localhost:8000/admin-login/', {
      method: 'POST',
      credentials: 'include',
    }).finally(() => {
      navigate('/admin');
    });
  };

  if (isLoading) {
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
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
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
            onClick={() => navigate('/admin')}
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
            Go to Admin Login
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
        maxWidth: 'clamp(800px, 95vw, 1200px)',
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
            Admin Dashboard
          </h2>
          <div style={{
            display: 'flex',
            gap: 'clamp(8px, 2vw, 12px)',
            flexWrap: 'wrap'
          }}>
            <button 
              onClick={() => navigate('/admin-products')}
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
              View Store Items
            </button>
            <button 
              onClick={handleLogout}
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
              Logout
            </button>
          </div>
        </div>
        
        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          padding: 'clamp(20px, 5vw, 40px)',
          maxWidth: 'clamp(600px, 95vw, 800px)',
          margin: '0 auto'
        }}>
          <h3 style={{
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            color: '#1e3a8a',
            marginBottom: 'clamp(20px, 4vw, 30px)',
            textAlign: 'center',
            fontWeight: 600
          }}>
            {selectedProduct ? 'Update Product' : 'Add New Product'}
          </h3>
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div style={{ marginBottom: 'clamp(15px, 3vw, 20px)' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontWeight: 500,
                color: '#374151'
              }}>
                Product Name
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
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
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontWeight: 500,
                color: '#374151'
              }}>
                Description
              </label>
              <textarea 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                rows={3}
                style={{
                  width: '100%',
                  padding: 'clamp(10px, 2.5vw, 12px)',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  minHeight: '80px'
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
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontWeight: 500,
                color: '#374151'
              }}>
                Price
              </label>
              <input 
                type="number" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                step="0.01"
                min="0"
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
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontWeight: 500,
                color: '#374151'
              }}>
                Stock
              </label>
              <input 
                type="number" 
                value={stock} 
                onChange={e => setStock(e.target.value)} 
                min="0"
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
            
            <div style={{ marginBottom: 'clamp(20px, 4vw, 30px)' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                fontWeight: 500,
                color: '#374151'
              }}>
                Product Image
              </label>
              <input 
                type="file" 
                accept="image/*" 
                id="productImage"
                onChange={e => setImage(e.target.files ? e.target.files[0] : null)} 
                required 
                style={{
                  width: '100%',
                  padding: 'clamp(8px, 2vw, 10px)',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
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
              {selectedProduct ? 'Update Product' : 'Add Product'}
            </button>
            
            {selectedProduct && (
              <button 
                type="button" 
                onClick={() => setSelectedProduct(null)}
                style={{
                  width: '100%',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: 'clamp(10px, 2.5vw, 14px)',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  marginTop: 'clamp(10px, 2.5vw, 12px)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#4b5563'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#6b7280'}
              >
                Cancel Edit
              </button>
            )}
          </form>
          
          {success && (
            <div style={{
              background: '#f0fdf4',
              color: '#16a34a',
              padding: 'clamp(8px, 2vw, 12px)',
              borderRadius: '6px',
              marginTop: 'clamp(15px, 3vw, 20px)',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              border: '1px solid #bbf7d0'
            }}>
              {success}
            </div>
          )}
          
          {error && (
            <div style={{
              background: '#fef2f2',
              color: '#dc2626',
              padding: 'clamp(8px, 2vw, 12px)',
              borderRadius: '6px',
              marginTop: 'clamp(15px, 3vw, 20px)',
              fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 