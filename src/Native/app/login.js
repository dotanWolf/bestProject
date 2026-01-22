import { View, Text, TextInput } from "react-native";
import { styles } from "../styles/login.styles";
import Button from "../components/Button";
import Input from "../components/Input";
import { useState } from "react";
import { Link } from "expo-router";
import { useRouter } from "expo-router";

export default function Login() {
  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState([]);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP;
  const data = [
    {
      header: "Email",
      placeholder: "Email",
      validator: (input) => {
        return input;
      },
      invalidMessage: "Must be a valid email address",
    },
    {
      header: "Password",
      placeholder: "Password",
      validator: (input) => {
        return input.length >= 8;
      },
      invalidMessage: "Must be a valid password",
    },
  ];

  const currentData = data[step];

  const handleClick = async () => {
    const isValid = data[step].validator(input);
    if (isValid) {
      const updatedInput = [...userInput, input];
      setUserInput(updatedInput);
      if (step < data.length - 1) {
        setStep(step + 1);
        setInput("");
      } else {
        try {
          const tokenRes = await fetch(`http://${IP}:8080/api/tokens`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: updatedInput[0],
              password: updatedInput[1],
            }),
          });

          if (tokenRes.ok) {
            console.log("communicate correctly")
            const tokenData = await tokenRes.json();
            // localStorage.setItem("token", tokenData.token);
            // localStorage.setItem("userId", tokenData.userId);
            router.replace("/");
          }
          alert("Invalid credentials.");
        } catch (error) {
          // alert("communicate baddly");
        }
      }
    } else {
      alert(currentData.invalidMessage);
    }
  };

  const handleChangeText = (input) => {
    setInput(input);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.header}>{currentData.header}</Text>
        <Input
          text={currentData.placeholder}
          value={input}
          onChangeText={handleChangeText}
        ></Input>
      </View>
      <View style={styles.bottom}>
        <Button
          title="Signup"
          onPress={() => {
            router.replace("/signup");
          }}
        ></Button>
        <Button title="Next" onPress={handleClick}></Button>
      </View>
    </View>
  );
}
