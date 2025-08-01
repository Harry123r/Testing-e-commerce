import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

type Product = {
    id: number;
    name: string;
    price: number;
    stock: number;
    description: string;
    image_url: string | null;
};

function handleAddToCart(product: any) {
    const username = localStorage.getItem('username');
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
}

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8000/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [id]);

    if (!product) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                        borderTop: '4px solid #3182ce',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto clamp(20px, 4vw, 30px)'
                    }}></div>
                    <p style={{
                        fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                        color: '#6b7280',
                        margin: 0
                    }}>
                        Loading product...
                    </p>
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
                maxWidth: 'clamp(800px, 95vw, 1000px)',
                margin: '0 auto'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    overflow: 'hidden'
                }}>
                    {/* Product Image */}
                    {product.image_url && (
                        <div style={{
                            width: '100%',
                            height: 'clamp(250px, 40vh, 400px)',
                            position: 'relative',
                            backgroundColor: '#f3f4f6'
                        }}>
                            <img
                                src={`http://localhost:8000${product.image_url}`}
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    )}

                    {/* Product Details */}
                    <div style={{
                        padding: 'clamp(20px, 5vw, 40px)'
                    }}>
                        <h1 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                            color: '#1f2937',
                            marginBottom: 'clamp(15px, 3vw, 20px)',
                            fontWeight: 700,
                            lineHeight: '1.2'
                        }}>
                            {product.name}
                        </h1>
                        
                        <p style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                            color: '#6b7280',
                            marginBottom: 'clamp(20px, 4vw, 30px)',
                            lineHeight: '1.6'
                        }}>
                            {product.description}
                        </p>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'clamp(12px, 2.5vw, 16px)',
                            marginBottom: 'clamp(25px, 5vw, 40px)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(8px, 2vw, 12px)'
                            }}>
                                <span style={{
                                    fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                                    fontWeight: 700,
                                    color: '#3182ce'
                                }}>
                                    ${product.price}
                                </span>
                            </div>
                            
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'clamp(8px, 2vw, 12px)'
                            }}>
                                <span style={{
                                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                                    fontWeight: 600,
                                    color: product.stock > 0 ? '#16a34a' : '#dc2626'
                                }}>
                                    {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'clamp(12px, 2.5vw, 16px)',
                            alignItems: 'stretch'
                        }}>
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    handleAddToCart(product);
                                }}
                                style={{
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
                                Add to Cart
                            </button>
                            
                            <Link 
                                to="/" 
                                style={{
                                    background: 'transparent',
                                    color: '#3182ce',
                                    border: '2px solid #3182ce',
                                    borderRadius: '8px',
                                    padding: 'clamp(12px, 3vw, 16px)',
                                    fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    textAlign: 'center',
                                    transition: 'background-color 0.2s, color 0.2s',
                                    display: 'block'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#3182ce';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#3182ce';
                                }}
                            >
                                ⬅ Back to Products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
