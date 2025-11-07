import { Product } from "@/types/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FavoritesState = {
  items: Record<number, Product>;
};

const loadFromStorage = (): FavoritesState => {
  try {
    const data = localStorage.getItem("favorites");
    return data ? JSON.parse(data) : { items: {} };
  } catch {
    return { items: {} };
  }
};

const saveToStorage = (state: FavoritesState) => {
  try {
    localStorage.setItem("favorites", JSON.stringify(state));
  } catch {
    // ignore
  }
};

const initialState: FavoritesState =
  typeof window !== "undefined" ? loadFromStorage() : { items: {} };

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Product>) {
      if (!action.payload.id) return;
      state.items[action.payload.id] = action.payload;
      saveToStorage(state);
    },
    removeFavorite(state, action: PayloadAction<number>) {
      delete state.items[action.payload];
      saveToStorage(state);
    },
    toggleFavorite(state, action: PayloadAction<Product>) {
      if (!action.payload.id) return;
      if (state.items[action.payload.id]) {
        delete state.items[action.payload.id];
      } else {
        state.items[action.payload.id] = action.payload;
      }
      saveToStorage(state);
    },
    clearFavorites(state) {
      state.items = {};
      saveToStorage(state);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
