import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SearchParams } from '@/domain/entities/SearchParams';

interface SearchState {
  params: SearchParams | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  params: null,
  isLoading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<SearchParams>) => {
      state.params = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearSearch: (state) => {
      state.params = null;
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const { setSearchParams, setLoading, setError, clearSearch } =
  searchSlice.actions;
export default searchSlice.reducer;


