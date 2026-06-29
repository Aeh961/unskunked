import { useEffect, useMemo, useState } from "react";
import { Favorite, FavoriteType, getFavorites, toggleFavorite } from "@/src/utils/localStore";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    getFavorites().then(setFavorites);
  }, []);

  const favoriteKeys = useMemo(() => new Set(favorites.map((item) => `${item.type}:${item.id}`)), [favorites]);

  async function toggle(type: FavoriteType, id: string) {
    const next = await toggleFavorite({ type, id });
    setFavorites(next);
  }

  function isFavorite(type: FavoriteType, id: string) {
    return favoriteKeys.has(`${type}:${id}`);
  }

  return { favorites, isFavorite, toggle };
}
