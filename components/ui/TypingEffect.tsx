"use client";

import React, { useState, useEffect } from "react";

export function TypingEffect({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");
  const [i, setI] = React.useState(0);

  useEffect(() => {
    const typingEffect = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prevState) => prevState + text.charAt(i));
        setI(i + 1);
      } else {
        clearInterval(typingEffect);
      }
    }, 200);

    return () => {
      clearInterval(typingEffect);
    };
  }, [i]);

  return (
    <h1 className="text-center font-display text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]">
      {displayedText ? displayedText : ""}{" "}
      <span className="animate-pulse-fast">_</span>
    </h1>
  );
}
