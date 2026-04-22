import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)

app.use(router)
app.mount("#app")

const UPDATE_STATUS_EVENT = "app-update-status";
const updateStatus = {
  updateAvailable: false,
  enabled: "serviceWorker" in navigator && import.meta.env.PROD
};

const emitUpdateStatus = (partial = {}) => {
  Object.assign(updateStatus, partial);
  window.__APP_UPDATE_STATUS = { ...updateStatus };
  window.dispatchEvent(
    new CustomEvent(UPDATE_STATUS_EVENT, { detail: window.__APP_UPDATE_STATUS })
  );
};

emitUpdateStatus();

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", async () => {
    const SW_DEBUG = false;
    const swLog = (...args) => SW_DEBUG && console.log("[SW]", ...args);

    const { Workbox } = await import("workbox-window");
    const wb = new Workbox(`${import.meta.env.BASE_URL}sw.js`);

    wb.addEventListener("installing", () => swLog("installing"));
    wb.addEventListener("installed", (event) => {
      swLog("installed, isUpdate:", event.isUpdate);
      if (event.isUpdate) {
        emitUpdateStatus({ updateAvailable: true });
      }
    });
    wb.addEventListener("waiting", (event) => {
      swLog("waiting, isUpdate:", event.isUpdate);
      if (event.isUpdate) {
        emitUpdateStatus({ updateAvailable: true });
      }
    });
    wb.addEventListener("controlling", (event) => swLog("controlling, isUpdate:", event.isUpdate));
    wb.addEventListener("activated", (event) => {
      swLog("activated, isUpdate:", event.isUpdate);
      if (event.isUpdate) {
        emitUpdateStatus({ updateAvailable: true });
      }
    });

    const registration = await wb.register();
    if (!registration) return;
    swLog("registered:", registration);

    if (registration.waiting) {
      emitUpdateStatus({ updateAvailable: true });
    }

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