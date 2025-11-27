import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppColors } from "@/constants/theme";
import { useProductsStore } from "@/store/productStore";
import Wrapper from "@/components/Wrapper";
import TextInput from "@/components/TextInput";
import { AntDesign } from "@expo/vector-icons";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import ProductCard from "@/components/ProductCard";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeOutRef = useRef<number | null>(null);
  const {
    filteredProducts,
    loading,
    error,
    fetchProducts,
    searchProductsRealtime,
  } = useProductsStore();

  useEffect(() => {
    if (filteredProducts?.length === 0) {
      fetchProducts();
    }
    return () => {
      if (searchTimeOutRef.current) {
        clearTimeout(searchTimeOutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    if (searchTimeOutRef.current) {
      clearTimeout(searchTimeOutRef.current);
    }
    if (searchQuery.length >= 3) {
      searchTimeOutRef.current = setTimeout(() => {
        searchProductsRealtime(text);
      }, 500);
    } else {
      searchProductsRealtime("");
    }
  };

  function handleClearSearch() {
    setSearchQuery("");
    searchProductsRealtime("");
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>Find a product</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                value={searchQuery}
                onChangeText={handleSearchChange}
                placeholder="Search for a product"
                style={styles.searchInput}
                inputStyle={styles.searchInputStyle}
              />
              {searchQuery?.length > 0 && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearSearch}>
                  <AntDesign
                    name="close"
                    size={16}
                    color={AppColors.gray[500]}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Wrapper>
      {renderHeader()}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <View>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </View>
      ) : filteredProducts?.length === 0 && searchQuery ? (
        <EmptyState type="search" message="No products match you search" />
      ) : (
        <FlatList
          data={searchQuery ? filteredProducts : []}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            !searchQuery ? (
              <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyStateContainer}>
                  Insert at least 3 letters to search for a product
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <ProductCard product={item} customStyle={{ width: "100%" }} />
            </View>
          )}
        />
      )}
    </Wrapper>
  );
};

export default Search;

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
    backgroundColor: AppColors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[200],
  },
  title: {
    fontFamily: "Inter-Bold",
    fontSize: 24,
    color: AppColors.text.primary,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    // flex: 1,
  },
  searchContainer: {
    flex: 1,
  },
  inputWrapper: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },

  searchInput: {
    marginBottom: 0,
    flex: 1,
  },
  searchInputStyle: {
    backgroundColor: AppColors.background.secondary,
    borderRadius: 8,
    borderColor: "transparent",
    paddingRight: 40,
  },
  clearButton: {
    position: "absolute",
    right: 12,
    height: 24,
    width: 24,
    borderRadius: 12,
    backgroundColor: AppColors.gray[200],
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  searchButton: {
    backgroundColor: AppColors.primary[500],
    borderRadius: 8,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  productsGrid: {
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productContainer: {
    width: "48%",
    marginBottom: 16,
  },
  footer: {
    height: 100,
  },
  errorContainer: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: AppColors.error,
    fontSize: 16,
    textAlign: "center",
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: AppColors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
  },
});
