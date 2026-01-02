import { Eye, EyeClosed } from "lucide-react-native";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type InputType = "default" | "password";

interface InputProps {
  type?: InputType;
}

export default function Input({ type = "default" }: InputProps) {
  const [value, onChangeText] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordVisible = type === "password" && !showPassword;

  return (
    <View className="relative mb-4">
      <TextInput
        value={value}
        secureTextEntry={isPasswordVisible}
        onChangeText={(text) => onChangeText(text)}
        className="h-14 w-full rounded-xl border border-purple-700 bg-white pl-4 pr-12 font-[DMSansM] text-purple-700"
      />
      {type === "password" && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          className="absolute right-0 top-0 h-14 w-14 items-center justify-center"
        >
          {showPassword ? (
            <Eye color="#7e22ce" />
          ) : (
            <EyeClosed color="#7e22ce" />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
