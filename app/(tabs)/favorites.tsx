import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { useFavoritesStore } from "@/store/favoriteStore";
import HomeHeader from "@/components/HomeHeader";
import { AppColors } from "@/constants/theme";
import Wrapper from "@/components/Wrapper";
import { Product } from "@/type";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import MainLayout from "@/components/MainLayout";

const Favorites = () => {
  const router = useRouter();
  const { favoriteItems, resetFavorite } = useFavoritesStore();

  function navigateToProducts(): void {
    router.push("/(tabs)/shop");
  }

  if (favoriteItems.length === 0) {
    return (
      <MainLayout>
        <EmptyState
          type="favorites"
          message="You haven't added any products to favorite"
          actionLabel="Continue Shopping"
          onAction={navigateToProducts}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {favoriteItems?.length > 0 && (
        <View>
          <View style={styles.headerView}>
            <View style={styles.header}>
              <Text style={styles.title}> My Favorite Items</Text>
              <Text style={styles.itemCount}>
                {favoriteItems?.length} items
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => resetFavorite()}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={favoriteItems}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productsGrid}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={styles.footer}></View>}
            renderItem={({ item }) => (
              <View style={styles.productContainer}>
                <ProductCard product={item} customStyle={{ width: "100%" }} />
              </View>
            )}
          />
        </View>
      )}
    </MainLayout>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background.primary,
  },
  headerView: {
    paddingBottom: 5,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  header: {},
  resetText: {
    color: AppColors.error,
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    color: AppColors.text.primary,
  },
  itemCount: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: AppColors.text.secondary,
    marginTop: 2,
  },
  productsGrid: {
    paddingTop: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
  },
  footer: {
    height: 100,
  },
});
