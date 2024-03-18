/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        DEFAULT: '0 6px 6px -2px rgb(0 0 0 / 0.4);',
        light: '0 3px 6px -2px rgb(0 0 0 / 0.24);',
        contrast: '0 3px 5px -1px rgb(0 0 0 / 0.5);'
      }
    },
    fontFamily: {
      sans: ['Dosis', 'sans-serif'],
      titles: ['Livvic', 'sans-serif']
    },
    colors: {
      white: "#ececfe",
      offWhite: "#9ba2bc8c",
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
        100: "#485a8f",
        200: "#233058",
        300: "#192341",
        350: "#ff00f4",
        400: "#12172e",
        500: "#0c1022"
      },
      transparent: "#00000000"
    }
  },
  plugins: [],
}
