import { create } from "zustand";

export const useWatchlistsDataStore = create((set) => ({
  watchlists: [],

  updateWatchlists: (watchlists) => set({ watchlists }),

  updateWatchlistWithTitle: (title, newStock) =>
    set((state) => {
      const updatedWatchlists = state.watchlists.map((watchlist) =>
        watchlist.title === title
          ? { ...watchlist, stocks: [...watchlist.stocks, newStock] }
          : watchlist
      );
      return { watchlists: updatedWatchlists };
    }),
}));
