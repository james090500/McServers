import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";

// Pages
import McServers from "./McServers.vue";
import HomePage from "./pages/HomePage.vue";
import AddServerPage from "./pages/AddServerPage.vue";
import ServerPage from "./pages/ServerPage.vue";

// Create Vue App
const app = createApp(McServers);

// Include Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";

// Axios
import axios from "axios";
app.config.globalProperties.axios = axios;

// FontAwesome
import { FontAwesomeIcon, FontAwesomeLayers } from "./fontawesome";
app.component("font-awesome-icon", FontAwesomeIcon);
app.component("font-awesome-layers", FontAwesomeLayers);

// Router
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/server/add", component: AddServerPage },
    { path: "/server/:hash", component: ServerPage }
  ],
});
app.use(router);

// Mount Vue app
app.mount("#app");
