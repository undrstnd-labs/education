"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const useScrollAnchor = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const visibilityRef = useRef<HTMLDivElement>(null);

  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (messagesRef.current) {
      if (isAtBottom && !isVisible) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              messagesRef.current?.scrollIntoView({
                block: "end",
                behavior: "smooth",
              });
            } else {
              setIsVisible(false);
            }
          },
          { threshold: 1.0 }
        );
        observer.observe(messagesRef.current);
        return () => {
          observer.disconnect();
        };
      }
    }
  }, [isAtBottom, isVisible]);

  //FIXME: Fix the isAtBottom always true and fix the scrollref
  useEffect(() => {
    const { current } = scrollRef;

    if (current) {
      const handleScroll = (event: Event) => {
        const target = event.target as HTMLDivElement;
        const offset = 50;
        const isAtBottom =
          target.scrollHeight - target.scrollTop <=
          target.clientHeight + offset;

        console.log(isAtBottom);
        setIsAtBottom(isAtBottom);
      };

      current.addEventListener("scroll", handleScroll, {
        passive: true,
      });

      return () => {
        current.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (visibilityRef.current) {
      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
            } else {
              setIsVisible(false);
            }
          });
        },
        {
          rootMargin: "0px 0px -150px 0px",
        }
      );

      observer.observe(visibilityRef.current);

      return () => {
        observer.disconnect();
      };
    }
  });

  return {
    messagesRef,
    scrollRef,
    visibilityRef,
    scrollToBottom,
    isAtBottom,
    isVisible,
  };
};