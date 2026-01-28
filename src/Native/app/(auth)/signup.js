import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { saveToken, saveUserId } from "../../tokenUtil";
import { styles } from "../../styles/login.styles"; // Assumes your existing styles
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useUser } from "../../contexts/UserContext";

export default function Signup() {
  const { refreshUser } = useUser();
  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState([]);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP;

  const data = [
    {
      header: "Username",
      placeholder: "Username",
      validator: (input) => input.length >= 3,
      invalidMessage: "Username must be at least 3 characters",
    },
    {
      header: "Email",
      placeholder: "Email",
      validator: (email) => {
        const indexOfAt = email.indexOf("@");
        if (indexOfAt <= 0) {
          // alert("wrong email format");
          return false;
        }
        if (email.substr(indexOfAt + 1) !== "gmail.com") {
          // alert("wrong email format");
          return false;
        }
        return true;
      },
      // validator: (input) => input && input.includes("@"),
      invalidMessage: "Must be a valid email address",
    },
    {
      header: "Password",
      placeholder: "Password",
      validator: (input) => input.length >= 8,
      invalidMessage: "Password must be at least 8 characters",
    },
    {
      header: "Profile Picture",
      placeholder: "",
      validator: () => true, // Optional step
      invalidMessage: "",
    },
  ];

  const currentData = data[step];

  const pickImage = async (useCamera = false) => {
    const permissionMethod = useCamera
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;

    const { status } = await permissionMethod();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your device to set a profile picture.",
      );
      return;
    }

    const result = await (
      useCamera
        ? ImagePicker.launchCameraAsync
        : ImagePicker.launchImageLibraryAsync
    )({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.4, // Compressed for server stability
      base64: true,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setBase64Image(result.assets[0].base64);
    }
  };

  const handleNext = async () => {
    // If it's the final step (Image), submit the form
    if (step === 3) {
      submitSignup();
      return;
    }

    // Validation for text steps
    const isValid = currentData.validator(input);

    if (isValid) {
      const updatedInput = [...userInput, input];
      setUserInput(updatedInput);
      setStep(step + 1);
      setInput("");
    } else {
      Alert.alert("Invalid Input", currentData.invalidMessage);
    }
  };

  const submitSignup = async () => {
    setLoading(true);
    const user = {
      username: userInput[0],
      email: userInput[1],
      password: userInput[2],
      profileImage: base64Image || "placeholder",
    };

    try {
      // 1. Create User
      const userRes = await fetch(`http://${IP}:8080/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (userRes.ok) {
        // 2. Login to get token
        const tokenRes = await fetch(`http://${IP}:8080/api/tokens`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            password: user.password,
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          await saveToken(tokenData.token);
          await saveUserId(tokenData.userId);
          await refreshUser();
          router.replace("/(tabs)");
        } else {
          Alert.alert("Success", "Account created! Please log in.");
          router.replace("/login");
        }
      } else {
        const err = await userRes.json();
        Alert.alert("Error", err.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", "Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step >= 1) {
      setStep(step - 1);
      const prevValue = userInput[step - 1];
      setInput(prevValue || "");
      setUserInput(userInput.slice(0, -1));
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={localStyles.headerRow}>
          <TouchableOpacity onPress={handleBack}>
            <Text style={{ color: "#007AFF", fontSize: 16 }}>Back</Text>
          </TouchableOpacity>
          <Text style={localStyles.stepText}>Step {step + 1} of 4</Text>
        </View>

        <Text style={styles.header}>{currentData.header}</Text>

        {step < 3 ? (
          <Input
            text={currentData.placeholder}
            value={input}
            onChangeText={setInput}
            secureTextEntry={currentData.header === "Password"}
          />
        ) : (
          <View style={localStyles.imageStepContainer}>
            <TouchableOpacity
              onPress={() => pickImage(false)}
              style={localStyles.avatarFrame}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={localStyles.avatarImage}
                />
              ) : (
                <View style={localStyles.placeholderCircle}>
                  <Text style={localStyles.placeholderText}>TAP TO SELECT</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={localStyles.imageActionRow}>
              <TouchableOpacity
                style={localStyles.smallBtn}
                onPress={() => pickImage(false)}
              >
                <Text>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={localStyles.smallBtn}
                onPress={() => pickImage(true)}
              >
                <Text>Camera</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <View style={styles.bottom}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <>
            <Button
              title="Already have an account?"
              onPress={() => router.push("/(auth)/login")}
            />
            <Button
              title={step === 3 ? "Finish" : "Next"}
              onPress={handleNext}
            />
          </>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  stepText: {
    color: "gray",
    fontSize: 12,
  },
  imageStepContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  avatarFrame: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  placeholderCircle: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "bold",
  },
  imageActionRow: {
    flexDirection: "row",
    gap: 15,
    marginTop: 25,
  },
  smallBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#eef2f3",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});
