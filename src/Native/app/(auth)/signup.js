import { View, Text, TextInput } from "react-native";
import { styles } from "../../styles/login.styles";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { use, useState } from "react";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { saveToken, getToken, removeToken, saveUserId } from "../../tokenUtil";

export default function Login() {
  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState([]);
  const [step, setStep] = useState(0);
  const router = useRouter();
  const IP = process.env.EXPO_PUBLIC_IP;

  const data = [
    {
      header: "username",
      placeholder: "Username",
      validator: (input) => {
        return input;
      },
      invalidMessage: "Must not be empty",
    },
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
        const user = {
          username: updatedInput[0],
          email: updatedInput[1],
          password: updatedInput[2],
          // profileImage: updatedInput[3],
          profileImage: "placeholder",
        };

        try {
          const userRes = await fetch(`http://${IP}:8080/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          });

          if (userRes.ok) {
            try {
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
                // localStorage.setItem("token", tokenData.token);
                // localStorage.setItem("userId", tokenData.userId);
                await saveToken(tokenData.token);
                await saveUserId(tokenData.userId);
                router.replace("/");
              }
            } catch (error) {
              console.log(error);
            }
          } else {
            const err = await userRes.json();
            alert("Sign up failed: " + (err.error || "Unknown error"));
          }
        } catch (error) {
          alert("Server connection failed");
        }
      }
    } else {
      alert(currentData.invalidMessage);
    }
  };

  const handleChangeText = (input) => {
    setInput(input);
  };

  const handleBack = () => {
    if (step >= 1) setStep(step - 1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Button title="back" onPress={handleBack}></Button>
        <Text style={styles.header}>{currentData.header}</Text>
        <Input
          text={currentData.placeholder}
          value={input}
          onChangeText={handleChangeText}
        ></Input>
      </View>
      <View style={styles.bottom}>
        <Button
          title="Login"
          onPress={() => {
            router.replace("/login");
          }}
        ></Button>

        <Button title="Next" onPress={handleClick}></Button>
      </View>
    </View>
  );
}
