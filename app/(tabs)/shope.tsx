import { StyleSheet, Text, View } from "react-native";
import React, { use, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";

const ShopeScreen = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("https://fakestoreapi.com", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setProducts(data);

      console.log(data);
    };
    getProducts();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>ShopeScreen</Text>
      </View>
    </SafeAreaView>
  );
};

export default ShopeScreen;

// const styles = StyleSheet.create({});
