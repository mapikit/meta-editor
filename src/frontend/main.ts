import "./hmr";
import "./main.css";
import App from "./app.svelte";

const app = new App({
  target: document.body,
});

export default app;
