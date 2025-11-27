import {
  Alert,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { Product } from "@/type";
import { AppColors } from "@/constants/theme";
import Button from "./Button";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import Rating from "./Rating";
import { useCartStore } from "@/store/cartStore";
import { useFavoritesStore } from "@/store/favoriteStore";
import { AntDesign } from "@expo/vector-icons";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  customStyle?: StyleProp<ViewStyle>;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  compact,
  customStyle,
}) => {
  const { id, title, price, category, image, rating } = product;
  const { addItem } = useCartStore();
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const isFav = isFavorite(id);

  function handleAddToCart(): void {
    // e.stopPropagation();
    addItem(product, 1);
    Toast.show({
      type: "success",
      text1: `${title} Added to cart 👋`,
      text2: "Go the the cart to finalize your order",
      visibilityTime: 2000,
    });
  }

  function handleToggleFavorite(): void {
    toggleFavorite(product);
  }

  function handleProductRoute(e: any): void {
    router.push(`/product/${id}`);
  }

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.compactCard, customStyle]}
      onPress={handleProductRoute}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={[styles.favoriteButton]}>
          <AntDesign
            name="heart"
            size={18}
            color={isFav ? AppColors.error : AppColors.text.secondary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text>{category}</Text>
        <Text
          style={styles.title}
          numberOfLines={compact ? 1 : 2}
          ellipsizeMode="tail">
          {title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
          <View style={!compact && { marginBottom: 7 }}>
            <Rating rating={rating?.rate} count={rating?.count}></Rating>
          </View>
          {!compact && (
            <Button
              title="Add to Cart"
              size="small"
              variant="outline"
              onPress={handleAddToCart}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.primary[600],
    marginBottom: 5,
  },
  footer: {
    // flexDirection: 'row',
    justifyContent: "space-between",
    // alignItems: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: AppColors.text.primary,
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    color: AppColors.text.tertiary,
    textTransform: "capitalize",
    marginBottom: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    position: "relative",
    height: 150,
    backgroundColor: AppColors.background.primary,
    padding: 5,
  },
  compactCard: {
    width: 150,
    marginRight: 12,
  },
  content: {
    padding: 12,
    backgroundColor: AppColors.background.secondary,
  },
  card: {
    backgroundColor: AppColors.background.primary,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    width: "48%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: AppColors.gray[200],
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 18,
    padding: 2,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderColor: AppColors.error,
  },
  ratingText: {
    marginBottom: 8,
    textTransform: "capitalize",
    color: AppColors.gray[600],
  },
});
