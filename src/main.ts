import "./hmr";
import "./main.css";
import App from "./app.svelte";

const initializeServices = () : void => {
  //
};

initializeServices();

const app = new App({
  target: document.body,
});

export default app;
