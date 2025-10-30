import React from "react";
import "./Button.css";

export function Button({ children, className, variant = "solid", ...props }) {
  const baseStyle = "button-base";
  let style = "";

  if (variant === "outline") {
    style = "button-outline";
  } else {
    style = "button-solid";
  }

  return (
    <button className={`${baseStyle} ${style} ${className}`} {...props}>
      {children}
    </button>
  );
}
