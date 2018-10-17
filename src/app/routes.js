import HomePage from "./HomePage";
import GridAction from "../actions/GridAction";

export default {
  home: {
    path: "/",
    method: "get",
    handler: HomePage,
    action: (context, route, done) => context.executeAction(GridAction.load)
  },
};