import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import './Cart.css';

// IMPORTANTE: Agregar esta línea
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const items = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity
      }));

      // CAMBIO: Usar API_URL
      const response = await axios.post(
        `${API_URL}/api/orders`,
        { items },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 1500));

      alert('¡Pago procesado! Tu pedido ha sido confirmado');
      clearCart();
      navigate('/orders');
    } catch (error) {
      alert(error.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <ShoppingBag size={80} className="empty-icon" />
        <h2>Tu carrito está vacío</h2>
        <p>Agrega productos para empezar a comprar</p>
        <Link to="/" className="btn-continue">
          Ver Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <header className="cart-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={24} />
        </Link>
        <h1>Mi Carrito</h1>
        <div style={{ width: '24px' }}></div>
      </header>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              {/* CAMBIO: Usar directamente item.image */}
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x80?text=Sin+Imagen';
                }}
              />
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-price">${item.price.toLocaleString()}</p>
                
                <div className="quantity-controls">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="qty-btn"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="qty-btn"
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div className="item-actions">
                <p className="item-total">${(item.price * item.quantity).toLocaleString()}</p>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="remove-btn"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${getTotal().toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Envío</span>
            <span className="free">Gratis</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${getTotal().toLocaleString()}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="checkout-btn"
            disabled={processing}
          >
            {processing ? 'Procesando...' : 'Procesar Pago'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;