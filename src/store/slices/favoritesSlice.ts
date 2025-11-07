import { Product } from '@/types/product'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'



type FavoritesState = {
 items: Record<number, Product>
}


const initialState: FavoritesState = { items: {} }


const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
addFavorite(state, action: PayloadAction<Product>) {
    if (!action.payload.id) return
    state.items[action.payload.id] = action.payload
    },
 removeFavorite(state, action: PayloadAction<number>) {
 delete state.items[action.payload]
},
toggleFavorite(state, action: PayloadAction<Product>) {
    if (!action.payload.id) return
    if (state.items[action.payload.id]) delete state.items[action.payload.id]
    else state.items[action.payload.id] = action.payload
},
},
})


export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions
export default favoritesSlice.reducer