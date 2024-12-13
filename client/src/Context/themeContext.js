import React, { createContext, useMemo, useState } from "react"
import { darkTheme, lightTheme } from "../compnent/theme";
import { light } from "@mui/material/styles/createPalette";
import App from "../App";
import { CssBaseline, ThemeProvider } from "@mui/material";

export const  themeContext = createContext();

const CustomThemeProvider = ({children}) => {
    const [isDark, setIsDark] = useState(false);

    const toggleTheme = () => {
        setIsDark(!isDark);
    }

    const theme = useMemo(() => (isDark ? darkTheme : lightTheme), [isDark])
  return (
   <themeContext.Provider value={{isDark, toggleTheme}}>
    <ThemeProvider theme={theme}>
        <CssBaseline/>
        { children }
    </ThemeProvider>
   </themeContext.Provider>
      
  )
};

export default CustomThemeProvider;

