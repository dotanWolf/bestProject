import { View, Text, Alert } from "react-native";
import { styles } from "../../styles/login.styles";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useState } from "react";
import { useRouter } from "expo-router";
import { saveToken, saveUserId, getToken } from "../../tokenUtil";

export default function Signup() {
  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState([]);
  const [step, setStep] = useState(0);
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
        // Final step - signup
        const user = {
          username: updatedInput[0],
          email: updatedInput[1],
          password: updatedInput[2],
          profileImage: "placeholder",
        };

        try {
          console.log("📝 Attempting signup...");
          
          const userRes = await fetch(`http://${IP}:8080/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          });

          if (userRes.ok) {
            console.log("✅ User created!");
            
            // Now login to get token
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
              
              console.log("✅ Login successful!");
              console.log("Token:", tokenData.token);
              console.log("UserId:", tokenData.userId);
              
              await saveToken(tokenData.token);
              await saveUserId(tokenData.userId);
              
              // Verify
              const savedToken = await getToken();
              console.log("✅ Token saved successfully:", !!savedToken);
              
              router.replace("/(tabs)");
            } else {
              Alert.alert("Error", "Account created but login failed");
            }
          } else {
            const err = await userRes.json();
            Alert.alert("Error", err.error || "Signup failed");
          }
        } catch (error) {
          console.error("❌ Signup error:", error);
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
          title="Login"
          onPress={() => router.push("/(auth)/login")}
        />
        <Button title="Next" onPress={handleClick} />
      </View>
    </View>
  );
}