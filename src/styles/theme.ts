export const theme = {
  colors: {
    background: "#050505",
    card: "#101010",
    primary: "#C7FF2F", // Neon Lime
    secondary: "#7B61FF", // Electric Purple
    text: "#FFFFFF",
    muted: "#B8B8B8",
    border: "rgba(255, 255, 255, 0.08)",
    borderHover: "rgba(199, 255, 47, 0.3)",
    glassBg: "rgba(16, 16, 16, 0.6)",
    glassBorder: "rgba(255, 255, 255, 0.05)",
    
    gradients: {
      primary: "linear-gradient(90deg, #C7FF2F 0%, #7B61FF 100%)",
      primaryHover: "linear-gradient(90deg, #7B61FF 0%, #C7FF2F 100%)",
      glowPurple: "radial-gradient(circle, rgba(123, 97, 255, 0.2) 0%, rgba(0, 0, 0, 0) 70%)",
      glowLime: "radial-gradient(circle, rgba(199, 255, 47, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
      glowBlue: "radial-gradient(circle, rgba(0, 224, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
      text: "linear-gradient(135deg, #FFFFFF 40%, #B8B8B8 100%)",
      cardHover: "linear-gradient(180deg, rgba(199, 255, 47, 0.05) 0%, rgba(123, 97, 255, 0.02) 100%)"
    }
  },
  fonts: {
    heading: "'Space Grotesk', sans-serif",
    body: "'Inter', sans-serif"
  },
  breakpoints: {
    mobile: "@media (max-width: 480px)",
    tablet: "@media (max-width: 768px)",
    laptop: "@media (max-width: 1024px)",
    desktop: "@media (min-width: 1025px)",
    custom: (width: number) => `@media (max-width: ${width}px)`
  },
  transitions: {
    default: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    slow: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
    bounce: "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
  }
};

export type ThemeType = typeof theme;
