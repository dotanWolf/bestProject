import { View, Text, Alert } from "react-native";
import { styles } from "../../styles/login.styles";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";
import { useRouter } from "expo-router";
import { saveToken, saveUserId, getToken } from "../../tokenUtil";
import { useUser } from "../../contexts/UserContext";

export default function Login() {
  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState([]);
  const [step, setStep] = useState(0);
  const { refreshUser } = useUser();
  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP;

  const data = [
    {
      header: "Email",
      placeholder: "Email",
      validator: (input) => input && input.includes("@"),
      invalidMessage: "Must be a valid email address",
    },
    {
      header: "Password",
      placeholder: "Password",
      validator: (input) => input.length >= 8,
      invalidMessage: "Password must be at least 8 characters",
    },
  ];

  const currentData = data[step];

  const handleClick = async () => {
    const isValid = currentData.validator(input);
    
    if (isValid) {
      const updatedInput = [...userInput, input];
      setUserInput(updatedInput);
      
      if (step < data.length - 1) {
        setStep(step + 1);
        setInput("");
      } else {
        // Final step - login
        try {
          console.log("🔐 Attempting login...");
          
          const tokenRes = await fetch(`http://${IP}:8080/api/tokens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: updatedInput[0],
              password: updatedInput[1],
            }),
          });

          if (tokenRes.ok) {
            const tokenData = await tokenRes.json();
            
            console.log("✅ Login successful!");
            console.log("Token:", tokenData.token);
            console.log("UserId:", tokenData.userId);
            
            // Save token and userId
            await saveToken(tokenData.token);
            await saveUserId(tokenData.userId);
            await refreshUser();
            // Verify token was saved
            const savedToken = await getToken();
            console.log("✅ Token saved successfully:", !!savedToken);
            
            // Navigate to main app
            router.replace("/(tabs)");
          } else {
            const error = await tokenRes.json();
            console.error("❌ Login failed:", error);
            Alert.alert("Error", "Invalid email or password");
          }
        } catch (error) {
          console.error("❌ Login error:", error);
          Alert.alert("Error", "Could not connect to server");
        }
      }
    } else {
      Alert.alert("Invalid Input", currentData.invalidMessage);
    }
  };

  const handleChangeText = (text) => {
    setInput(text);
  };

  const handleBack = () => {
    if (step >= 1) {
      setStep(step - 1);
      setInput(userInput[step - 1] || "");
      setUserInput(userInput.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Button title="Back" onPress={handleBack} />
        <Text style={styles.header}>{currentData.header}</Text>
        <Input
          text={currentData.placeholder}
          value={input}
          onChangeText={handleChangeText}
          secureTextEntry={currentData.header === "Password"}
        />
      </View>
      <View style={styles.bottom}>
        <Button
          title="Sign Up"
          onPress={() => router.push("/(auth)/signup")}
        />
        <Button title="Next" onPress={handleClick} />
      </View>
    </View>
  );
}