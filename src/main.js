import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(router)
app.mount("#app")

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", async () => {
    const SW_DEBUG = false;
    const swLog = (...args) => SW_DEBUG && console.log("[SW]", ...args);

    const { Workbox } = await import("workbox-window");
    const wb = new Workbox(`${import.meta.env.BASE_URL}sw.js`);
    let hasShownUpdatePrompt = false;

    wb.addEventListener("installing", () => swLog("installing"));
    wb.addEventListener("installed", (e) => swLog("installed, isUpdate:", e.isUpdate));
    wb.addEventListener("waiting", (e) => swLog("waiting, isUpdate:", e.isUpdate));
    wb.addEventListener("controlling", (e) => swLog("controlling, isUpdate:", e.isUpdate));
    wb.addEventListener("activated", (event) => {
      swLog("activated, isUpdate:", event.isUpdate);
      if (event.isUpdate && !hasShownUpdatePrompt) {
        hasShownUpdatePrompt = true;
        const shouldReload = window.confirm(
          "A new version of the app is available. Reload now?"
        );
        if (shouldReload) {
          window.location.reload();
        }
      }
    });

    const registration = await wb.register();
    if (!registration) return;
    swLog("registered:", registration);

    const checkForUpdates = () => {
      swLog("checking for updates...");
      registration.update().catch(() => {});
    };

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        checkForUpdates();
      }
    });
  });
}