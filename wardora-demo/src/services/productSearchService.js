export const productSearchEndpoint = import.meta.env.VITE_PRODUCT_SEARCH_ENDPOINT || "";

export function buildAiSearchQuery(criteria, generated) {
  return [
    criteria.audience,
    criteria.style,
    criteria.occasion,
    criteria.weather,
    criteria.colorMood,
    generated?.title,
    "haine livrare Romania",
  ]
    .filter(Boolean)
    .join(" ");
}

export async function searchLiveProducts({ criteria, generated, aiProfile }) {
  if (!productSearchEndpoint) {
    return {
      source: "curated",
      message: "Nu exista VITE_PRODUCT_SEARCH_ENDPOINT configurat. Folosesc catalogul si cautarile live catre magazine.",
      products: [],
    };
  }

  const response = await fetch(productSearchEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: buildAiSearchQuery(criteria, generated),
      criteria,
      generated,
      aiProfile,
      country: "RO",
      stores: ["zara.com/ro", "aboutyou.ro", "hm.com/ro_ro", "mango.com/ro/ro"],
    }),
  });

  if (!response.ok) {
    throw new Error("Cautarea live nu a raspuns corect.");
  }

  const data = await response.json();
  return {
    source: "live",
    message: "Rezultate live primite de la endpointul AI configurat.",
    products: Array.isArray(data.products) ? data.products : [],
  };
}
