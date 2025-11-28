import { Stack } from "expo-router";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import { StripeProvider } from "@stripe/stripe-react-native";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const publishableKey =
    "pk_test_51SY2XnDFosP0XeaYiqtZxpAA6OZfTXpwXBEYdRcvpGSPu5y3OH5Jl6au0cEHtr2e0EW2cfYPTCeyUa9ArWmq43Yy00ZK6G0Y2X";
  return (
    <>
      <StripeProvider publishableKey={publishableKey}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} /> */}
        </Stack>
        <Toast />
      </StripeProvider>
    </>
  );
}
