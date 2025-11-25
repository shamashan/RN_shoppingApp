import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import HomeHeader from "@/components/HomeHeader";
import React, { useEffect, useState } from "react";
import { useProductsStore } from "@/store/productStore";
import { Product } from "@/type";
import LoadingSpinner from "@/components/LoadingSpinner";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "@/constants/theme";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ProductCard from "@/components/ProductCard";

export default function HomeScreen() {
  const router = useRouter();
  const [featureProducts, setFeaturesProducts] = useState<Product[]>([]);

  const {
    categories,
    products,
    fetchProducts,
    fetchCategories,
    loading,
    error,
  } = useProductsStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const reverseProducts = [...products].reverse();
      setFeaturesProducts(reverseProducts as Product[]);
    }
  }, [products]);
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <LoadingSpinner fullScreen />
        </View>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  function navigateToCategory(category: string): void {
    router.push({
      pathname: "/(tabs)/shop",
      params: {
        category,
      },
    });
  }

  return (
    <View style={styles.wrapper}>
      <HomeHeader />
      <View style={styles.contentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainerView}>
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories?.map((category) => (
                <TouchableOpacity
                  style={styles.categoryButton}
                  key={category}
                  onPress={() => navigateToCategory(category)}>
                  <AntDesign
                    name="tag"
                    size={16}
                    color={AppColors.primary[500]}
                  />
                  <Text style={styles.categoryText}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <View style={styles.featuredProductContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Best Seller</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Show All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={featureProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredProductsContainer}
              renderItem={({ item }) => (
                <View style={styles.featuredProductContainer}>
                  <ProductCard product={item} compact />
                </View>
              )}
              keyExtractor={(item) => item.id.toString()}></FlatList>
          </View>
          <View style={styles.newestSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Arrived</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Show All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {products.map((product) => (
                <View key={product.id} style={styles.productContainer}>
                  <ProductCard
                    product={product}
                    customStyle={{ width: "100%" }}
                  />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorText: {
    fontFamily: "Inter-Medium",
    color: AppColors.error,
    fontSize: 16,
    textAlign: "center",
  },
  contentContainer: {
    paddingLeft: 20,
  },
  scrollContainerView: {
    paddingBottom: 300,
  },
  categoryText: {
    marginLeft: 6,
    fontFamily: "Inter-Medium",
    fontSize: 12,
    color: AppColors.text.primary,
    textTransform: "capitalize",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingRight: 20,
  },
  sectionTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.primary[500],
  },
  categoriesSection: {
    marginTop: 10,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AppColors.background.secondary,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 5,
    minWidth: 100,
  },
  featuredProductsContainer: {},
  featuredProductContainer: {},
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  featuredSection: {
    marginVertical: 16,
  },
  newestSection: {
    marginVertical: 16,
    marginBottom: 32,
  },
  productContainer: {
    width: "48%",
  },
  seeAllText: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    color: AppColors.primary[500],
  },
});
