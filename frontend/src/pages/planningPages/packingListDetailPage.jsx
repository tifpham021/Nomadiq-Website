import "./packingListDetailPage.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import leftArrowImage from "../../assets/packing-detail-img/left-arrow.png";
import rightArrowImage from "../../assets/packing-detail-img/right-arrow.png";
import {
  PACKING_CATEGORIES,
  getPackingCategoryByKey,
  PACKING_LIST_STORAGE_KEY,
} from "./packingListData.js";

const buildInitialItems = (category) =>
  category.items.map((item) => ({
    text: item,
    checked: false,
  }));

const loadStoredItems = (category) => {
  try {
    const raw = localStorage.getItem(PACKING_LIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const hasSavedItems = Object.prototype.hasOwnProperty.call(parsed, category.key);
    const savedItems = parsed?.[category.key];

    if (!hasSavedItems) {
      return buildInitialItems(category);
    }

    if (!Array.isArray(savedItems)) {
      return buildInitialItems(category);
    }

    return savedItems.map((savedItem, index) => ({
      text:
        typeof savedItem?.text === "string"
          ? savedItem.text
          : category.items[index] ?? "",
      checked: Boolean(savedItem?.checked),
    }));
  } catch {
    return buildInitialItems(category);
  }
};

const saveStoredItems = (categoryKey, items) => {
  try {
    const raw = localStorage.getItem(PACKING_LIST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    parsed[categoryKey] = items;
    localStorage.setItem(PACKING_LIST_STORAGE_KEY, JSON.stringify(parsed));
  } catch (error) {
    console.error("Failed to save packing list state:", error);
  }
};

const splitItemsIntoColumns = (items) => {
  const midpoint = Math.ceil(items.length / 2);
  return [items.slice(0, midpoint), items.slice(midpoint)];
};

const PackingListDetailPage = () => {
  const navigate = useNavigate();
  const { categoryKey } = useParams();
  const category = getPackingCategoryByKey(categoryKey);
  const currentIndex = PACKING_CATEGORIES.findIndex(
    (entry) => entry.key === category.key
  );
  const previousCategory =
    PACKING_CATEGORIES[
      (currentIndex - 1 + PACKING_CATEGORIES.length) % PACKING_CATEGORIES.length
    ];
  const nextCategory =
    PACKING_CATEGORIES[(currentIndex + 1) % PACKING_CATEGORIES.length];
  const [items, setItems] = useState(() => loadStoredItems(category));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setItems(loadStoredItems(category));
    setIsEditing(false);
  }, [category.key]);

  useEffect(() => {
    saveStoredItems(category.key, items);
  }, [category.key, items]);

  const [leftColumn, rightColumn] = splitItemsIntoColumns(items);

  const handleToggleChecked = (index) => {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleItemChange = (index, value) => {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, text: value } : item
      )
    );
  };

  const handleNavigateCategory = (targetKey) => {
    navigate(`/packing-list/${targetKey}`);
  };

  const handleEditAction = () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setItems((currentItems) =>
      currentItems
        .map((item) => ({
          ...item,
          text: item.text.trim(),
        }))
        .filter((item) => item.text.length > 0)
    );
    setIsEditing(false);
  };

  return (
    <div className="packing-detail-page">
      <div className="packing-detail-shell">
        <div className="packing-detail-stage">
          <button
            type="button"
            className="packing-preview-card packing-preview-card--left"
            onClick={() => handleNavigateCategory(previousCategory.key)}
          >
            <h2>{previousCategory.title}</h2>
            <img src={previousCategory.detailImage || previousCategory.image} alt="" />
          </button>

          <section className="packing-detail-card">
            <div className="packing-detail-header">
              <h1>{category.title}</h1>
            </div>

            <div className="packing-detail-body">
              <div className="packing-detail-list">
                {[leftColumn, rightColumn].map((column, columnIndex) => (
                  <div key={columnIndex} className="packing-detail-column">
                    {column.map((item, itemIndex) => {
                      const absoluteIndex =
                        columnIndex === 0 ? itemIndex : leftColumn.length + itemIndex;

                      return (
                        <label
                          key={`${category.key}-${absoluteIndex}`}
                          className="packing-detail-item"
                        >
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleToggleChecked(absoluteIndex)}
                          />
                          {isEditing ? (
                            <input
                              type="text"
                              value={item.text}
                              onChange={(event) =>
                                handleItemChange(absoluteIndex, event.target.value)
                              }
                              className="packing-detail-input"
                            />
                          ) : (
                            <span>{item.text}</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="packing-detail-image-wrap">
                <img
                  src={category.detailImage || category.image}
                  alt=""
                  className="packing-detail-image"
                />
              </div>
            </div>

            <div className="packing-detail-footer">
              <button
                type="button"
                className="packing-detail-circle"
                onClick={() => handleNavigateCategory(previousCategory.key)}
                aria-label={`Go to ${previousCategory.title}`}
              >
                <img src={leftArrowImage} alt="" />
              </button>

              <button
                type="button"
                className="packing-detail-action packing-detail-action--exit"
                onClick={() => navigate("/packing-list")}
              >
                Exit
              </button>

              <button
                type="button"
                className="packing-detail-action packing-detail-action--edit"
                onClick={handleEditAction}
              >
                {isEditing ? "Save" : "Edit"}
              </button>

              <button
                type="button"
                className="packing-detail-circle"
                onClick={() => handleNavigateCategory(nextCategory.key)}
                aria-label={`Go to ${nextCategory.title}`}
              >
                <img src={rightArrowImage} alt="" />
              </button>
            </div>
          </section>

          <button
            type="button"
            className="packing-preview-card packing-preview-card--right"
            onClick={() => handleNavigateCategory(nextCategory.key)}
          >
            <h2>{nextCategory.title}</h2>
            <img src={nextCategory.detailImage || nextCategory.image} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackingListDetailPage;
