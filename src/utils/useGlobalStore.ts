import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useGlobalStore = create(
    persist(
        (set) => ({
            loading: false,
            setLoading: (value) => set(() => ({ loading: value })),
            darkMode: false,
            setDarkMode: (value) => set(() => ({ darkMode: value })),
            sizes: [50, 50],
            setSizes: (value) => set(() => ({ sizes: value })),
        }), {
        name: 'calcbot-storage',
        partialize: (state) => ({
            darkMode: state.darkMode,
            sizes: state.sizes,
        })
    })
);