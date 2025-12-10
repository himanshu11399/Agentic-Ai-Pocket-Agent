import color from "@/shared/color";
import { useEffect} from "react";
import { Text, View, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

export default function Index() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return; // wait until Clerk fully initializes

    if (user) {
      // user is logged in — go to home
      router.replace("/(tabs)/Home");
    }
  }, [isLoaded, user]);

  if (!isLoaded) {
    // show loading until Clerk finishes
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={color.PRIMARY} />
      </SafeAreaView>
    );
  }

  // if Clerk loaded but no user, show Get Started
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFFFFF" }}
    >
      <View style={{ alignItems: "center" }}>
        <Image
          style={{ width: 300, height: 300, resizeMode: "contain" }}
          source={require("../assets/images/ai-roboimag.jpg")}
        />

        <View>
          <Text
            style={{
              fontSize: 25,
              color: color.PRIMARY,
              fontWeight: "bold",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Welcome to AI Powered Agent
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: color.GREY,
              marginTop: 15,
            }}
          >
            Your Ultimate AI Personal Agent to make life easier
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              color: color.GREY,
            }}
          >
            Try it Today, Completely Free!
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <View
            style={{
              backgroundColor: color.PRIMARY,
              padding: 15,
              borderRadius: 10,
              marginTop: 30,
              width: 200,
            }}
          >
            <Text
              style={{
                color: color.WHITE,
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Get Started
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
