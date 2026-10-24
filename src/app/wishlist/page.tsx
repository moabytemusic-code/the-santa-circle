"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Plus, Trash2, ExternalLink, Save, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

interface WishListItem {
  id: string;
  title: string;
  description?: string | null;
  url?: string | null;
  price?: number | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

interface WishList {
  notes?: string;
  favoriteColors?: string;
  sizes?: string;
  interests?: string;
  items: WishListItem[];
}

export default function WishlistPage() {
  const [loading, setLoading] = useState(true);
  const [exchangeId, setExchangeId] = useState<string | null>(null);
  const [wishList, setWishList] = useState<WishList>({
    notes: "",
    favoriteColors: "",
    sizes: "",
    interests: "",
    items: [],
  });

  // Profile preferences form state
  const [notes, setNotes] = useState("");
  const [favoriteColors, setFavoriteColors] = useState("");
  const [sizes, setSizes] = useState("");
  const [interests, setInterests] = useState("");
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefSuccess, setPrefSuccess] = useState(false);

  // New Item form state
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemUrl, setItemUrl] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemPriority, setItemPriority] = useState<"LOW" | "MEDIUM" | "HIGH">("MEDIUM");
  const [addingItem, setAddingItem] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const exRes = await fetch("/api/exchange");
        const exData = await exRes.json();
        const activeEx = exData.exchanges?.[0];

        if (activeEx) {
          setExchangeId(activeEx.id);
          const wlRes = await fetch(`/api/wishlist?exchangeId=${activeEx.id}`);
          const wlData = await wlRes.json();
          if (wlData.wishList) {
            setWishList(wlData.wishList);
            setNotes(wlData.wishList.notes || "");
            setFavoriteColors(wlData.wishList.favoriteColors || "");
            setSizes(wlData.wishList.sizes || "");
            setInterests(wlData.wishList.interests || "");
          }
        }
      } catch {
        // Error
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeId) return;

    setSavingPrefs(true);
    setPrefSuccess(false);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchangeId,
          notes,
          favoriteColors,
          sizes,
          interests,
        }),
      });

      if (res.ok) {
        setPrefSuccess(true);
        setTimeout(() => setPrefSuccess(false), 3000);
      }
    } catch {
      // Handle error
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exchangeId || !itemTitle.trim()) return;

    setAddingItem(true);
    try {
      const res = await fetch("/api/wishlist/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exchangeId,
          title: itemTitle.trim(),
          description: itemDescription.trim() || undefined,
          url: itemUrl.trim() || undefined,
          price: itemPrice ? parseFloat(itemPrice) : undefined,
          priority: itemPriority,
        }),
      });

      const data = await res.json();
      if (res.ok && data.item) {
        setWishList((prev) => ({
          ...prev,
          items: [data.item, ...prev.items],
        }));
        // Reset form
        setItemTitle("");
        setItemDescription("");
        setItemUrl("");
        setItemPrice("");
        setItemPriority("MEDIUM");
        setShowItemModal(false);
      }
    } catch {
      // Handle error
    } finally {
      setAddingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/wishlist/items?id=${itemId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setWishList((prev) => ({
          ...prev,
          items: prev.items.filter((item) => item.id !== itemId),
        }));
      }
    } catch {
      // Handle error
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto my-16 text-center text-[#f3c053] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#d4af37]" />
        <p>Loading your wish list...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#1d5943] pb-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-[#d4af37] transition mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-[#fef9ee] font-festive flex items-center space-x-2">
            <Heart className="w-7 h-7 text-rose-400" />
            <span>My Holiday Wish List</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Give your Secret Santa helpful clues on what brings you joy!
          </p>
        </div>

        <button
          onClick={() => setShowItemModal(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-sm transition shadow-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Gift Idea</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Preferences & Sizes Form */}
        <div className="festive-card p-6 rounded-2xl space-y-4">
          <div className="border-b border-[#1d5943] pb-3">
            <h2 className="text-lg font-bold text-[#fef9ee] font-festive">Preferences & Sizes</h2>
            <p className="text-xs text-slate-300">Sizes and general tastes</p>
          </div>

          <form onSubmit={handleSavePreferences} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="favoriteColors">
                Favorite Colors
              </label>
              <input
                id="favoriteColors"
                type="text"
                value={favoriteColors}
                onChange={(e) => setFavoriteColors(e.target.value)}
                placeholder="Forest green, gold, navy..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="sizes">
                Clothing / Shoe Sizes
              </label>
              <input
                id="sizes"
                type="text"
                value={sizes}
                onChange={(e) => setSizes(e.target.value)}
                placeholder="Shirt: M, Pants: 32, Shoes: 10..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="interests">
                Hobbies & Interests
              </label>
              <textarea
                id="interests"
                rows={2}
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="Baking, hiking, sci-fi novels, board games..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="notes">
                Special Notes for Santa
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Allergies, dietary notes, preferences..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingPrefs}
              className="w-full py-2.5 rounded-xl bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-[#f3c053] font-bold text-xs transition flex items-center justify-center space-x-1.5"
            >
              {savingPrefs ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : prefSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{savingPrefs ? "Saving..." : prefSuccess ? "Saved!" : "Save Preferences"}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Gift Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#fef9ee] font-festive">
              Gift Ideas ({wishList.items.length})
            </h2>
          </div>

          {/* Amazon & Store Link Tip Banner */}
          <div className="p-3.5 rounded-xl bg-[#144534]/70 border border-[#d4af37]/40 flex items-center gap-3 text-xs text-slate-200 shadow-sm">
            <span className="text-xl shrink-0">💡</span>
            <div>
              <span className="font-bold text-[#f3c053]">Amazon & Store Links Welcome:</span>{" "}
              Paste links from <span className="text-white font-semibold underline decoration-[#f3c053]">Amazon</span>, Target, or any store when adding items so your Secret Santa knows the exact size, color, or model you want!
            </div>
          </div>

          {wishList.items.length > 0 ? (
            <div className="space-y-3">
              {wishList.items.map((item) => (
                <div
                  key={item.id}
                  className="festive-card p-4 rounded-xl flex items-start justify-between gap-4 border border-[#1d5943]"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-100 text-sm">{item.title}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          item.priority === "HIGH"
                            ? "bg-rose-950 text-rose-300 border border-rose-800"
                            : item.priority === "MEDIUM"
                            ? "bg-amber-950 text-amber-300 border border-amber-800"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-300">{item.description}</p>
                    )}

                    <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
                      {item.price && (
                        <span className="text-[#f3c053] font-semibold">
                          ${Number(item.price).toFixed(2)}
                        </span>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="text-[#d4af37] hover:underline flex items-center space-x-1"
                        >
                          <span>Store Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition"
                    title="Remove item"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="festive-card p-12 text-center rounded-2xl border border-dashed border-[#1d5943] space-y-3">
              <div className="text-4xl">🎁</div>
              <h3 className="font-bold text-slate-200 text-base">Your wish list is currently empty</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Add a few specific gift ideas or helpful links to make shopping easier for your Secret Santa!
              </p>
              <button
                onClick={() => setShowItemModal(true)}
                className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#144534] hover:bg-[#1d5943] border border-[#d4af37]/40 text-xs text-[#f3c053] font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Item</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="festive-card max-w-lg w-full p-6 rounded-2xl border-2 border-[#d4af37]/50 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1d5943] pb-3">
              <h3 className="text-lg font-bold text-[#fef9ee] font-festive">Add Gift Idea</h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="itemTitle">
                  Item Title *
                </label>
                <input
                  id="itemTitle"
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="Warm wool scarf / Wireless headphones"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="itemDescription">
                  Details / Color / Specifics
                </label>
                <input
                  id="itemDescription"
                  type="text"
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Green or navy preferred, size medium"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="itemPrice">
                    Approx. Price ($)
                  </label>
                  <input
                    id="itemPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="25.00"
                    className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1" htmlFor="itemPriority">
                    Wish Priority
                  </label>
                  <select
                    id="itemPriority"
                    value={itemPriority}
                    onChange={(e) => setItemPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH")}
                    className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 focus:border-[#d4af37] focus:outline-none"
                  >
                    <option value="HIGH">High (Top Wish)</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low (Nice to have)</option>
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300" htmlFor="itemUrl">
                    Web Link (Amazon or Online Store)
                  </label>
                  <span className="text-[10px] text-[#f3c053] font-bold">🛒 Amazon Links Supported</span>
                </div>
                <input
                  id="itemUrl"
                  type="url"
                  value={itemUrl}
                  onChange={(e) => setItemUrl(e.target.value)}
                  placeholder="https://www.amazon.com/dp/... or store URL"
                  className="w-full px-3 py-2 rounded-lg bg-[#0b2b20] border border-[#1d5943] text-sm text-slate-100 placeholder-slate-500 focus:border-[#d4af37] focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Paste an Amazon product link (or any store) so your Secret Santa can order the exact item!
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-[#1d5943]">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="px-4 py-2 rounded-lg border border-[#1d5943] text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingItem}
                  className="px-6 py-2 rounded-lg bg-[#d4af37] hover:bg-[#f3c053] text-[#0b2b20] font-bold text-xs shadow flex items-center space-x-1.5"
                >
                  {addingItem && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{addingItem ? "Adding..." : "Add to Wish List"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
