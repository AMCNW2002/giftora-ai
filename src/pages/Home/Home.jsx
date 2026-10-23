import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Cake,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Gift,
  Gem,
  Heart,
  PackageCheck,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { Button } from '../../components/Button/Button';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { products } from '../../data/products';
import { useCart } from '../../context/CartContext';
import heroImageOne from '../../assets/hero1.jpeg';
import heroImageTwo from '../../assets/hero2.jpeg';
import heroImageThree from '../../assets/hero3.jpeg';
import heroImageFour from '../../assets/hero4.jpeg';
import middleph from '../../assets/midle.jpeg';
import bottomimg from '../../assets/bottomimg.jpeg';
import './Home.css';

const HERO_SLIDE_INTERVAL_MS = 8000;
const heroImages = [heroImageOne, heroImageTwo, heroImageThree,heroImageFour];

const giftCategories = [
  { id: 'personalized', title: 'Personalised Gifts', imageId: 7, icon: Heart },
  { id: 'hampers', title: 'Hampers & Gift Boxes', imageId: 3, icon: Gift },
  { id: 'flowers', title: 'Flowers & Botanicals', imageId: 6, icon: Flower2 },
  { id: 'jewelry', title: 'Jewellery & Keepsakes', imageId: 4, icon: Gem },
  { id: 'tech', title: 'Thoughtful Tech', imageId: 11, icon: Sparkles },
];

const occasions = [
  { id: 'birthday', title: 'Birthdays', imageId: 10, icon: Cake },
  { id: 'anniversary', title: 'Anniversaries', imageId: 1, icon: Heart },
  { id: 'wedding', title: 'Weddings', imageId: 6, icon: Flower2 },
  { id: 'holiday', title: 'Thank You & More', imageId: 12, icon: PartyPopper },
];

const recipientCategories = {
  partner: ['flowers', 'jewelry', 'personalized'],
  friend: ['hampers', 'tech', 'personalized'],
  parent: ['hampers', 'flowers', 'personalized'],
  colleague: ['tech', 'hampers', 'personalized'],
};

const occasionCategories = {
  birthday: ['hampers', 'personalized', 'flowers'],
  anniversary: ['flowers', 'jewelry', 'personalized'],
  wedding: ['flowers', 'hampers', 'jewelry'],
  holiday: ['hampers', 'personalized', 'tech'],
};

const getGift = (id) => products.find((product) => product.id === id);

export function Home() {
  const { addToCart } = useCart();
  const finderRef = useRef(null);

  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [finderRecipient, setFinderRecipient] = useState('partner');
  const [finderOccasion, setFinderOccasion] = useState('birthday');
  const [finderBudget, setFinderBudget] = useState(60);
  const [finderInterest, setFinderInterest] = useState('');
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [addedAiItem, setAddedAiItem] = useState(false);

  const featuredGifts = products
    .filter((product) => product.tag === 'Bestseller')
    .slice(0, 4);

  const heroGift = getGift(1);
  const boxGift = getGift(3);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveHeroSlide(
        (currentSlide) => (currentSlide + 1) % heroImages.length
      );
    }, HERO_SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleAIFinderSubmit = (event) => {
    event.preventDefault();

    setIsSearchingAI(true);
    setAiSuggestion(null);
    setAddedAiItem(false);

    window.setTimeout(() => {
      const preferredCategories = new Set([
        ...(recipientCategories[finderRecipient] || []),
        ...(occasionCategories[finderOccasion] || []),
      ]);

      const interest = finderInterest.trim().toLowerCase();

      const withinBudget = products.filter(
        (product) => product.price <= Number(finderBudget) + 15
      );

      const candidates = withinBudget.length ? withinBudget : [...products];

      const rankedCandidates = [...candidates].sort((first, second) => {
        const score = (product) => {
          const categoryScore = preferredCategories.has(product.category)
            ? 3
            : 0;

          const interestScore =
            interest &&
            `${product.name} ${product.description} ${product.category}`
              .toLowerCase()
              .includes(interest)
              ? 5
              : 0;

          const budgetScore =
            product.price <= Number(finderBudget) ? 2 : 0;

          return (
            categoryScore +
            interestScore +
            budgetScore +
            product.rating / 10
          );
        };

        return score(second) - score(first);
      });

      setAiSuggestion(rankedCandidates[0] || null);
      setIsSearchingAI(false);
    }, 450);
  };

  const handleAddAiSuggestion = () => {
    if (!aiSuggestion) return;

    addToCart(aiSuggestion, 1);
    setAddedAiItem(true);

    window.setTimeout(() => setAddedAiItem(false), 1500);
  };

  const chooseOccasion = (occasion) => {
    setFinderOccasion(occasion);
    finderRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="giftora-home">
      <section className="giftora-hero">
  {/* background slider */}
  <div className="giftora-hero__bg" aria-label="Featured gifts">
    {heroImages.map((image, index) => (
      <img
        key={image}
        className={`giftora-hero__bg-image ${
          activeHeroSlide === index ? 'giftora-hero__bg-image--active' : ''
        }`}
        src={image}
        alt={`Giftora featured gift ${index + 1}`}
        aria-hidden={activeHeroSlide !== index}
        fetchPriority={index === 0 ? 'high' : 'auto'}
      />
    ))}
    <div className="giftora-hero__bg-overlay" />
  </div>

  {/* ---- left → middle white fade layer ---- */}
  <div className="giftora-hero__fade" aria-hidden="true" />

  {/* ---- content ---- */}
  <div className="app-container giftora-hero__inner">
    <div className="giftora-hero__content">
      <span className="giftora-home__eyebrow">
        Gifts for the moments that matter
      </span>

      <h1 className="giftora-hero__title">
        Make every gift <em>unforgettable.</em>
      </h1>

      <p className="giftora-hero__subtitle">
        Thoughtfully chosen gifts with a personal touch. Find a little
        something lovely for every person, milestone and moment.
      </p>

      <div className="giftora-hero__actions">
        <Link to="/shop">
          <Button variant="primary" size="lg" icon={<ArrowRight size={16} />}>
            Explore gifts
          </Button>
        </Link>

        <Link to="/gift-box">
          <Button variant="outline" size="lg" icon={<Gift size={16} />}>
            Create your gift box
          </Button>
        </Link>
      </div>

      <div className="giftora-hero__note">
        <Gift size={14} fill="currentColor" />
        <span>
          Beautifully considered. Thoughtfully wrapped. Ready to delight.
        </span>
      </div>
    </div>

    <Link
      to={`/product/${heroGift.id}`}
      className="giftora-hero__product-note"
    >
      <span className="giftora-hero__product-note-icon">
        <Gift size={16} />
      </span>
      <span>
        <small>A thoughtful favourite</small>
        <strong>{heroGift.name}</strong>
      </span>
      <ArrowRight size={16} />
    </Link>
  </div>

  {/* slider controls */}
  <div className="giftora-hero__slider-controls">
    {/* ...same as before... */}
  </div>
</section>

      <section className="giftora-benefits" aria-label="Giftora services">
        <div className="app-container giftora-benefits__grid">
          <div className="giftora-benefit">
            <span><Heart size={18} /></span>
            <div>
              <strong>Thoughtful picks</strong>
              <small>Chosen with care</small>
            </div>
          </div>

          <div className="giftora-benefit">
            <span><Sparkles size={18} /></span>
            <div>
              <strong>Make it personal</strong>
              <small>Add a heartfelt touch</small>
            </div>
          </div>

          <div className="giftora-benefit">
            <span><PackageCheck size={18} /></span>
            <div>
              <strong>Gift-ready details</strong>
              <small>Beautifully presented</small>
            </div>
          </div>

          <div className="giftora-benefit">
            <span><Truck size={18} /></span>
            <div>
              <strong>Worldwide delivery</strong>
              <small>Free over $80</small>
            </div>
          </div>

          <div className="giftora-benefit">
            <span><ShieldCheck size={18} /></span>
            <div>
              <strong>Shop with confidence</strong>
              <small>Care at every step</small>
            </div>
          </div>
        </div>
      </section>

      <section
        className="giftora-home-section giftora-categories"
        id="giftora-categories"
      >
        <div className="app-container">
          <div className="giftora-section-heading">
            <div>
              <span className="giftora-home__eyebrow">
                A little inspiration
              </span>
              <h2>Gifts worth giving</h2>
            </div>

            <Link to="/shop" className="giftora-text-link">
              View all gifts <ArrowRight size={15} />
            </Link>
          </div>

          <div className="giftora-categories__grid">
            {giftCategories.map((category) => {
              const categoryGift = getGift(category.imageId);
              const CategoryIcon = category.icon;

              return (
                <Link
                  className="giftora-category-card"
                  key={category.id}
                  to={`/shop?category=${category.id}`}
                >
                  <img
                    src={categoryGift.image}
                    alt=""
                    loading="lazy"
                  />

                  <span className="giftora-category-card__icon">
                    <CategoryIcon size={15} />
                  </span>

                  <span className="giftora-category-card__title">
                    {category.title}
                    <ArrowRight size={14} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section
        className="giftora-home-section giftora-bestsellers"
        id="giftora-bestsellers"
      >
        <div className="app-container">
          <div className="giftora-section-heading">
            <div>
              <span className="giftora-home__eyebrow">
                Our most loved
              </span>
              <h2>Bestselling gifts</h2>
            </div>

            <Link to="/shop" className="giftora-text-link">
              Shop all products <ArrowRight size={15} />
            </Link>
          </div>

          <div className="giftora-featured__grid">
            {featuredGifts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section
        className="giftora-box-feature"
        id="giftora-personalise"
      >
        <div className="giftora-box-feature__image">
          <img
            src={boxGift.image}
            alt={boxGift.name}
            loading="lazy"
          />

          <span className="giftora-box-feature__image-caption">
            <Sparkles size={14} /> A gift that feels like you
          </span>
        </div>

        <div className="giftora-box-feature__content">
          <span className="giftora-home__eyebrow">
            The personal touch
          </span>

          <h2>A gift box as unique as they are.</h2>

          <p>
            Bring their favourite things together in one lovely box. Choose the
            gifts, set your budget and add a personal message.
          </p>

          <ul className="giftora-box-feature__steps">
            <li>
              <span><Gift size={15} /></span>
              Choose gifts they will love
            </li>
            <li>
              <span><Heart size={15} /></span>
              Add a personal note
            </li>
            <li>
              <span><PackageCheck size={15} /></span>
              Finish with a thoughtful presentation
            </li>
          </ul>

          <Link to="/gift-box">
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={16} />}
            >
              Build your own box
            </Button>
          </Link>
        </div>
      </section>

      <section
        className="giftora-home-section giftora-occasions"
        id="giftora-occasions"
      >
        <div className="app-container">
          <div className="giftora-section-heading">
            <div>
              <span className="giftora-home__eyebrow">
                Shop by occasion
              </span>
              <h2>Gifts for every special moment</h2>
            </div>

            <Link to="/shop" className="giftora-text-link">
              Explore the collection <ArrowRight size={15} />
            </Link>
          </div>

          <div className="giftora-occasions__grid">
            {occasions.map((occasion) => {
              const occasionGift = getGift(occasion.imageId);
              const OccasionIcon = occasion.icon;

              return (
                <button
                  className="giftora-occasion-card"
                  key={occasion.id}
                  type="button"
                  onClick={() => chooseOccasion(occasion.id)}
                  aria-label={`Find a gift for ${occasion.title}`}
                >
                  <span className="giftora-occasion-card__image">
                    <img
                      src={occasionGift.image}
                      alt=""
                      loading="lazy"
                    />
                    <span><OccasionIcon size={17} /></span>
                  </span>

                  <span className="giftora-occasion-card__title">
                    {occasion.title}
                    <ArrowRight size={14} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="giftora-story">
        <div className="giftora-story__image">
          <img
            src={middleph}
            alt="A carefully chosen gift, ready to be shared"
            loading="lazy"
          />
        </div>

        <div className="giftora-story__content">
          <span className="giftora-home__eyebrow">
            A more personal way to give
          </span>

          <h2>It’s not just a gift. It’s how you make them feel.</h2>

          <p>
            Browse a considered collection, find a little inspiration or create
            a gift box that tells your story. Giftora makes the thoughtful
            part feel simple.
          </p>

          <Link to="/shop" className="giftora-text-link">
            Find something meaningful <ArrowRight size={15} />
          </Link>

          <span
            className="giftora-story__decoration"
            aria-hidden="true"
          >
            <Flower2 size={74} />
          </span>
        </div>
      </section>

      <section
        className="giftora-finder"
        id="giftora-finder"
        ref={finderRef}
      >
        <div className="app-container">
          <div className="giftora-finder__card">
            <div className="giftora-finder__intro">
              <div
                className="giftora-finder__image-background"
                style={{ backgroundImage: `url(${bottomimg})` }}
              >
                <div className="giftora-finder__image-overlay">
                  <div className="giftora-finder__image-copy">
                    <h2>
                      Let’s find their <span>perfect gift.</span>
                    </h2>
                    <p>
                      Tell us who it’s for and what you have in mind. We’ll find
                      a lovely place to start.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleAIFinderSubmit}
              className="giftora-finder__form"
            >
              <div className="giftora-finder__field">
                <label htmlFor="finder-recipient">Who is it for?</label>

                <select
                  id="finder-recipient"
                  value={finderRecipient}
                  onChange={(event) =>
                    setFinderRecipient(event.target.value)
                  }
                >
                  <option value="partner">Partner / Spouse</option>
                  <option value="friend">Best Friend</option>
                  <option value="parent">Parent / Family</option>
                  <option value="colleague">Colleague / Client</option>
                </select>
              </div>

              <div className="giftora-finder__field">
                <label htmlFor="finder-occasion">The occasion</label>

                <select
                  id="finder-occasion"
                  value={finderOccasion}
                  onChange={(event) =>
                    setFinderOccasion(event.target.value)
                  }
                >
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="wedding">Wedding</option>
                  <option value="holiday">Thank You / Holiday</option>
                </select>
              </div>

              <div className="giftora-finder__field">
                <label htmlFor="finder-budget">Your budget ($)</label>

                <input
                  id="finder-budget"
                  type="number"
                  min="20"
                  max="500"
                  value={finderBudget}
                  onChange={(event) =>
                    setFinderBudget(event.target.value)
                  }
                  required
                />
              </div>

              <div className="giftora-finder__field giftora-finder__field--interest">
                <label htmlFor="finder-interest">
                  Something they love
                </label>

                <input
                  id="finder-interest"
                  type="text"
                  value={finderInterest}
                  onChange={(event) =>
                    setFinderInterest(event.target.value)
                  }
                  placeholder="Flowers, chocolate, cosy evenings..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSearchingAI}
                icon={<Sparkles size={16} />}
              >
                {isSearchingAI ? 'Finding a match…' : 'Find a gift'}
              </Button>
            </form>

            {aiSuggestion && (
              <div
                className="giftora-finder__result"
                aria-live="polite"
              >
                <img
                  src={aiSuggestion.image}
                  alt={aiSuggestion.name}
                />

                <div className="giftora-finder__result-copy">
                  <span className="giftora-home__eyebrow">
                    <Sparkles size={13} />
                    A lovely match for your {finderOccasion}
                  </span>

                  <h3>{aiSuggestion.name}</h3>
                  <p>{aiSuggestion.description}</p>

                  <strong>
                    ${Number(aiSuggestion.price).toFixed(2)}
                  </strong>
                </div>

                <div className="giftora-finder__result-actions">
                  <button
                    type="button"
                    onClick={handleAddAiSuggestion}
                  >
                    {addedAiItem ? (
                      <>
                        <CheckCircle2 size={15} /> Added
                      </>
                    ) : (
                      <>
                        <Gift size={15} /> Add to bag
                      </>
                    )}
                  </button>

                  <Link to={`/product/${aiSuggestion.id}`}>
                    View gift <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;