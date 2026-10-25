"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Gift,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Check,
  Tag,
  Star,
  Flame,
  ArrowRight,
  Shield,
  Heart,
} from "lucide-react";

interface GiftItem {
  id: string;
  title: string;
  category: "under-25" | "under-50" | "white-elephant" | "black-santa" | "navidad" | "workplace";
  price: string;
  rating: number;
  badge?: string;
  description: string;
  icon: string;
  searchQuery: string; // Used to build Amazon search URL with user's affiliate tag
}

const AMAZON_TAG = "thesantaci0b-20";

const GIFT_ITEMS: GiftItem[] = [
  // UNDER $25
  {
    id: "g1",
    title: "Stanley Quencher Style 30oz Tumbler",
    category: "under-25",
    price: "$22.99",
    rating: 4.8,
    badge: "🔥 Most Stolen",
    description: "Vacuum-insulated double wall stainless steel tumbler with straw. Keeps ice cold for 24+ hours.",
    icon: "🥤",
    searchQuery: "insulated tumbler with handle straw stainless steel",
  },
  {
    id: "g2",
    title: "Gourmet Hot Sauce Challenge Box (Set of 6)",
    category: "under-25",
    price: "$19.99",
    rating: 4.7,
    badge: "Crowd Favorite",
    description: "From sweet habanero to smoky ghost pepper. Perfect for foodies and spicy food lovers.",
    icon: "🌶️",
    searchQuery: "gourmet hot sauce gift set sampler",
  },
  {
    id: "g3",
    title: "Anker Portable Ultra-Slim Power Bank (10,000mAh)",
    category: "under-25",
    price: "$21.99",
    rating: 4.9,
    badge: "Most Practical",
    description: "Reliable, high-speed phone charging anywhere. The gift literally anyone can use.",
    icon: "🔋",
    searchQuery: "anker portable charger power bank 10000mah",
  },
  {
    id: "g4",
    title: "Burt's Bees Essential Holiday Gift Basket",
    category: "under-25",
    price: "$14.99",
    rating: 4.8,
    description: "Classic beeswax lip balms, foot cream, and cuticle butter in a festive holiday tin.",
    icon: "🐝",
    searchQuery: "burts bees holiday gift set tin",
  },
  {
    id: "g5",
    title: "Bonsai Tree Starter Kit with Pots & Seeds",
    category: "under-25",
    price: "$24.95",
    rating: 4.6,
    badge: "Unique",
    description: "Everything needed to grow 4 distinct types of bonsai trees at home or in an office.",
    icon: "🪴",
    searchQuery: "bonsai tree starter grow kit",
  },

  // UNDER $50
  {
    id: "g6",
    title: "Ember Temperature Control Smart Mug",
    category: "under-50",
    price: "$49.99",
    rating: 4.8,
    badge: "⭐ Luxury Pick",
    description: "Keeps coffee or tea at the exact chosen temperature (120°F - 145°F) for up to 80 minutes.",
    icon: "☕",
    searchQuery: "smart temperature control heated coffee mug",
  },
  {
    id: "g7",
    title: "JBL Clip 4 Ultra-Portable Waterproof Bluetooth Speaker",
    category: "under-50",
    price: "$44.95",
    rating: 4.9,
    badge: "Best Sound",
    description: "Surprisingly rich audio with a built-in carabiner clip. 10 hours playtime, fully waterproof.",
    icon: "🔊",
    searchQuery: "JBL clip 4 waterproof bluetooth speaker",
  },
  {
    id: "g8",
    title: "Barefoot Dreams CozyChic Throw Blanket",
    category: "under-50",
    price: "$48.00",
    rating: 4.9,
    badge: "Super Soft",
    description: "The internet's favorite butter-soft microfiber blanket. Irresistibly warm and machine washable.",
    icon: "🛋️",
    searchQuery: "cozychic ultra soft plush throw blanket",
  },
  {
    id: "g9",
    title: "Cocktail Smoker Kit with Torch & 4 Wood Chips",
    category: "under-50",
    price: "$39.99",
    rating: 4.7,
    description: "Infuses Old Fashioneds and bourbon drinks with authentic oak, cherry, apple, and pecan smoke.",
    icon: "🥃",
    searchQuery: "cocktail smoker kit with torch wood chips",
  },

  // WHITE ELEPHANT & GAG GIFTS
  {
    id: "g10",
    title: "Giant 71-Inch Burrito Swaddle Blanket",
    category: "white-elephant",
    price: "$18.99",
    rating: 4.8,
    badge: "😂 Viral Hit",
    description: "Double-sided realistic flour tortilla blanket. Hilarious to unwrap and actually super warm.",
    icon: "🌯",
    searchQuery: "burrito tortilla throw blanket round",
  },
  {
    id: "g11",
    title: "Desktop Boxing Bag with Heavy Duty Suction",
    category: "white-elephant",
    price: "$19.99",
    rating: 4.6,
    badge: "Office Antidote",
    description: "Stress-relief punch bag that mounts to any desk or tabletop. Always gets stolen multiple times.",
    icon: "🥊",
    searchQuery: "desktop punch bag stress relief suction",
  },
  {
    id: "g12",
    title: "Waffle Wow! Car Mini Waffle Maker",
    category: "white-elephant",
    price: "$21.99",
    rating: 4.7,
    description: "Bakes 7 cool racecar and truck waffles in minutes. Loved by kids and fun-loving adults.",
    icon: "🧇",
    searchQuery: "mini waffle maker fun novelty shapes",
  },

  // BLACK SANTA & HERITAGE
  {
    id: "g13",
    title: "Black Santa Ceramic Holiday Mug & Cocoa Spoon",
    category: "black-santa",
    price: "$18.50",
    rating: 4.9,
    badge: "🎅🏿 Heritage Favorite",
    description: "Warm, vibrant ceramic holiday mug celebrating Black Santa holiday representation with gold foil details.",
    icon: "☕",
    searchQuery: "black santa claus ceramic holiday mug",
  },
  {
    id: "g14",
    title: "Black Santa Deluxe Keepsake Tree Ornament (Set of 3)",
    category: "black-santa",
    price: "$24.99",
    rating: 5.0,
    badge: "Keepsake",
    description: "Hand-painted African-American Santa Claus ornaments with festive velvet hanging ribbons.",
    icon: "🎄",
    searchQuery: "african american black santa christmas ornaments set",
  },
  {
    id: "g15",
    title: "Scented Soy Holiday Candle: Brown Sugar & Cinnamon Bourbon",
    category: "black-santa",
    price: "$22.00",
    rating: 4.8,
    description: "Hand-poured 100% soy candle by artisan creators. Warm holiday notes of roasted pecans, bourbon, and brown sugar.",
    icon: "🕯️",
    searchQuery: "brown sugar cinnamon soy candle artisan",
  },

  // NAVIDAD & HISPANIC TRADITIONS
  {
    id: "g16",
    title: "Abuela Hot Chocolate & Molinillo Whisk Gift Set",
    category: "navidad",
    price: "$23.99",
    rating: 4.9,
    badge: "🎅🏽 Tradición Familiar",
    description: "Authentic hand-carved Mexican wooden molinillo whisk with authentic artisanal cinnamon spiced chocolate tablets.",
    icon: "🍫",
    searchQuery: "mexican molinillo hot chocolate whisk set",
  },
  {
    id: "g17",
    title: "Lotería Holiday Deluxe Edition Game",
    category: "navidad",
    price: "$16.99",
    rating: 4.8,
    badge: "Fiesta Classic",
    description: "The beloved traditional Mexican card and board game with vibrant art, perfect for holiday reunions.",
    icon: "🎴",
    searchQuery: "loteria game deluxe edition board game",
  },

  // WORKPLACE & TEAM EXCHANGES
  {
    id: "g18",
    title: "Tile Mate Bluetooth Key & Item Finder (2-Pack)",
    category: "workplace",
    price: "$34.99",
    rating: 4.7,
    badge: "Universal Practicality",
    description: "Attaches to keys, backpacks, or luggage. Works seamlessly with iOS and Android devices.",
    icon: "🔑",
    searchQuery: "tile mate bluetooth key finder tracker 2 pack",
  },
  {
    id: "g19",
    title: "Burt's Bees Hand Repair Shea Butter Holiday Kit",
    category: "workplace",
    price: "$15.99",
    rating: 4.8,
    description: "Almond milk hand cream, lemon butter cuticle cream, and moisturizing gloves for winter hand care.",
    icon: "🧤",
    searchQuery: "hand repair cream spa gift set holiday",
  },
  {
    id: "g20",
    title: "Stainless Steel French Press Coffee & Tea Maker",
    category: "workplace",
    price: "$26.95",
    rating: 4.8,
    description: "Sleek double-wall insulated metal press. Unbreakable and brews silky smooth morning coffee in 4 minutes.",
    icon: "☕",
    searchQuery: "insulated stainless steel french press coffee maker",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Curations", icon: "✨" },
  { id: "under-25", label: "Under $25", icon: "🎁" },
  { id: "under-50", label: "Under $50", icon: "💎" },
  { id: "white-elephant", label: "White Elephant & Gag", icon: "🤣" },
  { id: "black-santa", label: "Black Santa Heritage", icon: "🎅🏿" },
  { id: "navidad", label: "Navidad & Reyes Magos", icon: "🎅🏽" },
  { id: "workplace", label: "Workplace & Team", icon: "💼" },
];

export default function GiftGuidesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    return GIFT_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.category === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const getAmazonUrl = (query: string) => {
    const encoded = encodeURIComponent(query);
    return `https://www.amazon.com/s?k=${encoded}&tag=${AMAZON_TAG}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f3c053] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated 2026 Secret Santa Gift Guides</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-festive text-[#fef9ee] tracking-tight">
          Hand-Picked Holiday Gift Guides
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Tired of generic gift ideas? We curated the top-rated crowd-pleasers, budget steals, and cultural treasures so you can find the perfect Secret Santa gift in under 60 seconds.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search gifts (tumbler, coffee, funny, speaker)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#0b2b20] border border-[#1d5943] rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#d4af37]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                activeCategory === cat.id
                  ? "bg-[#d4af37] text-[#0b2b20] shadow-md shadow-[#d4af37]/20"
                  : "bg-[#144534] border border-[#1d5943] text-slate-300 hover:text-white hover:border-slate-500"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gift Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#144534]/70 border border-[#1d5943] hover:border-[#d4af37]/60 rounded-2xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between group transition duration-200"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-[#0b2b20] border border-[#1d5943] flex items-center justify-center text-2xl group-hover:scale-110 transition">
                  {item.icon}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-lg font-bold text-[#fef9ee] font-mono">
                    {item.price}
                  </span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f3c053] border border-[#d4af37]/40 mt-1">
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-base text-[#fef9ee] mb-1.5 group-hover:text-[#f3c053] transition">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#1d5943]/60 flex items-center justify-between">
              <div className="flex items-center space-x-1 text-xs text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{item.rating}</span>
                <span className="text-slate-400 text-[11px]">(4.8+ Stars)</span>
              </div>

              <a
                href={getAmazonUrl(item.searchQuery)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#b89528] text-[#0b2b20] text-xs font-bold transition shadow"
              >
                <span>View on Amazon</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-base">No gifts found matching your search.</p>
          <button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            className="mt-3 text-xs text-[#d4af37] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Affiliate Disclosure Box */}
      <div className="text-center text-[11px] text-slate-400 max-w-xl mx-auto pt-6 border-t border-[#1d5943]/60">
        <p>
          Disclaimer: As an Amazon Associate, The Santa Circle earns from qualifying purchases. We only recommend high-rated holiday products to help make your gift exchange effortless and festive.
        </p>
      </div>
    </div>
  );
}
