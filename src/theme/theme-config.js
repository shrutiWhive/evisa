// ----------------------------------------------------------------------

export const themeConfig = {
  /** **************************************
   * Base
   *************************************** */
  direction: "ltr",
  defaultMode: "light",
  modeStorageKey: "theme-mode",
  classesPrefix: "minimal",
  /** **************************************
   * Typography
   *************************************** */
  fontFamily: {
    primary: "Public Sans Variable",
    secondary: "Barlow",
  },
  /** **************************************
   * Palette
   *************************************** */
  palette: {
    primary: {
      lighter: "#E0F5FF",
      light: "#66CCFF",
      main: "#00A6FF",
      dark: "#007ACC",
      darker: "#005999",
      contrastText: "#ffffff",
    },
    secondary: {
      lighter: "#D6DCF0",
      light: "#7087C5",
      main: "#1F3F97",
      dark: "#182F6E",
      darker: "#111F45",
      contrastText: "#ffffff",
    },
    info: {
      lighter: "#CAFDF5",
      light: "#61F3F3",
      main: "#00B8D9",
      dark: "#006C9C",
      darker: "#003768",
      contrastText: "#FFFFFF",
    },
    success: {
      lighter: "#D3FCD2",
      light: "#77ED8B",
      main: "#22C55E",
      dark: "#118D57",
      darker: "#065E49",
      contrastText: "#ffffff",
    },
    warning: {
      lighter: "#FFF5CC",
      light: "#FFD666",
      main: "#FFAB00",
      dark: "#B76E00",
      darker: "#7A4100",
      contrastText: "#1C252E",
    },
    error: {
      lighter: "#FFE9D5",
      light: "#FFAC82",
      main: "#FF5630",
      dark: "#B71D18",
      darker: "#7A0916",
      contrastText: "#FFFFFF",
    },
    grey: {
      50: "#FCFDFD",
      100: "#F9FAFB",
      200: "#F4F6F8",
      300: "#DFE3E8",
      400: "#C4CDD5",
      500: "#919EAB",
      600: "#637381",
      700: "#454F5B",
      800: "#1C252E",
      900: "#141A21",
    },
    common: { black: "#000000", white: "#FFFFFF" },
  },
  /** **************************************
   * Css variables
   *************************************** */
  cssVariables: {
    cssVarPrefix: "",
    colorSchemeSelector: "data-color-scheme",
  },
};
