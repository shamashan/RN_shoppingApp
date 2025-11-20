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
