import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Gift,
  ArrowRight,
  Star,
  Truck,
  HeartHandshake,
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './Home.css';

export function Home() {
  const { addToCart } = useCart();

  // AI Gift Finder State
  const [finderRecipient, setFinderRecipient] = useState('partner');
  const [finderOccasion, setFinderOccasion] = useState('birthday');
  const [finderBudget, setFinderBudget] = useState(60);
  const [finderInterest, setFinderInterest] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [addedAiItem, setAddedAiItem] = useState(false);

  // Filter 4 featured products
  const featuredGifts = products.filter((p) => p.tag === 'Bestseller').slice(0, 4);

  // Handle AI Gift Finder Mini Form
  const handleAIFinderSubmit = (e) => {
    e.preventDefault();
    setIsSearchingAI(true);
    setAiSuggestion(null);
    setAddedAiItem(false);

    setTimeout(() => {
      // Find matching items within or closest to budget
      const affinity = {
        partner: ['flowers', 'jewelry', 'personalized'],
        friend: ['hampers', 'tech', 'personalized'],
        parent: ['hampers', 'flowers', 'personalized'],
        colleague: ['tech', 'hampers', 'personalized']
      };
      const allowedCategories = affinity[finderRecipient] || ['personalized'];

      let candidates = products.filter(
        (p) => allowedCategories.includes(p.category) && p.price <= Number(finderBudget) + 15
      );

      if (candidates.length === 0) {
        candidates = products.filter((p) => p.price <= Number(finderBudget) + 25);
      }
      if (candidates.length === 0) {
        candidates = products;
      }

      // Pick top rated candidate
      candidates.sort((a, b) => b.rating - a.rating);
      const match = candidates[0];

      setAiSuggestion(match);
      setIsSearchingAI(false);
    }, 850);
  };

  const handleAddAiSuggestion = () => {
    if (aiSuggestion) {
      addToCart(aiSuggestion, 1);
      setAddedAiItem(true);
      setTimeout(() => setAddedAiItem(false), 1500);
    }
  };

  return (
    <div className="giftora-home">
      {/* 1. HERO SECTION */}
      <section className="giftora-hero">
        <div className="giftora-hero__bg-blob giftora-hero__bg-blob--1" />
        <div className="giftora-hero__bg-blob giftora-hero__bg-blob--2" />

        <div className="app-container giftora-hero__grid">
          {/* Left Text Column */}
          <div className="giftora-hero__content">
            <div className="section-eyebrow">
              <Sparkles size={14} /> AI-Powered Personalized Gifting
            </div>
            <h1 className="giftora-hero__title">
              Thoughtful Gifts, Curated with{' '}
              <span className="text-highlight-rose">Heart</span> &{' '}
              <span className="text-highlight-gold">AI</span>
            </h1>
            <p className="giftora-hero__subtitle">
              Say goodbye to gift guesswork. From single bespoke keepsakes to full custom gift
              boxes tailored to their personality and your exact budget.
            </p>

            <div className="giftora-hero__actions">
              <Link to="/shop">
                <Button variant="primary" size="lg" icon={<Sparkles size={18} />}>
                  Explore Gifts
                </Button>
              </Link>
              <Link to="/gift-box">
                <Button variant="outline" size="lg" icon={<Gift size={18} />}>
                  Build a Gift Box
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="giftora-hero__trust">
              <div className="giftora-hero__trust-item">
                <div className="giftora-hero__trust-stars">
                  <Star size={15} fill="#F4A261" color="#F4A261" />
                  <strong>4.9 / 5</strong>
                </div>
                <span>Over 12,000+ Happy Moments</span>
              </div>
              <div className="giftora-hero__trust-divider" />
              <div className="giftora-hero__trust-item">
                <Truck size={17} color="var(--primary)" />
                <span>Express Worldwide Shipping</span>
              </div>
              <div className="giftora-hero__trust-divider" />
              <div className="giftora-hero__trust-item">
                <HeartHandshake size={17} color="var(--accent)" />
                <span>Hand-Personalized with Care</span>
              </div>
            </div>
          </div>

          {/* Right Floating Visuals Column */}
          <div className="giftora-hero__visuals">
            <div className="giftora-hero__cards-wrap">
              {/* Floating Card 1 */}
              <div className="giftora-hero__floating-card giftora-hero__floating-card--1 animate-float">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80"
                  alt="Preserved Rose Keepsake"
                />
                <div className="giftora-hero__floating-card-info">
                  <h4>Eternal Rose Keepsake</h4>
                  <div className="giftora-hero__floating-card-meta">
                    <span className="giftora-hero__floating-card-price">$42.00</span>
                    <span className="giftora-hero__floating-card-tag">Bestseller</span>
                  </div>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="giftora-hero__floating-card giftora-hero__floating-card--2 animate-float-slow">
                <img
                  src="https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80"
                  alt="Artisanal Chocolate Hamper"
                />
                <div className="giftora-hero__floating-card-info">
                  <h4>Artisanal Truffle Hamper</h4>
                  <div className="giftora-hero__floating-card-meta">
                    <span className="giftora-hero__floating-card-price">$64.00</span>
                    <span className="giftora-hero__floating-card-tag">Luxe Pack</span>
                  </div>
                </div>
              </div>

              {/* Floating AI Matched Badge */}
              <div className="giftora-hero__ai-badge animate-float">
                <div className="giftora-hero__ai-badge-icon">
                  <Sparkles size={16} />
                </div>
                <div>
                  <strong>AI Match: 98%</strong>
                  <span>Personalized for Anniversary</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPS */}
      <section className="giftora-values">
        <div className="app-container">
          <div className="giftora-values__grid">
            <div className="giftora-values__card">
              <div className="giftora-values__icon giftora-values__icon--rose">
                <Truck size={26} />
              </div>
              <h3>Worldwide Express</h3>
              <p>
                Fast, insured delivery straight to their doorstep with real-time tracking and free
                shipping over $80.
              </p>
            </div>

            <div className="giftora-values__card">
              <div className="giftora-values__icon giftora-values__icon--gold">
                <Gift size={26} />
              </div>
              <h3>Hand-Personalized</h3>
              <p>
                Custom calligraphy gift notes, wax seal stamping, and velvet ribbons hand-tied by
                our artisan team.
              </p>
            </div>

            <div className="giftora-values__card">
              <div className="giftora-values__icon giftora-values__icon--navy">
                <ShieldCheck size={26} />
              </div>
              <h3>Secure Checkout</h3>
              <p>
                End-to-end encrypted payments with a 100% Delight Guarantee on every single
                curated gift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="giftora-featured">
        <div className="app-container">
          <div className="giftora-section-header">
            <div>
              <div className="section-eyebrow">
                <Sparkles size={14} /> Most Loved Curations
              </div>
              <h2>Featured Gift Inspirations</h2>
            </div>
            <Link to="/shop">
              <Button variant="outline" size="md" icon={<ArrowRight size={16} />}>
                View all gifts
              </Button>
            </Link>
          </div>

          <div className="giftora-featured__grid">
            {featuredGifts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. AI GIFT FINDER MINI-PANEL */}
      <section className="giftora-finder">
        <div className="app-container">
          <div className="giftora-finder__card">
            <div className="giftora-finder__header">
              <div className="section-eyebrow">
                <Sparkles size={14} /> Smart Recommendations
              </div>
              <h2>AI Gift Matcher</h2>
              <p>
                Need a quick match without browsing? Tell our AI who you are celebrating, and get
                an instant bespoke gift recommendation.
              </p>
            </div>

            <form onSubmit={handleAIFinderSubmit} className="giftora-finder__form">
              <div className="giftora-finder__field">
                <label htmlFor="finder-recipient">Recipient</label>
                <select
                  id="finder-recipient"
                  value={finderRecipient}
                  onChange={(e) => setFinderRecipient(e.target.value)}
                >
                  <option value="partner">Partner / Spouse</option>
                  <option value="friend">Best Friend</option>
                  <option value="parent">Parent / Family</option>
                  <option value="colleague">Colleague / Client</option>
                </select>
              </div>

              <div className="giftora-finder__field">
                <label htmlFor="finder-occasion">Occasion</label>
                <select
                  id="finder-occasion"
                  value={finderOccasion}
                  onChange={(e) => setFinderOccasion(e.target.value)}
                >
                  <option value="birthday">Birthday Celebration</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="wedding">Wedding / Romance</option>
                  <option value="holiday">Holiday / Thank You</option>
                </select>
              </div>

              <div className="giftora-finder__field">
                <label htmlFor="finder-budget">Budget ($)</label>
                <input
                  id="finder-budget"
                  type="number"
                  min="20"
                  max="500"
                  value={finderBudget}
                  onChange={(e) => setFinderBudget(e.target.value)}
                  placeholder="e.g. 75"
                  required
                />
              </div>

              <div className="giftora-finder__field giftora-finder__field--wide">
                <label htmlFor="finder-interest">Interests / Vibe</label>
                <input
                  id="finder-interest"
                  type="text"
                  value={finderInterest}
                  onChange={(e) => setFinderInterest(e.target.value)}
                  placeholder="e.g. flowers, chocolate, cozy spa, coffee"
                />
              </div>

              <div className="giftora-finder__btn-wrap">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSearchingAI}
                  icon={isSearchingAI ? <div className="animate-spin" style={{ display: 'inline-block' }}>✨</div> : <Sparkles size={18} />}
                >
                  {isSearchingAI ? 'Finding Match...' : 'Find Perfect Gift'}
                </Button>
              </div>
            </form>

            {/* AI Suggestion Output Drawer */}
            {aiSuggestion && (
              <div className="giftora-finder__result animate-fade-up">
                <div className="giftora-finder__result-tag">
                  <Sparkles size={14} /> AI Recommendation for your {finderOccasion}
                </div>
                <div className="giftora-finder__result-body">
                  <img
                    src={aiSuggestion.image}
                    alt={aiSuggestion.name}
                    className="giftora-finder__result-img"
                  />
                  <div className="giftora-finder__result-info">
                    <span className="giftora-finder__result-cat">{aiSuggestion.category}</span>
                    <h3>{aiSuggestion.name}</h3>
                    <p>{aiSuggestion.description}</p>
                    <div className="giftora-finder__result-pricing">
                      <span className="giftora-finder__result-price">
                        ${Number(aiSuggestion.price).toFixed(2)}
                      </span>
                      <span className="giftora-finder__result-rating">
                        ★ {Number(aiSuggestion.rating).toFixed(1)} rating
                      </span>
                    </div>
                  </div>
                  <div className="giftora-finder__result-actions">
                    <button
                      type="button"
                      className="giftora-finder__add-btn"
                      onClick={handleAddAiSuggestion}
                    >
                      {addedAiItem ? (
                        <>
                          <CheckCircle2 size={16} /> Added to Cart!
                        </>
                      ) : (
                        <>
                          <Gift size={16} /> Add to Cart
                        </>
                      )}
                    </button>
                    <Link to={`/product/${aiSuggestion.id}`} className="giftora-finder__view-link">
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER */}
      <section className="giftora-cta">
        <div className="app-container">
          <div className="giftora-cta__card">
            <div className="giftora-cta__content">
              <span className="giftora-cta__badge">The Ultimate Experience</span>
              <h2>Craft a Bespoke Gift Box in Seconds</h2>
              <p>
                Use our AI Gift Box Builder to pick ribbon styles, set your exact budget, and let our
                algorithm curate the ideal mix of keepsakes, flowers, and sweet treats.
              </p>
              <Link to="/gift-box">
                <Button variant="primary" size="lg" icon={<Gift size={20} />}>
                  Build Your Own Gift Box
                </Button>
              </Link>
            </div>
            <div className="giftora-cta__decor">
              <div className="giftora-cta__circle" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
