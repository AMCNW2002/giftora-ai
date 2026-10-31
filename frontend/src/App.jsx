import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider } from './context/CartContext';
import { GiftBoxProvider } from './context/GiftBoxContext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { AIOrb } from './components/AIOrb/AIOrb';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

// Pages
import { Home } from './pages/Home/Home';
import { Shop } from './pages/Shop/Shop';
import { ProductDetails } from './pages/ProductDetails/ProductDetails';
import { Cart } from './pages/Cart/Cart';
import { Login } from './pages/Login/Login';
import { GiftBoxBuilder } from './pages/GiftBoxBuilder/GiftBoxBuilder';
import { NotFound } from './pages/NotFound/NotFound';

function Layout() {
  const { user } = useAuth();
  return (
    <div className="giftora-app">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public: anyone can see the sign in / register page */}
          <Route path="/login" element={<Login />} />

          {/* Registered users only: everything inside ProtectedRoute */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/gift-box" element={<GiftBoxBuilder />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      {/* Floating AI Concierge Orb - only for signed in users (the chat API needs a token) */}
      {user && <AIOrb />}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
            <GiftBoxProvider>
              <Layout />
            </GiftBoxProvider>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
