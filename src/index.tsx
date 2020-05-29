import * as ReactDOM from "react-dom";
import App from "./App";
import "./styles.scss";
import { Store } from "./store";
import React from "react";

export const store = new Store();
const mountNode = document.getElementById("app");

ReactDOM.render(<App store={store} />, mountNode);

if (module.hot) { module.hot.accept("./App", () => {
  ReactDOM.render(<App store={store} />, mountNode);
});}
