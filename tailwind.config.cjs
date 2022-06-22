/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts}",
  ],
  theme: {
    colors: {
      white: "#ffffff",
      offWhite: "#d7d7e5",
      darkLead: "#37375b",
      crystalBlue: "#9feffa",
      roseRed: "#f73b5b",
      ochreYellow: "#ffaf35",
      brightGreen: "#3cf691",
      deepPurple: "#501be4",
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
        100: "#676799",
        200: "#505073",
        300: "#34344b",
        400: "#2c2c44"
      },
      graphite: {
        100: "#343447",
        200: "#202031",
        300: "#191928",
        400: "#13131f",
        500: "#0e0e16",
        600: "#08080d",
      },

    }
  },
  plugins: [],
}
