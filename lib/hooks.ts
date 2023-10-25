"use client";

import { useEffect, useRef } from "react";

export function usePrevious(value: any) {
  let ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
