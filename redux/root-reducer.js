import { combineReducers } from "redux";
import entryReducer from "./entry/entry.reducer";

const rootReducer = combineReducers({
  entry: entryReducer,
});

export default rootReducer;
