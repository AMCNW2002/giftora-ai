/**
 * Product list now lives in MongoDB (served by the FastAPI backend: GET /api/products).
 * Only the category filter list stays here because it is just UI labels.
 */
export const categories = [
  { id: "all", label: "All Gifts" },
  { id: "personalized", label: "Personalized" },
  { id: "flowers", label: "Flowers" },
  { id: "jewelry", label: "Jewelry" },
  { id: "hampers", label: "Hampers" },
  { id: "tech", label: "Tech" }
];
