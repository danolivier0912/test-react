import Fluxible from "fluxible";
import { RouteStore } from "fluxible-router";

import routes from "./routes";
import Application from "./Application";
import GridStore from "../stores/GridStore";

// Create the fluxible app using Application as root component
const app = new Fluxible({ component: Application });

// Register a fluxible RouteStore
const AppRouteStore = RouteStore.withStaticRoutes(routes);
app.registerStore(AppRouteStore);

// Stores
app.registerStore(GridStore);

export default app;
