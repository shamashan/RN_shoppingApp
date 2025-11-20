import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import CommonHeader from "@/components/CommonHeader";
import { AppColors } from "@/constants/theme";
import { getProduct } from "@/lib/api";
import { Product } from "@/type";

const SingleProductScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const data = await getProduct(Number(id));
        setProduct(data);
      } catch (error) {
        setError("Failed to fetch product data");
        console.error("Error fetching product data", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProductData();
    }
  }, [id]);

  return (
    <View style={styles.headerContainerStyle}>
      <CommonHeader />
    </View>
  );
};

export default SingleProductScreen;

const styles = StyleSheet.create({
  headerContainerStyle: {
    paddingTop: 30,
    backgroundColor: AppColors.background.primary,
  },
});
