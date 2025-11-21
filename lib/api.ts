import { Product } from "@/type";
const API_URL = "https://fakestoreapi.com";

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getCategories = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//single product
export const getProduct = async (id: number): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Network error!");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error featching product with id ${id}`, error);
    throw error;
  }
};

export const getProductByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/category/${category}`);
    if (!response.ok) {
      throw new Error("Network error!");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error featching product with id ${category}`, error);
    throw error;
  }
};

export const searchProductsApi = async (query: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error("Network error!");
    }

    const products = await response.json();
    const searchTerm = query.toLocaleLowerCase().trim();
    return products.filter(
      (product: Product) =>
        product.title.toLocaleLowerCase().includes(searchTerm) ||
        product.description.toLocaleLowerCase().includes(searchTerm) ||
        product.category.toLocaleLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error("Error while searching products", error);
    throw error;
  }
};
