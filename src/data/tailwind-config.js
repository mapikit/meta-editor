/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: "0 4px 19px -8px rgb(3 3 12 / 0.31);",
        light: "0 3px 6px -2px rgb(0 0 0 / 0.24);",
        contrast: "0 3px 5px -1px rgb(0 0 0 / 0.5);",
      },
      backgroundImage: {
        "global-bg-gradient": "linear-gradient(172deg, rgba(12, 12, 38, 1) 0%,rgba(21, 21, 55, 1) 100%)",
        "card-gradient": "linear-gradient(12deg, rgba(23, 24, 59, 1) 0%,rgba(33, 38, 74, 1) 90%)",
        "sidebar-gradient": "linear-gradient(90deg, rgba(23, 24, 59, 1) 0%,rgba(33, 38, 74, 1) 480%)",
        "panel-gradient": "linear-gradient(192deg, rgba(23, 24, 59, 1) 0%,rgba(33, 38, 74, 1) 90%)",
      },
    },
    fontFamily: {
      sans: ["Dosis", "sans-serif"],
      titles: ["Livvic", "sans-serif"],
    },
    colors: {
      white: "#ececfe",
      offWhite: "#a6a8c08c",
      roseRed: {
        light: "#ea6e91",
        lighter: "#f6b0c3",
        DEFAULT: "#e7325f",
      },
      ochreYellow: {
        light: "#fbc46c",
        lighter: "#fadca8",
        DEFAULT: "#ff9c01",
      },
      brightGreen: {
        light: "#74ffac",
        lighter: "#a5ffca",
        DEFAULT: "#3cff88",
      },
      crystalBlue: {
        light: "#93f4f6",
        lighter: "#93f4f6",
        DEFAULT: "#3ae6ec",
      },
      royalBlue: {
        light: "#6f7ce4",
        lighter: "#b3bffc",
        DEFAULT: "#584df4",
      },
      date: "#fd83ef",
      function: "#fd4ca4",
      any: "#fc3c45",
      array: "#ff782b",
      enum: "#fae534",
      number: "#a5fb3d",
      boolean: "#128afc",
      string: "#303aea",
      object: "#7c12ff",
      cloudedObject: "#995cff",
      schemas: "#5d8efe",
      bops: "#fde084",
      protocol: "#ff5c8e",
      norbalt: {
        100: "#454c7c",
        200: "#323862",
        300: "#21264a",
        350: "#ff00f4",
        400: "#151537",
        500: "#10102e",
      },
      transparent: "#00000000",
    },
  },
  plugins: [],
};
