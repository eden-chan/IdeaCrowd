import Template from "./Template"
import { types } from "mobx-state-tree";

/**
 * A RootStore model.
 */
// prettier-ignore
const RootStore = types.model("RootStore").props({
  templateStore: types.optional(Template, {}),
});

export default RootStore;

