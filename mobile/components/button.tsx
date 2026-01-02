import React from "react";
import { TouchableOpacity, Text } from "react-native";

interface ButtonProps {
  children?: React.ReactNode;
}

export default function Button({ children }: ButtonProps) {
  return (
    <TouchableOpacity className="bg-purple-700 rounded-md p-3">
      {children}
    </TouchableOpacity>
  );
}
