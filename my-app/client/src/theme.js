// color design tokens export
export const tokensDark = {
  grey: {
    0: "#ffffff", // white (background)
    10: "#f7f7f7", // very light grey
    50: "#f0f0f0", // light grey
    100: "#e0e0e0", // light grey
    200: "#c0c0c0", // medium grey
    300: "#a0a0a0", // grey
    400: "#808080", // dark grey
    500: "#606060", // darker grey
    600: "#404040", // even darker grey
    700: "#303030", // very dark grey
    800: "#202020", // almost black
    900: "#101010", // near black
    1000: "#000000", // black
    1100: "#f8f9fa", // soft off-white background
    1200: "#2d2c3e", // sleek, dark muted purple (new background color)
    1300: "#3b3958", // darker muted purple for sidebar
  },
  primary: {
    100: "#f5f5f5", // very light grey
    200: "#e0e0e0", // light grey
    300: "#9e9e9e", // medium grey
    400: "#616161", // dark grey
    500: "#424242", // very dark grey (neutral accent)
    600: "#212121", // near black
  },
  secondary: {
    100: "#fce4ec",     // very light blush pink
    200: "#f8bbd0",     // light pink
    300: "#f48fb1",     // medium blush pink
    400: "#f06292",     // bright blush pink
    500: "#ec407a",     // vibrant pink (secondary)
    600: "#d81b60",     // rich fuchsia
    700: "#c2185b",     // strong magenta
    800: "#b0004f",     // dark fuchsia
},
};  
  
  // function that reverses the color palette
  function reverseTokens(tokensDark) {
    const reversedTokens = {};
    Object.entries(tokensDark).forEach(([key, val]) => {
      const keys = Object.keys(val);
      const values = Object.values(val);
      const length = keys.length;
      const reversedObj = {};
      for (let i = 0; i < length; i++) {
        reversedObj[keys[i]] = values[length - i - 1];
      }
      reversedTokens[key] = reversedObj;
    });
    return reversedTokens;
  }
  export const tokensLight = reverseTokens(tokensDark);
  
  // mui theme settings
  export const themeSettings = (mode) => {
    return {
      palette: {
        mode: mode,
        ...(mode === "dark"
          ? {
              // palette values for dark mode
              primary: {
                ...tokensDark.primary,
                main: tokensDark.primary[400],
                light: tokensDark.primary[400],
              },
              secondary: {
                ...tokensDark.secondary,
                main: tokensDark.secondary[300],
              },
              neutral: {
                ...tokensDark.grey,
                main: tokensDark.grey[500],
              },
              background: {
                default: tokensDark.grey[1200],
                alt: tokensDark.grey[1300],
              },
            }
          : {
              // palette values for light mode
              primary: {
                ...tokensLight.primary,
                main: tokensDark.grey[50],
                light: tokensDark.grey[100],
              },
              secondary: {
                ...tokensLight.secondary,
                main: tokensDark.secondary[600],
                light: tokensDark.secondary[700],
              },
              neutral: {
                ...tokensLight.grey,
                main: tokensDark.grey[500],
              },
              background: {
                default: tokensDark.grey[0],
                alt: tokensDark.grey[50],
              },
            }),
      },
      typography: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 40,
        },
        h2: {
          fontFamily: ["Open Sans", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 20,
        },
        h5: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 16,
        },
        h6: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 14,
        },
      },
    };
  };