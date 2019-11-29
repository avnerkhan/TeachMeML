import * as types from "../types/KNNTypes";
import { List } from "immutable";

const initialKNNState = {
  labels: List(["#32CD32", "#FF6347", "#0000FF"])
};

export function KNNReducer(prevState = initialKNNState, action) {
  const newState = Object.create(prevState, {});

  switch (action.type) {
    case types.ADD_LABEL_COLOR:
      const newColor =
        action.classColor.length > 0 ? action.classColor : "#FFFFFF";
      if (!newState.labels.includes(newColor)) {
        newState.labels = newState.labels.push(newColor);
      }
      return newState;
    case types.DELETE_LABEL_COLOR:
      if (newState.labels.size > 1) {
        newState.labels = newState.labels.filter(
          classColor => classColor !== action.classColor
        );
      }
      return newState;
    case types.CHANGE_LABEL_COLOR:
      const newColorEdit =
        action.newColor.length > 0 ? action.newColor : "#FFFFFF";
      if (!newState.labels.includes(newColorEdit)) {
        newState.labels = newState.labels.set(action.index, newColorEdit);
      }
      return newState;
    default:
      break;
  }

  return prevState;
}
