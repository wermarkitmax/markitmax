import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { gsap } from "gsap";

const CursorContainer = styled.div<{ active: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: #C7FF2F;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  mix-blend-mode: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 8px;
  font-weight: 700;
  color: #050505;
  letter-spacing: 0.05em;
  opacity: 0;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const CursorRing = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  opacity: 0;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorText, setCursorText] = useState("");
  const [active, setActive] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    // Show custom cursor when mouse moves
    const onFirstMove = () => {
      gsap.to([cursor, ring], { opacity: 1, duration: 0.3 });
      window.removeEventListener("mousemove", onFirstMove);
    };
    window.addEventListener("mousemove", onFirstMove);

    // Track mouse coordinates with quickTo for maximum performance
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3.out" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3.out" });
    
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToRing(e.clientX);
      yToRing(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Mouse hover logic for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;
      
      // Check if target or its parent is interactive or has custom cursor data
      const interactiveEl = target.closest("[data-cursor]");
      const buttonEl = target.closest("button, a, input, select, textarea");

      if (interactiveEl) {
        const text = interactiveEl.getAttribute("data-cursor") || "";
        setCursorText(text);
        setActive(true);
        
        // Expand core cursor
        gsap.to(cursor, {
          width: 70,
          height: 70,
          backgroundColor: "#C7FF2F",
          mixBlendMode: "normal",
          color: "#050505",
          fontSize: "10px",
          duration: 0.3,
          ease: "power2.out"
        });
        
        // Hide secondary ring
        gsap.to(ring, {
          scale: 0,
          opacity: 0,
          duration: 0.2
        });
      } else if (buttonEl) {
        // Blend mode difference and expand slightly for generic buttons
        gsap.to(cursor, {
          width: 45,
          height: 45,
          backgroundColor: "#FFFFFF",
          mixBlendMode: "difference",
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(ring, {
          width: 55,
          height: 55,
          borderColor: "#C7FF2F",
          borderWidth: "1.5px",
          duration: 0.3
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof target.closest !== "function") return;
      
      const interactiveEl = target.closest("[data-cursor]");
      const buttonEl = target.closest("button, a, input, select, textarea");

      if (interactiveEl || buttonEl) {
        setCursorText("");
        setActive(false);
        
        gsap.to(cursor, {
          width: 20,
          height: 20,
          backgroundColor: "#C7FF2F",
          mixBlendMode: "normal",
          duration: 0.3,
          ease: "power2.out"
        });
        
        gsap.to(ring, {
          scale: 1,
          width: 40,
          height: 40,
          borderColor: "rgba(255, 255, 255, 0.3)",
          borderWidth: "1px",
          opacity: 1,
          duration: 0.3
        });
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", onFirstMove);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <>
      <CursorContainer ref={cursorRef} active={active}>
        {cursorText}
      </CursorContainer>
      <CursorRing ref={ringRef} />
    </>
  );
}
