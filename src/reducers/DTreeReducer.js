import * as types from "../types/DTreeTypes";
import { Map, List } from "immutable";

const initialDtreeState = {
  continousClasses: Map({
    Passed: List([false, 0, 100]),
    GPA: List([false, 0, 100]),
    Language: List([false, 0, 100])
  }),
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
      newState.continousClasses = newState.continousClasses.set(
        action.feature,
        [0, 100]
      );
      return newState;
    case types.DELETE_FEATURE:
      newState.featureClasses = newState.featureClasses.delete(action.feature);
      newState.continousClasses = newState.continousClasses.delete(
        action.feature
      );
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
      const prevContinousData = newState.continousClasses.get(action.oldName);
      newState.featureClasses = newState.featureClasses.delete(action.oldName);
      newState.featureClasses = newState.featureClasses.set(
        action.newName,
        prevData
      );
      newState.continousClasses = newState.continousClasses.delete(
        action.oldName
      );
      newState.continousClasses = newState.continousClasses.set(
        action.newName,
        prevContinousData
      );
      return newState;
    case types.SET_CONTINOUS_ATTRIBUTE_RANGE:
      const currentToggleState = newState.continousClasses
        .get(action.feature)
        .get(0);
      newState.continousClasses = newState.continousClasses.set(
        action.feature,
        List([currentToggleState, action.bottomRange, action.topRange])
      );
      return newState;
    case types.TOGGLE_CONTINOUS_ATTRIBUTE:
      const currentToggleStateOther = newState.continousClasses
        .get(action.feature)
        .get(0);
      const currentBottomRange = newState.continousClasses
        .get(action.feature)
        .get(1);
      const currentTopRange = newState.continousClasses
        .get(action.feature)
        .get(2);

      newState.continousClasses = newState.continousClasses.set(
        action.feature,
        List([!currentToggleStateOther, currentBottomRange, currentTopRange])
      );

      return newState;

    default:
      break;
  }

  return prevState;
}
