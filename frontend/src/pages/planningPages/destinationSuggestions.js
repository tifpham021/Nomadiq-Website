import mapPreview from "../../assets/planning-img/map.png";
import backgroundPreview from "../../assets/planning-img/weather.png";
import popupPreview from "../../assets/planning-img/popup.png";

const HAWAII_SUGGESTIONS = [
  {
    name: "Leonard's Bakery",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Leonard%27s%20Bakery%20%284290322777%29.jpg",
  },
  {
    name: "Diamond Head",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Diamond_Head_Hawaii_From_Round_Top_Rd.JPG",
  },
  {
    name: "Hanauma Bay",
    image: "https://commons.wikimedia.org/wiki/Special:FilePath/Hanauma_Bay.JPG",
  },
];

const curatedDestinations = [
  {
    matches: ["hawaii", "honolulu", "oahu", "waikiki", "maui", "kauai"],
    suggestions: HAWAII_SUGGESTIONS,
  },
];

const buildLocationLabel = (tripInfo) =>
  [tripInfo?.city, tripInfo?.state, tripInfo?.country]
    .filter(Boolean)
    .join(", ");

const buildFallbackSuggestions = (tripInfo) => {
  const label = tripInfo?.city || tripInfo?.state || tripInfo?.country || "your trip";

  return [
    {
      name: `${label} Food Stop`,
      image: popupPreview,
    },
    {
      name: `${label} Scenic View`,
      image: backgroundPreview,
    },
    {
      name: `${label} Local Highlight`,
      image: mapPreview,
    },
  ];
};

export const getDestinationSuggestions = (tripInfo) => {
  const destinationText = buildLocationLabel(tripInfo).toLowerCase();

  const match = curatedDestinations.find(({ matches }) =>
    matches.some((keyword) => destinationText.includes(keyword))
  );

  return match?.suggestions || buildFallbackSuggestions(tripInfo);
};

