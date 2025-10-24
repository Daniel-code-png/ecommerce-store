import React, { useState, useEffect } from 'react';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Search, ShoppingBag, User, LogOut, Package } from 'lucide-react';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { addToCart, getItemCount } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await axios.get(`${API_URL}/api/products`, { params });
      setProducts(response.data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/categories/list`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
      alert(`${product.name} agregado al carrito`);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <ShoppingBag size={28} />
            <span>MiTienda</span>
          </div>
          
          <div className="header-icons">
            <Link to="/orders" className="icon-btn">
              <Package size={24} />
            </Link>
            <Link to="/cart" className="icon-btn cart-icon">
              <ShoppingCart size={24} />
              {getItemCount() > 0 && (
                <span className="cart-badge">{getItemCount()}</span>
              )}
            </Link>
            <div className="user-menu">
              <User size={24} />
              <div className="user-dropdown">
                <div className="user-info">
                  <p>{user?.name}</p>
                  <small>{user?.email}</small>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={18} />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="categories">
          <button
            className={`category-btn ${selectedCategory === '' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      {/* Products Grid */}
      <main className="products-section">
        {loading ? (
          <div className="loading">Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            <p>No se encontraron productos</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x300?text=Sin+Imagen';
                    }}
                  />
                  {product.stock === 0 && (
                    <div className="out-of-stock">Agotado</div>
                  )}
                </div>
                
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-footer">
                    <span className="product-price">${product.price.toLocaleString()}</span>
                    <button
                      className="btn-add-cart"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                    >
                      <ShoppingCart size={18} />
                      Agregar
                    </button>
                  </div>
                  <span className="product-stock">Stock: {product.stock}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;