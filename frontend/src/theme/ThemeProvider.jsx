// src/theme/ThemeProvider.jsx
import { createContext, useContext } from "react";
import { theme } from "./theme";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    return (
        <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
