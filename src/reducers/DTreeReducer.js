import * as types from "../types/DTreeTypes";
import { Map, List } from "immutable";

const initialDtreeState = {
  featureClasses: Map({
    Passed: List(["Yes", "No"]),
    GPA: List(["4.0", "2.0"]),
    Language: List(["Python", "Java", "C++"])
  }),
  label: "Good Student",
  labelClasses: List(["Yes", "No"])
};

export function DTreeReducer(prevState = initialDtreeState, action) {
  const newState = Object.create(prevState, {});

  switch (action.type) {
    case types.ADD_FEATURE_CLASS:
      debugger;
      let newEntry = newState.featureClasses
        .get(action.feature)
        .push(action.modify);
      newState.featureClasses = newState.featureClasses.set(
        action.feature,
        newEntry
      );
      return newState;
    case types.DELETE_FEATURE_CLASS:
      newState.featureClasses = newState.featureClasses.set(
        action.feature,
        newState.featureClasses
          .get(action.feature)
          .filter(modValue => modValue !== action.modify)
      );
      if (newState.featureClasses.get(action.feature).length === 0)
        newState.featureClasses.delete(action.feature);
      return newState;
    case types.ADD_FEATURE:
      newState.featureClasses = newState.featureClasses.set(
        action.feature,
        List(["Sample"])
      );
      return newState;
    case types.DELETE_FEATURE:
      newState.featureClasses = newState.featureClasses.delete(action.feature);
      return newState;
    case types.ADD_LABEL_CLASS:
      newState.labelClasses = newState.labelClasses.push(action.className);
      return newState;
    case types.DELETE_LABEL_CLASS:
      newState.labelClasses = newState.labelClasses.filter(
        className => className !== action.className
      );
      return newState;
    case types.CHANGE_LABEL_NAME:
      newState.label = action.newName;
      return newState;
    case types.EDIT_FEATURE_NAME:
      const prevData = newState.featureClasses.get(action.oldName);
      newState.featureClasses = newState.featureClasses.delete(action.oldName);
      newState.featureClasses = newState.featureClasses.set(
        action.newName,
        prevData
      );
      return newState;
    default:
      break;
  }

  return prevState;
}
