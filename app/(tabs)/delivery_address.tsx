import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppColors } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import Button from "@/components/Button";
import MainLayout from "@/components/MainLayout";

const DeliveryAddressScreen: React.FC = () => {
  const { user } = useAuthStore();
  const router = useRouter();

  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastOrder = async () => {
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("id")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setLoading(false);
      if (error) {
        Alert.alert("Error", "Error while fetching your order");
      } else if (data) {
        setOrderId(data.id);
      }
    };
    fetchLastOrder();
  }, [user]);

  const handleAddAddress = async () => {
    if (!user?.email) {
      Alert.alert("Error", "You are not logged in");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "The address can't be empty");
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("orders")
      .update({ delivery_address: address })
      .eq("user_email", user.email);

    setLoading(false);
    if (error) {
      console.log(error);
      Alert.alert("Error", "The address can't be added");
    } else {
      Alert.alert("Success", "The address has been added");
      router.back();
    }
  };
  return (
    // <MainLayout>
    <View style={styles.container}>
      <Text style={styles.containerTitle}>Add an address</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre adresse"
        value={address}
        onChangeText={setAddress}
        multiline
        editable={!loading}
      />
      <Button
        onPress={handleAddAddress}
        title={loading ? "Loading..." : "Add Address"}
        fullWidth
        style={styles.button}
      />
    </View>
    // </MainLayout>
  );
};

export default DeliveryAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: AppColors.background.primary,
    paddingTop: Platform.OS === "ios" ? 60 : 0,
  },
  containerTitle: {
    fontFamily: "Inter-Bold",
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    height: 100,
    borderColor: AppColors.gray[300],
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 16,
  },
});
