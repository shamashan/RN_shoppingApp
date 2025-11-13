import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { AppColors } from "@/constants/theme";

const Logo = () => {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.logoView} onPress={() => router.push("/")}>
      <MaterialIcons
        name="shopping-cart"
        size={30}
        color={AppColors.primary[700]}
      />
      <Text style={styles.logoText}>ShopeGo</Text>
    </TouchableOpacity>
  );
};

export default Logo;

const styles = StyleSheet.create({
  logoView: {
    flexDirection: "row",
    padding: 10,
  },
  logoText: {
    color: AppColors.primary[700],
    fontSize: 20,
    fontFamily: "Inter-Bold",
    marginLeft: 2,
  },
});
