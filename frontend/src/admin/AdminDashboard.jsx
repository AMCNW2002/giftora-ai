import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Gift, Home, Package, ShoppingCart, Users, Settings, Menu, Search,
  LayoutGrid, Boxes, MessageCircle, BarChart3, User, LogOut, ChevronDown,
  Bot, Sparkles, Mail, Wand2, Zap, Star, Receipt, DollarSign, Heart, Gem, Cpu, Globe,
  ArrowRight, TrendingUp,
} from 'lucide-react';
import './AdminDashboard.css';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { api } from '../services/api';

const navItems = [
  { label: 'Dashboard', icon: Home, route: '/admin', active: true },
  { label: 'Products', icon: Package, route: '/admin/products' },
  { label: 'Categories', icon: LayoutGrid, route: '/admin/categories' },
  { label: 'Orders', icon: ShoppingCart, route: '/admin/orders' },
  { label: 'Users', icon: Users, route: '/admin/users' },
  { label: 'Gift Builder', icon: Wand2, route: '/admin/gift-builder' },
  { label: 'Promo Codes', icon: Boxes, route: '/admin/settings' },
  { label: 'Messages', icon: MessageCircle, route: '/admin/messages', badge: 3 },
  { label: 'Analytics', icon: BarChart3, route: '/admin/analytics' },
  { label: 'Settings', icon: Settings, route: '/admin/settings' },
  { label: 'Profile', icon: User, route: '/admin/settings' },
  { label: 'Logout', icon: LogOut },
];

const stats = [
  { label: 'Total Orders', value: '1,248', change: '+12%', icon: ShoppingCart },
  { label: 'Total Users', value: '8,932', change: '+8%', icon: Users },
  { label: 'Total Revenue', value: '$24,780', change: '+15%', icon: DollarSign },
  { label: 'Total Products', value: '356', change: '+5%', icon: Package },
];

const orderStatus = [
  { label: 'Delivered', pct: 52, color: '#22b455' },
  { label: 'Processing', pct: 28, color: '#f5b942' },
  { label: 'Pending', pct: 12, color: '#ef6a5b' },
  { label: 'Cancelled', pct: 8, color: '#bdb5ad' },
];

const dashboardCategories = ['Gift Packs', 'Custom Gifts', 'Personalized Gifts', 'Flowers', 'Luxury Boxes'];

const dashboardOrders = [
  { id: '#ORD-10048', customer: 'John Perera', status: 'Delivered', total: '$85.00', date: 'Oct 30, 2026' },
  { id: '#ORD-10047', customer: 'Dilhani Fernando', status: 'Processing', total: '$120.00', date: 'Oct 30, 2026' },
  { id: '#ORD-10046', customer: 'Kasun Silva', status: 'Pending', total: '$75.00', date: 'Oct 29, 2026' },
];

const aiFeatures = [
  { label: 'AI Chatbot', icon: Bot },
  { label: 'Gift Recommender', icon: Sparkles },
  { label: 'Message Generator', icon: Mail },
  { label: 'Gift Builder', icon: Wand2 },
];

const quickActions = [
  { label: 'Add Product', icon: Package },
  { label: 'Manage Users', icon: Users },
  { label: 'View Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
];

const dashboardUsers = [
  { name: 'Nimesh Perera', email: 'nimesh@gmail.com', date: 'Oct 30, 2026' },
  { name: 'Tharushi Silva', email: 'tharushi@gmail.com', date: 'Oct 29, 2026' },
  { name: 'Sachin Fernando', email: 'sachin@gmail.com', date: 'Oct 28, 2026' },
];

const linePath =
  'M10,180 L45,165 L80,155 L115,150 L150,115 L185,138 L220,130 L255,150 L290,135 L325,100 L360,95 L395,60 L430,70 L465,85 L500,70 L535,95 L570,60';

function Panel({ icon: Icon, title, action, children, className = '' }) {
  return (
    <section className={`g3d-card ${className}`}>
      <header className="g3d-card__head">
        <h3>{Icon && <span className="g3d-chip"><Icon size={16} /></span>}{title}</h3>
        {action && <button type="button" className="g3d-link">{action} <ArrowRight size={13} /></button>}
      </header>
      {children}
    </section>
  );
}

export default function GiftoraDashboard3D() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { products } = useProducts();
  const [orders, setOrders] = useState(dashboardOrders);

  useEffect(() => {
    if (!user) {
      setOrders(dashboardOrders);
      return;
    }

    let active = true;
    api
      .getOrders()
      .then((response) => {
        if (!active) return;
        setOrders(response || []);
      })
      .catch(() => {
        if (!active) return;
        setOrders([]);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const liveProducts = products.length ? products : [];
  const liveOrders = orders.length ? orders : [];
  const liveCategories = liveProducts.length
    ? [...new Set(liveProducts.map((p) => p.category || 'Other'))].slice(0, 5)
    : dashboardCategories;
  const orderCount = liveOrders.length || 1248;
  const revenueTotal = liveOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const statsData = [
    { label: 'Total Orders', value: orderCount.toLocaleString(), change: '+12%', icon: ShoppingCart },
    { label: 'Total Users', value: user ? '1' : '8,932', change: user ? '+1%' : '+8%', icon: Users },
    { label: 'Total Revenue', value: `Rs. ${revenueTotal ? Math.round(revenueTotal).toLocaleString() : '24,780'}`, change: '+15%', icon: DollarSign },
    { label: 'Total Products', value: String(liveProducts.length || 356), change: '+5%', icon: Package },
  ];
  const recentOrders = liveOrders.length
    ? liveOrders.slice(0, 3).map((order) => ({
        id: `#${String(order.id).slice(0, 8).toUpperCase()}`,
        customer: user?.name || 'Customer',
        status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Placed',
        total: `Rs. ${Number(order.total || 0).toLocaleString()}`,
        date: new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      }))
    : dashboardOrders;

  const donut = (() => {
    let acc = 0;
    return orderStatus
      .map((s) => {
        const from = acc;
        acc += s.pct;
        return `${s.color} ${from}% ${acc}%`;
      })
      .join(', ');
  })();

  return (
    <div className="g3d">
      <aside className={`g3d-side ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div className="g3d-brand">
          <div className="g3d-brand__orb"><Gift size={30} /></div>
          <h2>Giftora <em>AI</em></h2>
          <span>Admin Panel</span>
        </div>

        <nav className="g3d-nav">
          {navItems.map(({ label, icon: Icon, active, badge, route }) => (
            <button
              key={label}
              type="button"
              className={`g3d-nav__item ${active ? 'is-active' : ''}`}
              onClick={() => route && navigate(route)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {badge && <b>{badge}</b>}
            </button>
          ))}
        </nav>

        <div className="g3d-side__promo">
          <div className="g3d-side__gift">🎁</div>
          <h4>Giftora <em>AI</em></h4>
          <p>Spread Happiness with AI <Heart size={12} fill="currentColor" /></p>
        </div>
      </aside>

      <main className="g3d-main">
        <header className="g3d-top">
          <button
            type="button"
            className="g3d-btn3d g3d-btn3d--sq g3d-menu-button"
            aria-label="Toggle menu"
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            <Menu size={18} />
          </button>
          <label className="g3d-search">
            <Search size={16} />
            <input placeholder="Search anything..." />
          </label>
          <div className="g3d-top__right">
            <button type="button" className="g3d-btn3d g3d-btn3d--sq g3d-bell" aria-label="Notifications">
              <Bell size={18} /><i>3</i>
            </button>
            <div className="g3d-me">
              <div className="g3d-me__avatar">A</div>
              <div><strong>Admin</strong><small>Super Admin</small></div>
              <ChevronDown size={14} />
            </div>
          </div>
        </header>

        <section className="g3d-hero">
          <div>
            <p>Welcome Back,</p>
            <h1>Admin! <span>👋</span></h1>
            <small>Here's what's happening with your Giftora AI platform today.</small>
          </div>
          <div className="g3d-hero__art">
            <div className="g3d-hero__boxes"><span>🎁</span><span>🎀</span><span>🎁</span></div>
            <div className="g3d-hero__tag"><h2>Giftora <em>AI</em></h2><p>Make Every Gift Special ✨</p></div>
          </div>
        </section>

        <section className="g3d-stats">
          {statsData.map(({ label, value, change, icon: Icon }) => (
            <div key={label} className="g3d-card g3d-stat">
              <div className="g3d-orb"><Icon size={22} /></div>
              <div>
                <span>{label}</span>
                <strong>{value}</strong>
                <em><TrendingUp size={12} /> {change}</em>
              </div>
            </div>
          ))}
        </section>

        <section className="g3d-row g3d-row--chart">
          <Panel icon={BarChart3} title="Sales Overview" action={null}>
            <div className="g3d-range">Last 30 Days <ChevronDown size={13} /></div>
            <div className="g3d-chart">
              <div className="g3d-chart__y"><span>1.5K</span><span>1K</span><span>500</span><span>0</span></div>
              <svg viewBox="0 0 580 210" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="g3dFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(201,122,60,.45)" />
                    <stop offset="100%" stopColor="rgba(201,122,60,.02)" />
                  </linearGradient>
                  <filter id="g3dShadow"><feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#7a3f1d" floodOpacity=".35" /></filter>
                </defs>
                {[0, 1, 2, 3].map((i) => (
                  <line key={i} x1="0" x2="580" y1={20 + i * 55} y2={20 + i * 55} stroke="rgba(92,67,52,.14)" strokeDasharray="4 5" />
                ))}
                <path d={`${linePath} L570,200 L10,200 Z`} fill="url(#g3dFill)" />
                <path d={linePath} fill="none" stroke="#8d4d2e" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#g3dShadow)" />
                <circle cx="395" cy="60" r="7" fill="#fff" stroke="#8d4d2e" strokeWidth="3" />
              </svg>
              <div className="g3d-chart__tip">$1,280</div>
              <div className="g3d-chart__x"><span>Oct 1</span><span>Oct 8</span><span>Oct 15</span><span>Oct 22</span><span>Oct 30</span></div>
            </div>
          </Panel>

          <Panel title="Order Status">
            <div className="g3d-status">
              <div className="g3d-donut" style={{ background: `conic-gradient(${donut})` }}>
                <div><strong>1,248</strong><small>Total Orders</small></div>
              </div>
              <ul>
                {orderStatus.map((s) => (
                  <li key={s.label}>
                    <i style={{ background: s.color }} />
                    <span>{s.label}</span>
                    <b>{s.pct}%</b>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>
        </section>

        <section className="g3d-row g3d-row--two">
          <Panel icon={Star} title="Top Categories" action="View All">
            <div className="g3d-cats">
              {liveCategories.map((c) => (
                <button key={c} type="button" className="g3d-btn3d g3d-cat">{c}</button>
              ))}
            </div>
          </Panel>

          <Panel icon={Receipt} title="Recent Orders" action="View All">
            <ul className="g3d-orders">
              {(recentOrders.length ? recentOrders : orders).map((o) => (
                <li key={o.id}>
                  <div>
                    <strong>{o.id}</strong>
                    <small>{o.customer}</small>
                  </div>
                  <span className={`g3d-pill g3d-pill--${String(o.status).toLowerCase()}`}>{o.status}</span>
                  <div className="g3d-orders__right">
                    <strong>{o.total}</strong>
                    <small>{o.date}</small>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </section>

        <section className="g3d-row g3d-row--two g3d-row--ai">
          <Panel icon={Sparkles} title="AI Features" action="Manage AI Features">
            <div className="g3d-ai">
              {aiFeatures.map(({ label, icon: Icon }) => (
                <div key={label} className="g3d-ai__item">
                  <div className="g3d-orb g3d-orb--soft"><Icon size={22} /></div>
                  <strong>{label}</strong>
                  <span className="g3d-pill g3d-pill--delivered">● Active</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={Zap} title="Quick Actions">
            <div className="g3d-quick">
              {quickActions.map(({ label, icon: Icon }) => (
                <button key={label} type="button" className="g3d-btn3d g3d-btn3d--white">
                  <Icon size={22} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </Panel>
        </section>

        <section className="g3d-row g3d-row--two g3d-row--users">
          <Panel icon={Users} title="Recent Users" action="View All">
            <ul className="g3d-users">
              {dashboardUsers.map((u) => (
                <li key={u.email}>
                  <div className="g3d-me__avatar">{u.name[0]}</div>
                  <div><strong>{u.name}</strong><small>{u.email}</small></div>
                  <span className="g3d-pill g3d-pill--delivered">Active</span>
                  <time>{u.date}</time>
                </li>
              ))}
            </ul>
          </Panel>

          <section className="g3d-banner">
            <div className="g3d-banner__gift">🎁</div>
            <div className="g3d-banner__copy">
              <h2>Giftora <em>AI</em></h2>
              <p>AI-Powered Gift E-commerce Platform</p>
              <button type="button" className="g3d-btn3d g3d-btn3d--gold">Explore More <ArrowRight size={14} /></button>
            </div>
            <ul>
              <li><Gem size={16} /> Smart Gifts</li>
              <li><Cpu size={16} /> AI Powered</li>
              <li><Globe size={16} /> Global Delivery</li>
            </ul>
          </section>
        </section>

        <footer className="g3d-foot">
          <span>© 2026 Giftora AI. All rights reserved.</span>
          <span>Powered by <Heart size={12} fill="#e0463b" color="#e0463b" /> Giftora AI</span>
        </footer>
      </main>
    </div>
  );
}

