import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(router)
app.mount("#app")

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", async () => {
    const { Workbox } = await import("workbox-window");
    const wb = new Workbox(`${import.meta.env.BASE_URL}sw.js`);
    wb.register();
  });
}