import starImage from "../../assets/packing-img/star 1.png";
import clothingImage from "../../assets/packing-img/clothing_3286394 1.png";
import creamImage from "../../assets/packing-img/cream_11901426 1.png";
import boxImage from "../../assets/packing-img/box_8040973 1.png";
import accessoriesImage from "../../assets/packing-img/accessories_1019178 1.png";
import healthcareImage from "../../assets/packing-img/healthcare_6202925 1.png";
import essentialsDetailImage from "../../assets/packing-detail-img/essentials.png";
import clothingDetailImage from "../../assets/packing-detail-img/clothing.png";
import toiletriesDetailImage from "../../assets/packing-detail-img/toiletries.png";
import healthDetailImage from "../../assets/packing-detail-img/health.png";
import packageBoxDetailImage from "../../assets/packing-detail-img/package-box.png";
import watchDetailImage from "../../assets/packing-detail-img/watch.png";

export const PACKING_LIST_STORAGE_KEY = "packing-list-category-state";

export const PACKING_CATEGORIES = [
  {
    key: "essentials",
    title: "Essentials",
    image: starImage,
    detailImage: essentialsDetailImage,
    items: [
      "Passport or ID",
      "Wallet and cards",
      "Phone charger",
      "Travel confirmations",
      "Boarding pass",
      "Headphones",
      "Power bank",
      "Reusable water bottle",
    ],
  },
  {
    key: "clothing",
    title: "Clothing",
    image: clothingImage,
    detailImage: clothingDetailImage,
    items: [
      "Tops (x4)",
      "Shorts (x2)",
      "Pants (x2)",
      "Underwear (x8)",
      "Dresses (x2)",
      "Sandals (x1)",
      "Pajamas (x3)",
      "Socks (x5)",
    ],
  },
  {
    key: "toiletries",
    title: "Toiletries",
    image: creamImage,
    detailImage: toiletriesDetailImage,
    items: [
      "Toothbrush",
      "Toothpaste",
      "Sunscreen",
      "Face wash",
      "Moisturizer",
      "Shampoo",
      "Conditioner",
      "Deodorant",
    ],
  },
  {
    key: "extras",
    title: "Extras",
    image: boxImage,
    detailImage: packageBoxDetailImage,
    items: [
      "Laundry bag",
      "Travel detergent",
      "Snacks",
      "Reading book",
      "Beach tote",
      "Notebook",
      "Camera",
      "Portable fan",
    ],
  },
  {
    key: "accessories",
    title: "Accessories",
    image: accessoriesImage,
    detailImage: watchDetailImage,
    items: [
      "Sunglasses",
      "Hat",
      "Jewelry pouch",
      "Watch",
      "Everyday bag",
      "Hair ties",
      "Belt",
      "Umbrella",
    ],
  },
  {
    key: "health",
    title: "Health & Safety",
    image: healthcareImage,
    detailImage: healthDetailImage,
    items: [
      "Prescription medicine",
      "Bandages",
      "Pain reliever",
      "Hand sanitizer",
      "Allergy medicine",
      "Insect repellent",
      "Face masks",
      "Disinfecting wipes",
    ],
  },
];

export const getPackingCategoryByKey = (key) =>
  PACKING_CATEGORIES.find((category) => category.key === key) || PACKING_CATEGORIES[0];
