import clsx from "clsx";
import React from "react";
import { Text, TouchableOpacity } from "react-native";

type ButtonVariants = "default" | "outline";

interface ButtonProps {
  children?: React.ReactNode;
  variant?: ButtonVariants;
}

const baseStyles = "items-center justify-center rounded-xl h-14 w-full";
const textBase = "text-lg font-[DMSansSB]";

const buttonVariantStyles = {
  default: "bg-purple-700",
  outline: "bg-white border-2 border-purple-700",
};

const textVariantStyles = {
  default: "text-white",
  outline: "text-purple-700",
};

export default function Button({ children, variant = "default" }: ButtonProps) {
  const buttonStyles = clsx(baseStyles, buttonVariantStyles[variant]);
  const textStyles = clsx(textBase, textVariantStyles[variant]);
  return (
    <TouchableOpacity activeOpacity={0.8} className={buttonStyles}>
      <Text className={textStyles}>{children}</Text>
    </TouchableOpacity>
  );
}
