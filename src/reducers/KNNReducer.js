import * as types from "../types/KNNTypes";
import { List } from "immutable";

const initialKNNState = {
  labels: List(["#32CD32", "#FF6347", "#0000FF"])
};

export function KNNReducer(prevState = initialKNNState, action) {
  const newState = Object.create(prevState, {});

  switch (action.type) {
    case types.ADD_LABEL_CLASS:
      if (!newState.labels.includes(action.classColor)) {
        newState.labels = newState.labels.push(action.classColor);
      }
      return newState;
    case types.DELETE_LABEL_CLASS:
      newState.labels = newState.labels.filter(
        classColor => classColor !== action.classColor
      );
      return newState;
    case types.CHANGE_LABEL_COLOR:
      if (!newState.labels.includes(action.newColor)) {
        newState.labels = newState.labels.set(action.index, action.newColor);
      }
      return newState;
    default:
      break;
  }

  return prevState;
}
