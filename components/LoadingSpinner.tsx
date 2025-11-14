import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppColors } from "@/constants/theme";

interface LoadingSpinnerProps {
  size?: "small" | "large";
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "small",
  color = AppColors.primary[500],
  text = "Loading...",
  fullScreen = false,
}) => {
  if (fullScreen) {
  } else {
    return (
      <View style={styles.fullScreen}>
        <ActivityIndicator size={size} color={color} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  fullScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.text.primary,
  },
  text: {
    color: AppColors.text.primary,
    fontSize: 14,
    marginTop: 8,
  },
});
