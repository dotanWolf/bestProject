import { View, Text, TextInput } from "react-native";
import { styles } from "../styles/login.styles";
import Button from "../components/Button";
import Input from "../components/Input";
import { use, useState } from "react";
import { Link } from "expo-router";
import { useRouter } from "expo-router";

export default function Login() {
  const [input, setInput] = useState("");
  const [userInput, setUserInput] = useState([]);
  const [step, setStep] = useState(0);
  const router = useRouter();
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
          profileImage: updatedInput[3],
        };

        try {
          const userRes = await fetch(`${API_URL}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
          });

          if (userRes.ok) {
            try {
              const tokenRes = await fetch(`${API_URL}/api/tokens`, {
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
