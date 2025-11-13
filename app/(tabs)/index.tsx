import { StyleSheet, Text, View } from "react-native";

import HomeHeader from "@/components/HomeHeader";
import { useState } from "react";

export default function HomeScreen() {
  const [featureProducts, setFeaturesProducts] = useState();
  return (
    <View>
      <HomeHeader />
    </View>
  );
}

const styles = StyleSheet.create({});
