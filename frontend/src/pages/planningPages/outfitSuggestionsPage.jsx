import "./outfitSuggestionsPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import downArrow from "../../assets/home-img/down-arrow.png";
import leftArrowImage from "../../assets/planning-img/left-arrow.png";
import rightArrowImage from "../../assets/planning-img/right-arrow.png";
import backpackImage from "../../assets/outfit-suggestions-img/backpack.png";
import bagImage from "../../assets/outfit-suggestions-img/bag.png";
import blouseImage from "../../assets/outfit-suggestions-img/blouse.png";
import cropTopImage from "../../assets/outfit-suggestions-img/crop-top.png";
import denimJacketImage from "../../assets/outfit-suggestions-img/denim-jacket.png";
import heartImage from "../../assets/outfit-suggestions-img/heart.png";
import heelsImage from "../../assets/outfit-suggestions-img/heels.png";
import hoodieImage from "../../assets/outfit-suggestions-img/hoodie.png";
import slipDressImage from "../../assets/outfit-suggestions-img/icons8-slip-dress-80.png";
import jeansImage from "../../assets/outfit-suggestions-img/jeans.png";
import jewelryImage from "../../assets/outfit-suggestions-img/jewelry.png";
import joggerPantsImage from "../../assets/outfit-suggestions-img/jogger-pants.png";
import loafersImage from "../../assets/outfit-suggestions-img/loafers.png";
import longSkirtImage from "../../assets/outfit-suggestions-img/long-skirt.png";
import menShortsImage from "../../assets/outfit-suggestions-img/men-shorts.png";
import menTankTopImage from "../../assets/outfit-suggestions-img/men-tank-top.png";
import poloShirtImage from "../../assets/outfit-suggestions-img/polo-shirt.png";
import sandalsImage from "../../assets/outfit-suggestions-img/sandals.png";
import shirtImage from "../../assets/outfit-suggestions-img/shirt.png";
import shoesImage from "../../assets/outfit-suggestions-img/shoes.png";
import skirtImage from "../../assets/outfit-suggestions-img/skirt.png";
import summerImage from "../../assets/outfit-suggestions-img/summer.png";
import teeShirtImage from "../../assets/outfit-suggestions-img/tee-shirt.png";
import womanClothesImage from "../../assets/outfit-suggestions-img/woman-clothes.png";
import womanDenimShortsImage from "../../assets/outfit-suggestions-img/woman-denim-shorts.png";
import womanFancyJacketImage from "../../assets/outfit-suggestions-img/woman-fancy-jacket.png";
import womenTankTopImage from "../../assets/outfit-suggestions-img/women-tank-top.png";
import {
  PACKING_CATEGORIES,
  PACKING_LIST_STORAGE_KEY,
} from "./packingListData.js";

const FILTERS_KEY = "outfit-suggestion-filters-v1";
const FAVORITES_KEY = "outfit-suggestion-favorites-v1";
const SAVED_KEY = "outfit-suggestion-saved-v1";

const DEFAULT_WEATHER = {
  description: "Mostly sunny with occasional clouds",
  avgTempF: 78,
  highTempF: 84,
  lowTempF: 70,
  conditionText: "Sunny",
};

const GENDER_OPTIONS = ["Women", "Men", "Neutral"];
const STYLE_OPTIONS = ["Casual", "Chic", "Streetwear", "Sporty", "Resort"];
const ACTIVITY_OPTIONS = [
  "Sightseeing",
  "Beach Day",
  "Brunch",
  "Shopping",
  "Hiking",
  "Travel Day",
];

const DAYPARTS = [
  { key: "morning", label: "Morning" },
  { key: "lunch", label: "Lunch" },
  { key: "dinner", label: "Dinner" },
];

const parseStoredJson = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveStoredJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key}:`, error);
  }
};

const normalizeText = (value = "") =>
  String(value).trim().toLowerCase().replace(/[^a-z0-9]+/g, " ");

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
      const normalizedText = normalizeText(text);
      const hasMatch = currentItems.some(
        (item) => normalizeText(item?.text) === normalizedText
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
    console.error("Failed to append outfit pieces to packing checklist:", error);
  }
};

const toSentenceCase = (value = "") => {
  const text = String(value).trim();
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
};

const normalizeGender = (value) => {
  const normalized = normalizeText(value);

  if (normalized.includes("female") || normalized.includes("woman")) {
    return "Women";
  }

  if (normalized.includes("male") || normalized.includes("man")) {
    return "Men";
  }

  return "Neutral";
};

const getDestinationText = (tripInfo) =>
  [tripInfo?.city, tripInfo?.state, tripInfo?.country].filter(Boolean).join(", ");

const inferDestinationVibe = (tripInfo) => {
  const normalized = normalizeText(
    `${tripInfo?.city || ""} ${tripInfo?.state || ""} ${tripInfo?.country || ""}`
  );

  if (
    /(hawaii|honolulu|maui|oahu|bahamas|cancun|miami|bali|phuket|maldives|santorini)/.test(
      normalized
    )
  ) {
    return "beach";
  }

  if (
    /(denver|aspen|banff|vail|alaska|iceland|swiss|zermatt|colorado|park city)/.test(
      normalized
    )
  ) {
    return "mountain";
  }

  if (
    /(paris|new york|tokyo|london|chicago|boston|seattle|rome|madrid|toronto|los angeles)/.test(
      normalized
    )
  ) {
    return "city";
  }

  if (/(singapore|bali|bahamas|hawaii|cancun)/.test(normalized)) {
    return "tropical";
  }

  return "city";
};

const inferDefaultActivity = (tripInfo, weatherSummary) => {
  const vibe = inferDestinationVibe(tripInfo);

  if (
    (vibe === "beach" || vibe === "tropical") &&
    Number(weatherSummary?.avgTempF) >= 78
  ) {
    return "Beach Day";
  }

  if (vibe === "mountain") {
    return "Hiking";
  }

  if (Number(weatherSummary?.avgTempF) <= 58) {
    return "Shopping";
  }

  return "Sightseeing";
};

const buildWeatherSummary = (forecastData) => {
  const forecastDay = forecastData?.forecast?.forecastday?.[0];
  const day = forecastDay?.day;

  if (!day) {
    return DEFAULT_WEATHER;
  }

  return {
    description: toSentenceCase(day.condition?.text || DEFAULT_WEATHER.description),
    avgTempF: Math.round(day.avgtemp_f),
    highTempF: Math.round(day.maxtemp_f),
    lowTempF: Math.round(day.mintemp_f),
    conditionText: day.condition?.text || DEFAULT_WEATHER.conditionText,
  };
};

const getTempBand = (avgTempF) => {
  const temp = Number(avgTempF);

  if (temp >= 82) return "hot";
  if (temp >= 70) return "warm";
  if (temp >= 60) return "mild";
  if (temp >= 50) return "cool";
  return "cold";
};

const pick = (items, index, fallback = "") => {
  if (!Array.isArray(items) || items.length === 0) {
    return fallback;
  }

  return items[((index % items.length) + items.length) % items.length];
};

const uniqueItems = (...groups) => [
  ...new Set(groups.flat().filter((item) => typeof item === "string" && item.trim())),
];

const getLookSeed = (...values) =>
  normalizeText(values.filter(Boolean).join(" "))
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

const buildTopPool = ({ gender, style, tempBand, slot, activity, vibe }) => {
  const warmKey = tempBand === "hot" || tempBand === "warm";
  let base = [];

  if (style === "Sporty") {
    if (gender === "Men") {
      base = warmKey
        ? [
            "Performance tee",
            "Sleeveless training top",
            "Breathable polo",
            "Athletic tee",
            "Mesh training top",
            "Cooling tech shirt",
          ]
        : [
            "Half-zip top",
            "Performance long sleeve",
            "Active knit",
            "Training hoodie",
            "Track zip-up",
            "Thermal performance tee",
          ];
    } else if (gender === "Women") {
      base = warmKey
        ? [
            "Active tank",
            "Racerback top",
            "Breathable fitted tee",
            "Zip-front crop",
            "Athleisure polo",
            "Lightweight workout top",
          ]
        : [
            "Half-zip top",
            "Performance long sleeve",
            "Active knit",
            "Zip training jacket",
            "Mock-neck active top",
            "Soft performance hoodie",
          ];
    } else {
      base = warmKey
        ? [
            "Sport tank",
            "Tech tee",
            "Breathable top",
            "Training jersey",
            "Athleisure polo",
            "Light mesh top",
          ]
        : [
            "Quarter-zip top",
            "Active long sleeve",
            "Performance knit",
            "Track jacket",
            "Training hoodie",
            "Thermal tee",
          ];
    }
  } else if (style === "Streetwear") {
    if (slot === "dinner") {
      base =
        gender === "Men"
          ? [
              "Layered tee",
              "Boxy camp shirt",
              "Cropped overshirt",
              "Textured knit polo",
              "Relaxed button-up",
              "Statement shirt",
            ]
          : [
              "Boxy tee",
              "Mesh top",
              "Cropped jacket set",
              "Fitted baby tee",
              "Off-shoulder knit top",
              "Structured crop top",
            ];
    } else {
      base = warmKey
        ? [
            "Boxy tee",
            "Oversized shirt",
            "Graphic tee",
            "Mesh jersey",
            "Open-collar shirt",
            "Relaxed tank",
          ]
        : [
            "Layering tee",
            "Waffle knit top",
            "Light hoodie",
            "Long-sleeve jersey",
            "Overshirt",
            "Heavyweight tee",
          ];
    }
  } else if (style === "Chic") {
    if (slot === "dinner") {
      base =
        gender === "Men"
          ? [
              "Knit polo",
              "Crisp button-up",
              "Silky shirt",
              "Fine-gauge knit",
              "Tailored open-collar shirt",
              "Textured dinner polo",
            ]
          : [
              "Silky blouse",
              "One-shoulder top",
              "Tailored vest top",
              "Draped camisole",
              "Satin shell",
              "Elegant knit top",
            ];
    } else {
      base = warmKey
        ? [
            "Structured tank",
            "Silky shell",
            "Polished tee",
            "Tailored camisole",
            "Soft blouse",
            "Fine knit tank",
          ]
        : [
            "Fine-knit top",
            "Soft blouse",
            "Tailored long sleeve",
            "Mock-neck knit",
            "Relaxed blouse",
            "Button-front knit top",
          ];
    }
  } else if (style === "Resort") {
    if (slot === "dinner") {
      base =
        gender === "Men"
          ? [
              "Open-collar shirt",
              "Sunset knit polo",
              "Linen button-up",
              "Terry resort shirt",
              "Lightweight evening shirt",
              "Textured camp shirt",
            ]
          : [
              "Draped halter top",
              "Silky camisole",
              "Breezy blouse",
              "Resort knit tank",
              "Sunset blouse",
              "Light draped shell",
            ];
    } else {
      base = warmKey
        ? [
            "Linen tank",
            "Breezy shirt",
            "Cotton camisole",
            "Crochet top",
            "Resort tee",
            "Palm-print shirt",
          ]
        : [
            "Light cardigan set",
            "Soft resort knit",
            "Breezy button-up",
            "Fine-knit polo",
            "Light draped shirt",
            "Layering camisole",
          ];
    }
  } else if (slot === "dinner") {
    base =
      gender === "Men"
        ? [
            "Clean tee",
            "Textured polo",
            "Relaxed button-up",
            "Fine-knit shirt",
            "Smart knit polo",
            "Soft evening tee",
          ]
        : [
            "Ribbed tank",
            "Soft blouse",
            "Simple knit top",
            "Sleeveless shell",
            "Silky tee",
            "Evening camisole",
          ];
  } else {
    base = warmKey
      ? [
          "Cotton tee",
          "Ribbed tank",
          "Easy linen top",
          "Relaxed button-up",
          "Breathable polo",
          "Soft camisole",
        ]
      : [
          "Striped knit top",
          "Soft long sleeve",
          "Light cardigan top",
          "Relaxed sweatshirt",
          "Fine knit tee",
          "Layering blouse",
        ];
  }

  const activityAdditions =
    activity === "Beach Day"
      ? warmKey
        ? gender === "Men"
          ? ["Terry polo", "Crochet camp shirt", "Open weave shirt"]
          : ["Beach camisole", "Crochet top", "Cover-up shirt"]
        : ["Light resort shirt", "Soft cover-up knit"]
      : activity === "Brunch"
        ? gender === "Men"
          ? ["Textured brunch polo", "Relaxed Oxford shirt", "Soft knit polo"]
          : ["Wrap blouse", "Polished tank", "Brunch shell top"]
        : activity === "Hiking"
          ? ["Moisture-wicking top", "Trail tee", "Sun hoodie"]
          : activity === "Travel Day"
            ? ["Airport hoodie", "Soft travel tee", "Zip travel top"]
            : activity === "Shopping"
              ? ["Walking tee", "Easy blouse", "Relaxed polo"]
              : ["Sightseeing tee", "Breathable shirt", "Light knit top"];

  const vibeAdditions =
    vibe === "beach" || vibe === "tropical"
      ? warmKey
        ? ["Linen shirt", "Breezy tank", "Palm shirt"]
        : ["Light resort cardigan", "Soft beach knit"]
      : vibe === "mountain"
        ? ["Thermal tee", "Trail overshirt", "Warm base layer"]
        : vibe === "city"
          ? ["City tee", "Polished shirt", "Layering knit"]
          : [];

  const slotAdditions =
    slot === "morning"
      ? ["Easy day tee", "Light starter layer"]
      : slot === "lunch"
        ? ["Polished daytime top", "Breathable mid-day shirt"]
        : ["Dinner knit top", "Night-out layer"];

  return uniqueItems(base, activityAdditions, vibeAdditions, slotAdditions);
};

const buildBottomPool = ({ gender, style, tempBand, slot, activity, vibe }) => {
  const warmKey = tempBand === "hot" || tempBand === "warm";
  const allowsSkirts = gender === "Women";
  let base = [];

  if (slot === "dinner") {
    base =
      gender === "Men"
        ? [
            "Tailored trousers",
            "Pleated pants",
            "Dark chinos",
            "Relaxed dress pants",
            "Soft drape trousers",
            "Straight evening pants",
          ]
        : gender === "Women"
          ? [
              "Silk midi skirt",
              "Wide-leg trousers",
              "Tailored pants",
              "Satin skirt",
              "Column skirt",
              "Pleated trousers",
            ]
          : [
              "Wide-leg trousers",
              "Tailored pants",
              "Straight-leg slacks",
              "Pleated trousers",
              "Relaxed dress pants",
              "Soft drape pants",
            ];
  } else if (style === "Streetwear") {
    if (warmKey) {
      base = allowsSkirts
        ? [
            "Cargo shorts",
            "Relaxed denim",
            "Utility skirt",
            "Baggy shorts",
            "Denim shorts",
            "Drawstring cargo shorts",
          ]
        : [
            "Cargo shorts",
            "Relaxed denim",
            "Utility shorts",
            "Baggy shorts",
            "Denim shorts",
            "Drawstring cargo shorts",
          ];
    } else {
      base = [
        "Cargo pants",
        "Baggy denim",
        "Utility trousers",
        "Straight jeans",
        "Wide cargo pants",
        "Relaxed joggers",
      ];
    }
  } else if (style === "Sporty") {
    if (warmKey) {
      base = allowsSkirts
        ? [
            "Athletic shorts",
            "Tennis skirt",
            "Running shorts",
            "Bike shorts",
            "Sport skort",
            "Track shorts",
          ]
        : [
            "Athletic shorts",
            "Track shorts",
            "Running shorts",
            "Tech shorts",
            "Training shorts",
            "Mesh shorts",
          ];
    } else {
      base = [
        "Track pants",
        "Joggers",
        "Performance leggings",
        "Warm-up pants",
        "Tech joggers",
        "Athletic trousers",
      ];
    }
  } else if (style === "Chic") {
    if (warmKey) {
      base = allowsSkirts
        ? [
            "Tailored shorts",
            "Satin skirt",
            "Linen trousers",
            "Paperbag shorts",
            "A-line skirt",
            "Wide-leg pants",
          ]
        : [
            "Tailored shorts",
            "Linen trousers",
            "Polished chinos",
            "Straight trousers",
            "Pleated shorts",
            "Relaxed linen pants",
          ];
    } else {
      base = allowsSkirts
        ? [
            "Pleated trousers",
            "Straight pants",
            "Midi skirt",
            "Wide-leg trousers",
            "Tailored slacks",
            "Column skirt",
          ]
        : [
            "Pleated trousers",
            "Straight pants",
            "Tailored chinos",
            "Wide-leg trousers",
            "Soft wool trousers",
            "Structured slacks",
          ];
    }
  } else if (style === "Resort") {
    if (warmKey) {
      base = allowsSkirts
        ? [
            "Linen shorts",
            "Flowy skirt",
            "Wide-leg shorts",
            "Drawstring linen shorts",
            "Resort trousers",
            "Light wrap skirt",
          ]
        : [
            "Linen shorts",
            "Wide-leg shorts",
            "Relaxed shorts",
            "Drawstring shorts",
            "Resort chinos",
            "Easy linen pants",
          ];
    } else {
      base = allowsSkirts
        ? [
            "Linen pants",
            "Draped trousers",
            "Relaxed skirt",
            "Soft travel pants",
            "Flowy trousers",
            "Column knit skirt",
          ]
        : [
            "Linen pants",
            "Draped trousers",
            "Relaxed trousers",
            "Soft travel pants",
            "Flowy trousers",
            "Drawstring chinos",
          ];
    }
  } else if (gender === "Men") {
    base = warmKey
      ? [
          "Tailored shorts",
          "Relaxed shorts",
          "Light chinos",
          "Pleated shorts",
          "Drawstring trousers",
          "Cropped chinos",
        ]
      : [
          "Straight jeans",
          "Chinos",
          "Relaxed trousers",
          "Cord trousers",
          "Soft joggers",
          "Pleated chinos",
        ];
  } else if (gender === "Women") {
    base = warmKey
      ? [
          "Denim shorts",
          "Flowy skirt",
          "Linen shorts",
          "Wide-leg pants",
          "Paperbag shorts",
          "Pull-on trousers",
        ]
      : [
          "Straight jeans",
          "Wide-leg pants",
          "Relaxed trousers",
          "Pleated pants",
          "Midi skirt",
          "Soft travel pants",
        ];
  } else {
    base = warmKey
      ? [
          "Relaxed shorts",
          "Easy trousers",
          "Flowy bottoms",
          "Drawstring shorts",
          "Wide-leg pants",
          "Tailored shorts",
        ]
      : [
          "Straight jeans",
          "Utility pants",
          "Wide-leg trousers",
          "Relaxed trousers",
          "Pull-on pants",
          "Soft chinos",
        ];
  }

  const activityAdditions =
    activity === "Beach Day"
      ? warmKey
        ? allowsSkirts
          ? ["Swim cover shorts", "Wrap skirt", "Drawstring shorts"]
          : ["Drawstring shorts", "Swim-ready shorts", "Beach chinos"]
        : ["Resort pants", "Drawstring trousers"]
      : activity === "Brunch"
        ? allowsSkirts
          ? ["Midi skirt", "Tailored shorts", "Wide trousers"]
          : ["Pleated chinos", "Tailored shorts", "Clean trousers"]
        : activity === "Hiking"
          ? ["Trail shorts", "Ripstop pants", "Utility trousers"]
          : activity === "Travel Day"
            ? ["Joggers", "Soft travel pants", "Pull-on trousers"]
            : activity === "Shopping"
              ? ["Straight jeans", "Walking trousers", "Relaxed shorts"]
              : ["Sightseeing shorts", "Easy trousers", "Relaxed denim"];

  const vibeAdditions =
    vibe === "beach" || vibe === "tropical"
      ? warmKey
        ? allowsSkirts
          ? ["Linen wrap skirt", "Terry shorts", "Flowy shorts"]
          : ["Linen shorts", "Terry shorts", "Relaxed beach shorts"]
        : ["Linen trousers", "Drawstring pants"]
      : vibe === "mountain"
        ? ["Cargo pants", "Trail trousers", "Utility shorts"]
        : vibe === "city"
          ? ["Smart trousers", "Dark denim", "Polished shorts"]
          : [];

  return uniqueItems(base, activityAdditions, vibeAdditions);
};

const buildOnePiecePool = ({ gender, style, slot, activity, vibe }) => {
  if (slot !== "dinner" && style !== "Resort") {
    return [];
  }

  if (gender === "Men") {
    return ["Matching set", "Camp set", "Monochrome set", "Relaxed co-ord", "Linen set"];
  }

  if (gender === "Women") {
    if (style === "Chic") {
      return ["Slip dress", "Wrap dress", "Column dress", "Satin midi dress", "Corset dress"];
    }

    if (style === "Resort" || activity === "Beach Day" || vibe === "beach") {
      return [
        "Breezy midi dress",
        "Matching resort set",
        "Wrap dress",
        "Linen dress",
        "Sunset slip dress",
      ];
    }

    return ["Knit dress", "Matching set", "Easy midi dress", "Soft jersey dress", "Co-ord set"];
  }

  return ["Matching set", "Relaxed co-ord", "Knit set", "Soft travel set", "Layered set"];
};

const buildShoePool = ({ activity, slot, tempBand, style }) => {
  if (activity === "Hiking") {
    return slot === "dinner"
      ? ["Trail sneakers", "Chunky sneakers", "Supportive boots", "Tech hikers"]
      : ["Trail shoes", "Hiking sneakers", "Grip sandals", "Outdoor trainers"];
  }

  if (activity === "Beach Day") {
    return slot === "dinner"
      ? ["Strappy sandals", "Woven sandals", "Minimal slides", "Resort sandals"]
      : ["Slide sandals", "Beach sandals", "Espadrilles", "Pool slides"];
  }

  if (activity === "Travel Day") {
    return ["Slip-on sneakers", "Supportive sneakers", "Comfort loafers", "Airport trainers"];
  }

  if (activity === "Shopping") {
    return slot === "dinner"
      ? ["Loafers", "Low heels", "Clean sneakers", "Sleek boots"]
      : ["Walking sneakers", "Loafers", "Flat sandals", "City sneakers"];
  }

  if (activity === "Brunch") {
    return slot === "dinner"
      ? ["Heeled sandals", "Loafers", "Polished flats", "Dressy sandals"]
      : ["White sneakers", "Sandals", "Loafers", "Espadrilles"];
  }

  if (style === "Sporty") {
    return tempBand === "cold"
      ? ["Running shoes", "High-top trainers", "Tech sneakers", "Track trainers"]
      : ["Trainers", "Athletic sneakers", "Supportive runners", "Mesh sneakers"];
  }

  return slot === "dinner"
    ? ["Loafers", "Minimal sneakers", "Evening sandals", "Clean boots"]
    : ["White sneakers", "Walking sandals", "Canvas shoes", "Slip-on sneakers"];
};

const buildAccessoryPool = ({ style, activity, vibe, slot, tempBand }) => {
  if (activity === "Beach Day" || vibe === "beach") {
    return slot === "dinner"
      ? ["Shell jewelry", "Small clutch", "Light shawl", "Woven mini bag"]
      : ["Sun hat", "Woven tote", "Sunglasses", "Beach bag"];
  }

  if (activity === "Hiking") {
    return ["Cap", "Mini backpack", "Sport watch", "Utility sling"];
  }

  if (activity === "Travel Day") {
    return ["Crossbody bag", "Weekender tote", "Zip pouch", "Travel backpack"];
  }

  if (style === "Chic") {
    return slot === "dinner"
      ? ["Gold jewelry", "Mini bag", "Silk scarf", "Statement earrings"]
      : ["Structured bag", "Sunglasses", "Delicate jewelry", "Leather tote"];
  }

  if (style === "Streetwear") {
    return ["Crossbody bag", "Cap", "Statement shades", "Beanie"];
  }

  if (style === "Sporty") {
    return ["Sling bag", "Cap", "Sport watch", "Performance visor"];
  }

  if (style === "Resort") {
    return tempBand === "cool"
      ? ["Light scarf", "Woven bag", "Tinted sunglasses", "Woven clutch"]
      : ["Woven tote", "Tinted sunglasses", "Sun hat", "Shell jewelry"];
  }

  return slot === "dinner"
    ? ["Simple jewelry", "Mini bag", "Light layer", "Evening bag"]
    : ["Crossbody bag", "Sunglasses", "Everyday tote", "Shoulder bag"];
};

const buildLayerPool = ({ style, tempBand, slot, activity, vibe }) => {
  if (tempBand === "hot") {
    return slot === "dinner"
      ? ["Light scarf", "Open shirt", "Dinner overshirt"]
      : activity === "Travel Day"
        ? ["Airport hoodie", "Light overshirt"]
        : [];
  }

  if (tempBand === "warm") {
    return uniqueItems(
      slot === "dinner"
        ? ["Light cardigan", "Soft blazer", "Open shirt", "Dinner jacket"]
        : ["Overshirt", "Light cardigan", "Denim jacket", "Casual blazer"],
      activity === "Travel Day" ? ["Airport hoodie", "Zip jacket"] : [],
      vibe === "mountain" ? ["Trail jacket", "Fleece overshirt"] : []
    );
  }

  if (tempBand === "mild") {
    return uniqueItems(
      ["Denim jacket", "Cardigan", "Light blazer", "Overshirt", "Knit zip-up"],
      vibe === "mountain" ? ["Trail jacket", "Warm overshirt"] : [],
      activity === "Travel Day" ? ["Airport hoodie"] : []
    );
  }

  if (style === "Sporty") {
    return ["Quarter-zip", "Track jacket", "Windbreaker", "Training hoodie", "Shell jacket"];
  }

  return uniqueItems(
    ["Trench layer", "Knit cardigan", "Wool overshirt", "Structured coat", "Heavy cardigan"],
    vibe === "mountain" ? ["Puffer vest", "Warm jacket"] : []
  );
};

const LOOK_RECIPES = {
  morning: [
    { top: 0, bottom: 0, shoes: 0, accessory: 0, layer: 0, onePiece: false },
    { top: 2, bottom: 3, shoes: 1, accessory: 2, layer: 1, onePiece: false },
    { top: 4, bottom: 1, shoes: 3, accessory: 3, layer: 2, onePiece: false },
    { top: 1, bottom: 4, shoes: 2, accessory: 4, layer: 0, onePiece: false },
    { top: 5, bottom: 5, shoes: 4, accessory: 1, layer: 3, onePiece: false },
  ],
  lunch: [
    { top: 1, bottom: 2, shoes: 0, accessory: 1, layer: 0, onePiece: false },
    { top: 3, bottom: 0, shoes: 2, accessory: 2, layer: 1, onePiece: false },
    { top: 5, bottom: 4, shoes: 1, accessory: 3, layer: 2, onePiece: false },
    { top: 0, bottom: 5, shoes: 3, accessory: 0, layer: 3, onePiece: false },
    { top: 4, bottom: 1, shoes: 4, accessory: 4, layer: 1, onePiece: false },
  ],
  dinner: [
    { main: 0, shoes: 0, accessory: 0, layer: 0, onePiece: true },
    { top: 1, bottom: 1, shoes: 2, accessory: 1, layer: 1, onePiece: false },
    { main: 2, shoes: 1, accessory: 2, layer: 2, onePiece: true },
    { top: 4, bottom: 3, shoes: 3, accessory: 3, layer: 0, onePiece: false },
    { top: 5, bottom: 5, shoes: 4, accessory: 4, layer: 1, onePiece: false },
  ],
};

const getWeatherToken = (conditionText) => {
  const normalized = normalizeText(conditionText);

  if (normalized.includes("rain"))
    return { icon: "🌧️", label: "Rain-ready", image: summerImage };
  if (normalized.includes("cloud"))
    return { icon: "⛅", label: "Partly cloudy", image: summerImage };
  if (normalized.includes("snow"))
    return { icon: "❄️", label: "Cold snap", image: summerImage };
  return { icon: "☀️", label: "Sunny", image: summerImage };
};

const getRoleFallbackImage = (role = "piece", gender = "Neutral") => {
  if (role === "top") {
    return gender === "Women" ? blouseImage : gender === "Men" ? shirtImage : teeShirtImage;
  }

  if (role === "main") {
    return gender === "Women" ? womanClothesImage : shirtImage;
  }

  if (role === "bottom") {
    return gender === "Women" ? womanDenimShortsImage : jeansImage;
  }

  if (role === "shoes") {
    return shoesImage;
  }

  if (role === "accessory") {
    return bagImage;
  }

  if (role === "layer") {
    return gender === "Women" ? womanFancyJacketImage : denimJacketImage;
  }

  return null;
};

const getPieceImage = (piece = "", gender = "Neutral", role = "piece") => {
  const normalized = normalizeText(piece);

  if (/(dress|gown)/.test(normalized)) {
    return /(slip|wrap|column|midi)/.test(normalized)
      ? slipDressImage
      : womanClothesImage;
  }
  if (/(set|coord|co ord)/.test(normalized)) {
    return gender === "Women" ? womanClothesImage : shirtImage;
  }
  if (/(crop)/.test(normalized)) {
    return cropTopImage;
  }
  if (/(tank|camisole|halter|racerback)/.test(normalized)) {
    return gender === "Men" ? menTankTopImage : womenTankTopImage;
  }
  if (/(blouse)/.test(normalized)) return blouseImage;
  if (/(polo)/.test(normalized)) return poloShirtImage;
  if (/(hoodie|sweatshirt)/.test(normalized)) return hoodieImage;
  if (/(jacket|cardigan|overshirt|trench|windbreaker)/.test(normalized))
    return gender === "Women" ? womanFancyJacketImage : denimJacketImage;
  if (/(blazer)/.test(normalized))
    return gender === "Women" ? womanFancyJacketImage : denimJacketImage;
  if (/(tee)/.test(normalized)) return teeShirtImage;
  if (/(button up|button-up|buttonup|oxford|shirt)/.test(normalized)) return shirtImage;
  if (/(long sleeve|half zip|half-zip|quarter zip|quarter-zip|zip up|zip-up|jersey|knit|shell|top)/.test(normalized)) {
    return gender === "Women" ? blouseImage : shirtImage;
  }
  if (/(jeans|denim|pants|trousers|chinos|joggers|leggings|shorts|bottoms)/.test(normalized))
    return /(joggers|leggings)/.test(normalized)
      ? joggerPantsImage
      : /(shorts)/.test(normalized)
        ? gender === "Women"
          ? womanDenimShortsImage
          : menShortsImage
        : jeansImage;
  if (/(skirt)/.test(normalized)) {
    return /(midi|long|column)/.test(normalized) ? longSkirtImage : skirtImage;
  }
  if (/(loafers)/.test(normalized)) return loafersImage;
  if (/(sandals|espadrilles|slides|flip flops)/.test(normalized)) return sandalsImage;
  if (/(heels)/.test(normalized)) return heelsImage;
  if (/(sneakers|shoes|boots|flats|trainers)/.test(normalized)) return shoesImage;
  if (/(backpack)/.test(normalized)) return backpackImage;
  if (/(bag|tote|clutch|pouch)/.test(normalized)) return bagImage;
  if (/(jewelry|earrings)/.test(normalized)) return jewelryImage;

  return getRoleFallbackImage(role, gender);
};

const getPieceIcon = (piece = "") => {
  const normalized = normalizeText(piece);

  if (/(dress|gown)/.test(normalized)) return "👗";
  if (/(tank|camisole|blouse|top|tee|shirt|polo|halter|vest)/.test(normalized))
    return "👚";
  if (/(shorts)/.test(normalized)) return "🩳";
  if (/(jeans|pants|trousers|joggers|leggings|skirt|bottoms)/.test(normalized))
    return "👖";
  if (/(sandal|heels|flats|loafers|sneakers|shoes|boots)/.test(normalized))
    return "👟";
  if (/(hat|cap)/.test(normalized)) return "🧢";
  if (/(bag|tote|clutch|backpack|pouch)/.test(normalized)) return "👜";
  if (/(watch)/.test(normalized)) return "⌚";
  if (/(jewelry|scarf)/.test(normalized)) return "✨";
  if (/(layer|cardigan|jacket|blazer|overshirt|windbreaker)/.test(normalized))
    return "🧥";
  return "✦";
};

const buildOutfitOptions = (slot, context) => {
  const { filters, weatherSummary, tripInfo } = context;
  const tempBand = getTempBand(weatherSummary.avgTempF);
  const vibe = inferDestinationVibe(tripInfo);
  const lookSeed = getLookSeed(
    filters.gender,
    filters.style,
    filters.activity,
    vibe,
    tempBand,
    tripInfo?.city,
    slot
  );
  const recipes = LOOK_RECIPES[slot] || LOOK_RECIPES.morning;

  return recipes.map((recipe, optionIndex) => {
    const choiceOffset = lookSeed + optionIndex * 3;
    const topPool = buildTopPool({
      gender: filters.gender,
      style: filters.style,
      tempBand,
      slot,
      activity: filters.activity,
      vibe,
    });
    const bottomPool = buildBottomPool({
      gender: filters.gender,
      style: filters.style,
      tempBand,
      slot,
      activity: filters.activity,
      vibe,
    });
    const onePiecePool = buildOnePiecePool({
      gender: filters.gender,
      style: filters.style,
      slot,
      activity: filters.activity,
      vibe,
    });
    const shoePool = buildShoePool({
      activity: filters.activity,
      slot,
      tempBand,
      style: filters.style,
    });
    const accessoryPool = buildAccessoryPool({
      style: filters.style,
      activity: filters.activity,
      vibe,
      slot,
      tempBand,
    });
    const layerPool = buildLayerPool({
      style: filters.style,
      tempBand,
      slot,
      activity: filters.activity,
      vibe,
    });

    const useOnePiece = recipe.onePiece && onePiecePool.length > 0;

    const mainPiece = useOnePiece ? pick(onePiecePool, choiceOffset + (recipe.main ?? 0)) : "";
    const top = useOnePiece ? "" : pick(topPool, choiceOffset + (recipe.top ?? 0));
    const bottom = useOnePiece
      ? ""
      : pick(bottomPool, choiceOffset + (recipe.bottom ?? 0));
    const layer = pick(layerPool, choiceOffset + (recipe.layer ?? 0));
    const shoes = pick(shoePool, choiceOffset + (recipe.shoes ?? 0));
    const accessory = pick(accessoryPool, choiceOffset + (recipe.accessory ?? 0));

    const pieces = useOnePiece
      ? [mainPiece, shoes, accessory, layer].filter(Boolean)
      : [top, bottom, shoes, accessory, layer].filter(Boolean);

    const visualCandidates = useOnePiece
      ? [
          { label: mainPiece, role: "main" },
          { label: shoes, role: "shoes" },
          { label: accessory, role: "accessory" },
          { label: layer, role: "layer" },
        ]
      : [
          { label: top, role: "top" },
          { label: bottom, role: "bottom" },
          { label: shoes, role: "shoes" },
          { label: accessory, role: "accessory" },
          { label: layer, role: "layer" },
        ];

    const visualTokens = visualCandidates
      .filter((candidate) => candidate.label)
      .map((candidate) => ({
        label: candidate.label,
        icon: getPieceIcon(candidate.label),
        image: getPieceImage(candidate.label, filters.gender, candidate.role),
      }))
      .slice(0, 4);

    const title = useOnePiece ? mainPiece : `${top} + ${bottom}`;
    const destinationName = tripInfo?.city || "your destination";
    const summary =
      slot === "dinner"
        ? `${filters.style} dinner look for ${destinationName}, built for ${filters.activity.toLowerCase()} around ${weatherSummary.lowTempF}°F to ${weatherSummary.highTempF}°F.`
        : slot === "lunch"
          ? `${filters.style} midday outfit for ${filters.activity.toLowerCase()} in ${destinationName}, tuned for ${weatherSummary.avgTempF}°F.`
          : `${filters.style} morning outfit for a ${weatherSummary.conditionText.toLowerCase()} start in ${destinationName}.`;

    const id = [
      slot,
      filters.gender,
      filters.style,
      filters.activity,
      title,
      ...pieces,
    ].join("::");

    return {
      id,
      title,
      summary,
      pieces,
      visualTokens,
    };
  });
};

const OutfitCard = ({
  daypart,
  outfit,
  position,
  onCycle,
  onToggleFavorite,
  onAddOutfit,
  isFavorite,
  isSaved,
}) => (
  <article className="outfit-card">
    <h2>{daypart.label}</h2>

    <div className="outfit-visual">
      <button
        type="button"
        className="outfit-arrow-button outfit-arrow-button--left"
        onClick={() => onCycle(daypart.key, -1)}
        aria-label={`Show previous ${daypart.label.toLowerCase()} look`}
      >
        <img src={leftArrowImage} alt="" />
      </button>

      <div className="outfit-token-stage">
        {outfit.visualTokens.map((token, index) => (
          <div
            key={`${token.label}-${index}`}
            className={`outfit-token outfit-token--${index + 1} outfit-tone-${(position + index) % 4}`}
          >
            {token.image ? (
              <img src={token.image} alt="" className="outfit-token-image" />
            ) : (
              <span className="outfit-token-icon">{token.icon}</span>
            )}
            <span className="outfit-token-label">{token.label}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="outfit-arrow-button outfit-arrow-button--right"
        onClick={() => onCycle(daypart.key, 1)}
        aria-label={`Show next ${daypart.label.toLowerCase()} look`}
      >
        <img src={rightArrowImage} alt="" />
      </button>
    </div>

    <div className="outfit-card-copy">
      <p className="outfit-title">{outfit.title}</p>
      <p className="outfit-summary">{outfit.summary}</p>

      <div className="outfit-piece-pills">
        {outfit.pieces.slice(0, 4).map((piece) => (
          <span key={piece} className="outfit-piece-pill">
            {piece}
          </span>
        ))}
      </div>
    </div>

    <div className="outfit-card-footer">
      <button
        type="button"
        className={`outfit-heart-button ${isFavorite ? "is-active" : ""}`}
        onClick={() => onToggleFavorite(daypart.key, outfit)}
        aria-label={isFavorite ? "Remove favorite outfit" : "Favorite outfit"}
      >
        <img src={heartImage} alt="" className="outfit-heart-icon" />
      </button>

      <button
        type="button"
        className={`outfit-add-button ${isSaved ? "is-saved" : ""}`}
        onClick={() => onAddOutfit(daypart.key, outfit)}
      >
        {isSaved ? "Added" : "Add Outfit"}
      </button>
    </div>
  </article>
);

const OutfitSuggestionsPage = () => {
  const navigate = useNavigate();
  const [tripInfo] = useState(() => parseStoredJson("plan"));
  const [hasStoredFilters] = useState(() => Boolean(parseStoredJson(FILTERS_KEY)));
  const [weatherSummary, setWeatherSummary] = useState(DEFAULT_WEATHER);
  const [filters, setFilters] = useState(() => {
    const storedFilters = parseStoredJson(FILTERS_KEY);
    const storedUser = parseStoredJson("user");

    return (
      storedFilters || {
        gender: normalizeGender(storedUser?.gender),
        style: "Casual",
        activity: inferDefaultActivity(parseStoredJson("plan"), DEFAULT_WEATHER),
      }
    );
  });
  const [slotIndexes, setSlotIndexes] = useState({
    morning: 0,
    lunch: 0,
    dinner: 0,
  });
  const [favoriteOutfits, setFavoriteOutfits] = useState(() => {
    const storedFavorites = parseStoredJson(FAVORITES_KEY);
    return Array.isArray(storedFavorites)
      ? storedFavorites.filter(
          (favorite) => favorite && typeof favorite === "object" && favorite.id
        )
      : [];
  });
  const [savedOutfits, setSavedOutfits] = useState(() => {
    const storedSaved = parseStoredJson(SAVED_KEY);
    return Array.isArray(storedSaved) ? storedSaved : [];
  });

  useEffect(() => {
    if (!tripInfo?.city) {
      return;
    }

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/weather?city=${encodeURIComponent(tripInfo.city)}`
        );

        if (!response.ok) {
          throw new Error("Unable to fetch weather");
        }

        const data = await response.json();
        const nextWeatherSummary = buildWeatherSummary(data);
        setWeatherSummary(nextWeatherSummary);

        if (!hasStoredFilters) {
          setFilters((currentFilters) => ({
            ...currentFilters,
            activity: inferDefaultActivity(tripInfo, nextWeatherSummary),
          }));
        }
      } catch (error) {
        console.error("Failed to fetch outfit weather:", error);
      }
    };

    fetchWeather();
  }, [hasStoredFilters, tripInfo]);

  useEffect(() => {
    saveStoredJson(FILTERS_KEY, filters);
  }, [filters]);

  useEffect(() => {
    saveStoredJson(FAVORITES_KEY, favoriteOutfits);
  }, [favoriteOutfits]);

  useEffect(() => {
    saveStoredJson(SAVED_KEY, savedOutfits);
  }, [savedOutfits]);

  const destinationText = getDestinationText(tripInfo) || "Your Trip";
  const weatherLine = `${weatherSummary.highTempF}° / ${weatherSummary.lowTempF}°F`;
  const outfitSets = {
    morning: buildOutfitOptions("morning", { filters, weatherSummary, tripInfo }),
    lunch: buildOutfitOptions("lunch", { filters, weatherSummary, tripInfo }),
    dinner: buildOutfitOptions("dinner", { filters, weatherSummary, tripInfo }),
  };

  const handleFilterChange = (key, value) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value,
    }));
    setSlotIndexes({
      morning: 0,
      lunch: 0,
      dinner: 0,
    });
  };

  const handleCycle = (slotKey, direction) => {
    const total = outfitSets[slotKey].length;

    setSlotIndexes((currentIndexes) => ({
      ...currentIndexes,
      [slotKey]:
        (currentIndexes[slotKey] + direction + total) % total,
    }));
  };

  const buildFavoriteRecord = (slotKey, outfit) => ({
    id: outfit.id,
    slotKey,
    daypartLabel:
      DAYPARTS.find((daypart) => daypart.key === slotKey)?.label || slotKey,
    destination: destinationText,
    filters: { ...filters },
    weather: { ...weatherSummary },
    title: outfit.title,
    summary: outfit.summary,
    pieces: [...outfit.pieces],
    visualTokens: outfit.visualTokens.map((token) => ({ ...token })),
    favoritedAt: new Date().toISOString(),
  });

  const handleToggleFavorite = (slotKey, outfit) => {
    setFavoriteOutfits((currentFavorites) =>
      currentFavorites.some((favorite) => favorite.id === outfit.id)
        ? currentFavorites.filter((favorite) => favorite.id !== outfit.id)
        : [...currentFavorites, buildFavoriteRecord(slotKey, outfit)]
    );
  };

  const handleAddOutfit = (slotKey, outfit) => {
    const nextRecord = {
      id: outfit.id,
      slotKey,
      destination: destinationText,
      filters,
      weather: weatherSummary,
      title: outfit.title,
      pieces: outfit.pieces,
      addedAt: new Date().toISOString(),
    };

    appendOutfitPiecesToPackingChecklist(outfit.pieces);

    setSavedOutfits((currentSavedOutfits) =>
      currentSavedOutfits.some((savedItem) => savedItem.id === outfit.id)
        ? currentSavedOutfits
        : [...currentSavedOutfits, nextRecord]
    );
  };

  return (
    <div className="outfit-suggestions-page">
      <div className="outfit-suggestions-shell">
        <header className="outfit-page-header">
          <button
            type="button"
            className="outfit-saved-pill"
            aria-label={`${favoriteOutfits.length} favorite outfits`}
            onClick={() => navigate("/outfit-suggestions/favorites")}
          >
            <img src={heartImage} alt="" className="outfit-saved-heart" />
            {favoriteOutfits.length > 0 ? (
              <span className="outfit-saved-count">{favoriteOutfits.length}</span>
            ) : null}
          </button>

          <div className="outfit-heading-block">
            <h1>Outfit Suggestions</h1>
            <p>
              Personalized for {destinationText} • {weatherLine}
            </p>
          </div>

          <div className="outfit-filter-row">
            {[
              { label: "Gender", key: "gender", options: GENDER_OPTIONS },
              { label: "Style", key: "style", options: STYLE_OPTIONS },
              { label: "Activity", key: "activity", options: ACTIVITY_OPTIONS },
            ].map((filter) => (
              <label key={filter.key} className="outfit-filter-control">
                <span>{filter.label}</span>
                <div className="outfit-select-shell">
                  <select
                    value={filters[filter.key]}
                    onChange={(event) =>
                      handleFilterChange(filter.key, event.target.value)
                    }
                  >
                    {filter.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <img src={downArrow} alt="" />
                </div>
              </label>
            ))}
          </div>
        </header>

        <section className="outfit-card-grid">
          {DAYPARTS.map((daypart, index) => {
            const options = outfitSets[daypart.key];
            const activeOutfit = options[slotIndexes[daypart.key]];

            return (
              <OutfitCard
                key={daypart.key}
                daypart={daypart}
                outfit={activeOutfit}
                position={index}
                onCycle={handleCycle}
                onToggleFavorite={handleToggleFavorite}
                onAddOutfit={handleAddOutfit}
                isFavorite={favoriteOutfits.some((favorite) => favorite.id === activeOutfit.id)}
                isSaved={savedOutfits.some((savedItem) => savedItem.id === activeOutfit.id)}
              />
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default OutfitSuggestionsPage;
