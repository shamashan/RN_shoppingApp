import { Alert, StyleSheet, Text, View } from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";

type Props = {
  paymentIntent: string;
  ephemeralKey: string;
  customer: string;
  orderId: string;
  userEmail: string;
  onSuccess?: () => void;
};

const StripePayment = ({
  paymentIntent,
  ephemeralKey,
  customer,
  orderId,
  userEmail,
  onSuccess,
}: Props) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const router = useRouter();
  const returnURL = Linking.createURL("/(tabs)/orders");
  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: paymentIntent,
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      merchantDisplayName: "Shopego Store",
      returnURL: returnURL,
    });
    if (error) {
      throw new Error(`Error while initializing payment sheet: ${error}`);
    }
  };
  const updatePaymentStatus = async () => {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: "success" })
      .eq("id", orderId)
      .select();

    if (error) {
      throw new Error(`Error while initializing payment sheet: ${error}`);
    }
  };

  const handlePayment = async () => {
    try {
      await initializePaymentSheet();
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        throw new Error(`Payment failed: ${presentError.message}`);
      }
      await updatePaymentStatus();
      Alert.alert("Payment successful!", "Thank you for your command", [
        {
          text: "OK",
          onPress: () => {
            onSuccess?.() || router.push("/(tabs)/orders");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Payment failed");
      console.log("Payment failed:", error);
    }
  };

  return {
    handlePayment,
  };
};

export default StripePayment;
