import { Product } from "@/type";
const API_URL = "https://fakestoreapi.com";

export const getProducts = async() :Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        return  await response.json();
    } catch (error) {
        console.log(error)
        throw error;     
    }
};


export const getCategories = async() :Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products/categories`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        return  await response.json();
    } catch (error) {
        console.log(error)
        throw error;     
    }
};