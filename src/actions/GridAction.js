import Actions from "../app/Actions";

export default {
  load(context) {
    context.dispatch(Actions.LOAD_GRID);
  },
};