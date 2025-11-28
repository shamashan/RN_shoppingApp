import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { create } from "zustand";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import Wrapper from "@/components/Wrapper";
import Title from "@/components/Title";
import { AppColors } from "@/constants/theme";
import EmptyState from "@/components/EmptyState";
import OrderItem from "@/components/OrderItem";
import Toast from "react-native-toast-message";
import Loader from "@/components/Loader";

interface Order {
  id: number;
  total_price: number;
  payment_status: string;
  created_at: string;
  items: {
    product_id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

const Orders = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) {
      setError("Please login to see your orders.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from("orders")
        .select()
        .eq("user_email", user.email)
        .order("created_at", { ascending: false });
      if (error) {
        throw new Error(`Failed to fetch orders with error: ${error.message}`);
      }
      setOrders(data || []);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Error while loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  async function handleDeleteOrder(orderId: number) {
    try {
      if (!user) {
        throw new Error("Please login before");
      }
      const { data: order, error: fetcherror } = await supabase
        .from("orders")
        .select("id,user_email")
        .eq("id", orderId)
        .single();

      if (fetcherror || !order) {
        throw new Error("Order not found");
      }
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId);
      if (error) {
        throw new Error(`Order not deleted with error:$ ${error.message}`);
      }
      fetchOrders();
      Toast.show({
        text1: "Order deleted",
        type: "success",
        visibilityTime: 2000,
        position: "bottom",
      });
    } catch (error) {
      console.error("Error while deleting the order", error);
      Alert.alert("Error", "Order not deleted, Try again!");
    }
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Wrapper>
        <Title>My Orders</Title>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>My Orders</Title>
      {orders?.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ marginTop: 10, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              email={user?.email}
              onDelete={handleDeleteOrder}
              onViewDetails={() => {}}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          type="cart"
          message="You don't have any orders"
          actionLabel="Start Shopping"
          onAction={() => router.push("/(tabs)/shop")}
        />
      )}
    </Wrapper>
  );
};

export default Orders;

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: AppColors.error,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  listContainer: {
    paddingVertical: 16,
  },
});
