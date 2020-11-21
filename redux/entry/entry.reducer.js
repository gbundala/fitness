import { EntryActionTypes } from "./entry.types";

const entryReducer = (state = {}, action) => {
  switch (action.type) {
    case EntryActionTypes.RECEIVE_ENTRIES:
      return {
        ...state,
        ...action.payload,
      };
    case EntryActionTypes.ADD_ENTRY:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default entryReducer;
