import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, Calendar, DollarSign } from 'lucide-react';
import './Orders.css';

// IMPORTANTE: Agregar esta línea
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      // CAMBIO: Usar API_URL
      const response = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-container">
        <div className="loading">Cargando órdenes...</div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <header className="orders-header">
        <Link to="/" className="back-btn">
          <ArrowLeft size={24} />
        </Link>
        <h1>Mis Pedidos</h1>
        <div style={{ width: '24px' }}></div>
      </header>

      <div className="orders-content">
        {orders.length === 0 ? (
          <div className="no-orders">
            <Package size={80} className="empty-icon" />
            <h2>No tienes pedidos</h2>
            <p>Tus compras aparecerán aquí</p>
            <Link to="/" className="btn-shop">
              Ir a Comprar
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Pedido #{order._id.slice(-8)}</h3>
                    <div className="order-meta">
                      <span className="meta-item">
                        <Calendar size={14} />
                        {formatDate(order.createdAt)}
                      </span>
                      <span className="meta-item">
                        <DollarSign size={14} />
                        ${order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className={`status-badge ${order.status}`}>
                    {order.status === 'completed' && 'Completado'}
                    {order.status === 'pending' && 'Pendiente'}
                    {order.status === 'processing' && 'Procesando'}
                    {order.status === 'cancelled' && 'Cancelado'}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      {/* CAMBIO: Usar directamente item.image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/60x60?text=Sin+Imagen';
                        }}
                      />
                      <div className="item-info">
                        <p className="item-name">{item.name}</p>
                        <p className="item-qty">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="item-price">${item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;