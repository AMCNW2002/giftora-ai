import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { GiftBoxProvider } from './context/GiftBoxContext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { AIOrb } from './components/AIOrb/AIOrb';

// Pages
import { Home } from './pages/Home/Home';
import { Shop } from './pages/Shop/Shop';
import { ProductDetails } from './pages/ProductDetails/ProductDetails';
import { Cart } from './pages/Cart/Cart';
import { Login } from './pages/Login/Login';
import { GiftBoxBuilder } from './pages/GiftBoxBuilder/GiftBoxBuilder';
import { NotFound } from './pages/NotFound/NotFound';

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <GiftBoxProvider>
          <div className="giftora-app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/gift-box" element={<GiftBoxBuilder />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
            {/* Floating AI Concierge Orb across all pages */}
            <AIOrb />
          </div>
        </GiftBoxProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
