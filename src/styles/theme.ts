export const theme = {
  colors: {
    background: "#FFFFFF",
    card: "rgba(255, 255, 255, 0.65)",
    primary: "#000000", // Apple-style Solid Black
    secondary: "#1D1D1F", // Apple Charcoal
    text: "#1D1D1F",
    muted: "#6E6E73", // Apple Muted Gray
    border: "rgba(0, 0, 0, 0.08)",
    borderHover: "rgba(0, 0, 0, 0.15)",
    glassBg: "rgba(255, 255, 255, 0.55)",
    glassBorder: "rgba(0, 0, 0, 0.06)",
    
    gradients: {
      primary: "linear-gradient(90deg, #000000 0%, #1D1D1F 100%)",
      primaryHover: "linear-gradient(90deg, #1D1D1F 0%, #000000 100%)",
      glowPurple: "radial-gradient(circle, rgba(123, 97, 255, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
      glowLime: "radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, rgba(255, 255, 255, 0) 70%)",
      glowBlue: "radial-gradient(circle, rgba(0, 0, 0, 0.02) 0%, rgba(255, 255, 255, 0) 70%)",
      text: "linear-gradient(90deg, #7B61FF 0%, #3E52D5 40%, #00C6FF 70%, #10B981 100%)", // Purple, Blue, Green premium gradient
      cardHover: "linear-gradient(180deg, rgba(0, 0, 0, 0.01) 0%, rgba(0, 0, 0, 0.03) 100%)"
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
