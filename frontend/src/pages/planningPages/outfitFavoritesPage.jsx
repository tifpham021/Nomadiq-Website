import "./outfitSuggestionsPage.css";
import "./outfitFavoritesPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import heartImage from "../../assets/outfit-suggestions-img/heart.png";
import {
  PACKING_CATEGORIES,
  PACKING_LIST_STORAGE_KEY,
} from "./packingListData.js";

const FAVORITES_KEY = "outfit-suggestion-favorites-v1";

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const normalizeText = (value = "") =>
  String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");

const capitalizeLabel = (value = "") => {
  const text = String(value).trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
};

const isAccessoryPiece = (piece = "") => {
  const normalized = normalizeText(piece);

  return /(hat|cap|bag|tote|clutch|backpack|pouch|jewelry|watch|scarf|sunglasses|shades)/.test(
    normalized
  );
};

const buildInitialPackingItems = (categoryKey) => {
  const category = PACKING_CATEGORIES.find((entry) => entry.key === categoryKey);

  if (!category) {
    return [];
  }

  return category.items.map((item) => ({
    text: item,
    checked: false,
  }));
};

const appendOutfitPiecesToPackingChecklist = (pieces = []) => {
  const normalizedPieces = pieces
    .map((piece) => String(piece).trim())
    .filter(Boolean);

  if (normalizedPieces.length === 0) {
    return;
  }

  try {
    const raw = localStorage.getItem(PACKING_LIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const clothingItems = Array.isArray(parsed.clothing)
      ? parsed.clothing
      : buildInitialPackingItems("clothing");
    const accessoryItems = Array.isArray(parsed.accessories)
      ? parsed.accessories
      : buildInitialPackingItems("accessories");

    const appendUniqueItem = (currentItems, text) => {
      const normalizedItemText = normalizeText(text);
      const hasMatch = currentItems.some(
        (item) => normalizeText(item?.text) === normalizedItemText
      );

      if (hasMatch) {
        return currentItems;
      }

      return [...currentItems, { text, checked: false }];
    };

    const nextClothingItems = [...clothingItems];
    const nextAccessoryItems = [...accessoryItems];

    normalizedPieces.forEach((piece) => {
      if (isAccessoryPiece(piece)) {
        nextAccessoryItems.splice(
          0,
          nextAccessoryItems.length,
          ...appendUniqueItem(nextAccessoryItems, piece)
        );
      } else {
        nextClothingItems.splice(
          0,
          nextClothingItems.length,
          ...appendUniqueItem(nextClothingItems, piece)
        );
      }
    });

    parsed.clothing = nextClothingItems;
    parsed.accessories = nextAccessoryItems;
    localStorage.setItem(PACKING_LIST_STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error("Failed to append favorite outfit pieces:", error);
  }
};

const OutfitFavoritesPage = () => {
  const navigate = useNavigate();
  const [favoriteOutfits, setFavoriteOutfits] = useState(() => {
    const storedFavorites = parseStoredJson(FAVORITES_KEY);
    return Array.isArray(storedFavorites)
      ? storedFavorites.filter(
          (favorite) => favorite && typeof favorite === "object" && favorite.id
        )
      : [];
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteOutfits));
  }, [favoriteOutfits]);

  const handleRemoveFavorite = (favoriteId) => {
    setFavoriteOutfits((currentFavorites) =>
      currentFavorites.filter((favorite) => favorite.id !== favoriteId)
    );
  };

  const handleAddOutfit = (favorite) => {
    appendOutfitPiecesToPackingChecklist(favorite.pieces);
  };

  return (
    <div className="outfit-suggestions-page outfit-favorites-page">
      <div className="outfit-suggestions-shell outfit-favorites-shell">
        <header className="outfit-favorites-header">
          <button
            type="button"
            className="outfit-favorites-back"
            onClick={() => navigate("/outfit-suggestions")}
          >
            Back To Outfits
          </button>

          <div className="outfit-favorites-heading">
            <h1>Hearted Outfits</h1>
            <p>{favoriteOutfits.length} saved looks</p>
          </div>
        </header>

        {favoriteOutfits.length === 0 ? (
          <section className="outfit-favorites-empty">
            <img src={heartImage} alt="" className="outfit-favorites-empty-heart" />
            <h2>No hearted outfits yet</h2>
            <p>Tap the heart on an outfit card to save it here.</p>
          </section>
        ) : (
          <section className="outfit-favorites-grid">
            {favoriteOutfits.map((favorite) => (
              <article key={favorite.id} className="favorite-outfit-card">
                <div className="favorite-outfit-topline">
                  <span>{favorite.daypartLabel}</span>
                  <p>{favorite.destination}</p>
                </div>

                <div className="favorite-outfit-visual">
                  <div className="outfit-token-stage favorite-outfit-token-stage">
                    {favorite.visualTokens?.map((token, index) => (
                      <div
                        key={`${favorite.id}-${token.label}-${index}`}
                        className={`outfit-token outfit-token--${index + 1} outfit-tone-${index % 4}`}
                      >
                        {token.image ? (
                          <img src={token.image} alt="" className="outfit-token-image" />
                        ) : (
                          <span className="outfit-token-icon">{token.icon}</span>
                        )}
                        <span className="outfit-token-label">
                          {capitalizeLabel(token.label)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="favorite-outfit-copy">
                  <h2>{capitalizeLabel(favorite.title)}</h2>
                  <p>{favorite.summary}</p>
                </div>

                <div className="favorite-outfit-actions">
                  <button
                    type="button"
                    className="outfit-heart-button is-active"
                    onClick={() => handleRemoveFavorite(favorite.id)}
                    aria-label="Remove favorite outfit"
                  >
                    <img src={heartImage} alt="" className="outfit-heart-icon" />
                  </button>

                  <button
                    type="button"
                    className="outfit-add-button"
                    onClick={() => handleAddOutfit(favorite)}
                  >
                    Add Outfit
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default OutfitFavoritesPage;
