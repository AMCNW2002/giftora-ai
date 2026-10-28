import { products } from '../data/products';

/**
 * Giftora AI API Service (Frontend Stub)
 * -------------------------------------------------------------
 * All methods return Promises mimicking async server latency.
 * When integrating with a real backend, simply replace the mock
 * logic with real `fetch(...)` or `axios(...)` calls as commented below.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const parseJson = async (response) => {
  try {
    return await response.json();
  } catch (error) {
    return {};
  }
};

const handleJsonRequest = async (endpoint, options = {}, fallback) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    const data = await parseJson(response);

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    if (fallback) {
      return fallback();
    }
    throw error;
  }
};

export const api = {
  /**
   * Fetch all products
   * Real backend swap: return fetch('/api/products').then(res => res.json())
   */
  getProducts: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...products]);
      }, 200);
    });
  },

  /**
   * Fetch single product by numeric or string ID
   * Real backend swap: return fetch(`/api/products/${id}`).then(res => res.json())
   */
  getProduct: (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = products.find((p) => p.id === Number(id));
        if (item) {
          resolve({ ...item });
        } else {
          reject(new Error(`Product #${id} not found`));
        }
      }, 150);
    });
  },

  /**
   * AI Gift Box Suggestion Algorithm (Simulated Server Endpoint)
   * Real backend swap: return fetch('/api/gift-box/suggest', { method: 'POST', body: JSON.stringify(payload) })
   */
  suggestGiftBox: ({ recipient = 'partner', occasion = 'birthday', budget = 100, interests = '' }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Recipient affinity table for weighting
        const affinityMap = {
          partner: ['jewelry', 'flowers', 'personalized'],
          friend: ['hampers', 'personalized', 'tech'],
          parent: ['hampers', 'personalized', 'flowers'],
          colleague: ['tech', 'hampers', 'personalized']
        };

        const preferredCategories = affinityMap[recipient] || ['personalized', 'hampers'];

        // Score products based on category affinity, rating, and keyword match in interests
        const scored = products.map((item) => {
          let score = item.rating; // base score (e.g. 4.5 - 4.9)
          if (preferredCategories.includes(item.category)) {
            score += 3.0; // affinity bonus
          }
          if (interests && item.description.toLowerCase().includes(interests.toLowerCase())) {
            score += 2.0; // interest keyword bonus
          }
          return { item, score };
        });

        // Sort descending by score
        scored.sort((a, b) => b.score - a.score);

        // Greedy knapsack within budget (up to 5 items)
        let spent = 0;
        const picked = [];

        for (const { item } of scored) {
          if (picked.length >= 5) break;
          if (spent + item.price <= budget) {
            picked.push({ ...item, qty: 1 });
            spent += item.price;
          }
        }

        resolve({
          items: picked,
          totalSpent: spent,
          remaining: Math.max(0, budget - spent)
        });
      }, 850);
    });
  },

  /**
   * AI Assistant Chat Bot Stub
   * Real backend swap: return fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: msg }) })
   */
  chat: (msg) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lower = (msg || '').toLowerCase();
        let reply = "I'm your Giftora Concierge! I can recommend handpicked gifts, help you build a custom gift box within your budget, or answer order questions.";

        if (lower.includes('ship') || lower.includes('delivery')) {
          reply = "🚚 We offer complimentary express delivery on orders over Rs. 80! Standard orders arrive in 2–4 business days with custom gift-wrapping included.";
        } else if (lower.includes('order') || lower.includes('track') || lower.includes('status')) {
          reply = "📦 Every Giftora order comes with live SMS tracking and a personalized wax-sealed gift message. You can manage your bag anytime in your Cart!";
        } else if (lower.includes('box') || lower.includes('build') || lower.includes('budget')) {
          reply = "🎁 Check out our 'Gift Box' builder in the top navigation! Just choose your recipient and budget, and our AI will curate an exquisite, ready-to-ship box in seconds.";
        } else if (lower.includes('birthday') || lower.includes('anniversary') || lower.includes('partner')) {
          reply = "✨ For romantic moments or birthdays, our Eternal Rose Keepsake (Rs. 42) paired with a Custom Star Map Night Light (Rs. 36) is our most loved duo!";
        } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
          reply = "Warm greetings! 🌸 Who are you shopping for today? Tell me their interests or your budget, and I'll find something wonderful.";
        }

        resolve({ reply });
      }, 700);
    });
  },

  /**
   * User Authentication
   * Backend-ready implementation that sends login/register payloads to the API.
   */
  login: async ({ email, name, password, isRegisterMode = false }) => {
    const userData = {
      email: email || 'user@example.com',
      name: name || (email ? email.split('@')[0] : 'Giftora Guest'),
      password: password || 'demo-password'
    };

    if (isRegisterMode) {
      return handleJsonRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }, () => ({
        user: {
          email: userData.email,
          name: userData.name,
          memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        },
        token: 'demo-jwt-token-giftora'
      }));
    }

    return handleJsonRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: userData.email, password: userData.password })
    }, () => ({
      user: {
        email: userData.email,
        name: userData.name,
        memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      },
      token: 'demo-jwt-token-giftora'
    }));
  }
};
