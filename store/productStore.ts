import {
  getCategories,
  getProductByCategory,
  getProducts,
  searchProductsApi,
} from "@/lib/api";
import { Product } from "@/type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface ProductsState {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  loading: boolean;
  error: string | null;
  selectedCategory: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  setCategory: (category: string | null) => Promise<void>;
  searchProducts: (query: string) => void;
  sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => void;
  searchProductsRealtime: (query: string) => void;
}

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      filteredProducts: [],
      categories: [],
      loading: false,
      error: null,
      selectedCategory: null,
      fetchProducts: async () => {
        try {
          set({ loading: true, error: null });
          const products = await getProducts();
          set({ products, filteredProducts: products, loading: false });
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },
      fetchCategories: async () => {
        try {
          set({ loading: true, error: null });
          const categories = await getCategories();
          set({ categories, loading: false });
        } catch (error: any) {
          set({ loading: false, error: error.message });
        }
      },
      setCategory: async (category: string | null) => {
        try {
          set({ selectedCategory: category, loading: true, error: null });
          if (category) {
            set({ loading: true, error: null });
            const products = await getProductByCategory(category);
            set({ filteredProducts: products, loading: false });
          } else {
            set({ filteredProducts: get().products, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
      searchProducts: (query: string) => {
        const searchTerm = query.toLowerCase().trim();
        const { products, selectedCategory } = get();

        let filtered = products;

        if (selectedCategory) {
          filtered = products.filter(
            (product) => product.category === selectedCategory
          );
        }

        if (searchTerm) {
          filtered = filtered.filter(
            (product) =>
              product.title.toLowerCase().includes(searchTerm) ||
              product.description.toLowerCase().includes(searchTerm) ||
              product.category.toLowerCase().includes(searchTerm)
          );
        }

        set({ filteredProducts: filtered });
      },
      sortProducts: (sortBy: "price-asc" | "price-desc" | "rating") => {
        const { filteredProducts } = get();
        let sorted = [...filteredProducts];
        switch (sortBy) {
          case "price-asc":
            sorted.sort((a, b) => a.price - b.price);
            break;
          case "price-desc":
            sorted.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            sorted.sort((a, b) => b.rating.rate - a.rating.rate);
            break;
          default:
            break;
        }
        set({ filteredProducts: sorted });
      },
      searchProductsRealtime: async (query: string) => {
        try {
          set({ loading: true, error: null });
          if (query?.length >= 3) {
            const searchResults = await searchProductsApi(query);
            set({ filteredProducts: searchResults, loading: false });
          } else {
            set({ filteredProducts: [], loading: false });
          }
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
