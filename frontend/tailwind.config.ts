import type { Config } from "tailwindcss";

const config: Config = {
  content: {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./dashboard/**/*.{js,ts,jsx,tsx,mdx}",
      "./orders/**/*.{js,ts,jsx,tsx,mdx}",
      "./services/**/*.{js,ts,jsx,tsx,mdx}",
      "./wallet/**/*.{js,ts,jsx,tsx,mdx}",
      "./settings/**/*.{js,ts,jsx,tsx,mdx}",
      "./profile/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#2563EB",
            foreground: "#FFFFFF",
          },
          secondary: {
            DEFAULT: "#3B82F6",
            foreground: "#FFFFFF",
          },
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
          background: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E5E7EB",
          dark: {
            background: "#0F172A",
            card: "#1E293B",
            text: "#F8FAFC",
          },
          muted: "#6B7280",
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
    plugins: [],
  },
};

export default config;
