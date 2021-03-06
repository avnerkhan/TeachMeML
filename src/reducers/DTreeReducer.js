/*
Reducer logic for decision tree. Reducers handle state management throughout application
*/

import * as types from "../types/DTreeTypes";
import { Map, List } from "immutable";

const initialDtreeState = {
  // Holds bottom and top ranges for each attribute, and whether or not is currently toggled to continous
  continousClasses: Map({
    Passed: List([false, 0, 100]),
    GPA: List([false, 0, 100]),
    Language: List([false, 0, 100])
  }),
  // Holds all potential labels for each feature, if categorical
  featureClasses: Map({
    Passed: List(["Yes", "No"]),
    GPA: List(["4.0", "2.0"]),
    Language: List(["Python", "Java", "C++"])
  }),
  // Current name of label
  label: "Good Student",
  // Classifcations of label
  labelClasses: List(["Yes", "No"])
};

export function DTreeReducer(prevState = initialDtreeState, action) {
  const newState = Object.create(prevState, {});

  switch (action.type) {
    case types.ADD_FEATURE_CLASS:
      const newClass = action.modify.length > 0 ? action.modify : "Blank";
      let newEntry = newState.featureClasses.get(action.feature).push(newClass);
      newState.featureClasses = newState.featureClasses.set(
        action.feature,
        newEntry
      );
      return newState;
    case types.DELETE_FEATURE_CLASS:
      if (newState.featureClasses.get(action.feature).size > 1) {
        newState.featureClasses = newState.featureClasses.set(
          action.feature,
          newState.featureClasses
            .get(action.feature)
            .filter(modValue => modValue !== action.modify)
        );
        if (newState.featureClasses.get(action.feature).size === 0)
          newState.featureClasses.delete(action.feature);
      }
      return newState;
    case types.ADD_FEATURE:
      const newFeatureName =
        action.feature.length > 0 ? action.feature : "Blank";
      newState.featureClasses = newState.featureClasses.set(
        newFeatureName,
        action.classes
      );
      newState.continousClasses = newState.continousClasses.set(
        newFeatureName,
        action.continousClasses
      );
      return newState;
    case types.DELETE_FEATURE:
      if (newState.featureClasses.size > 1) {
        newState.featureClasses = newState.featureClasses.delete(
          action.feature
        );
        newState.continousClasses = newState.continousClasses.delete(
          action.feature
        );
      }
      return newState;
    case types.ADD_LABEL_CLASS:
      const newLabelClassName =
        action.className > 0 ? action.className : "Blank";
      newState.labelClasses = newState.labelClasses.push(newLabelClassName);
      return newState;
    case types.DELETE_LABEL_CLASS:
      if (newState.labelClasses.size > 1) {
        newState.labelClasses = newState.labelClasses.filter(
          className => className !== action.className
        );
      }
      return newState;
    case types.CHANGE_LABEL_NAME:
      const newName = action.newName.length > 0 ? action.newName : "Blank";
      newState.label = newName;
      return newState;
    case types.EDIT_FEATURE_NAME:
      const newNameEdit = action.newName.length > 0 ? action.newName : "Blank";
      const prevData = newState.featureClasses.get(action.oldName);
      const prevContinousData = newState.continousClasses.get(action.oldName);
      newState.featureClasses = newState.featureClasses.delete(action.oldName);
      newState.featureClasses = newState.featureClasses.set(
        newNameEdit,
        prevData
      );
      newState.continousClasses = newState.continousClasses.delete(
        action.oldName
      );
      newState.continousClasses = newState.continousClasses.set(
        newNameEdit,
        prevContinousData
      );
      return newState;
    case types.SET_CONTINOUS_ATTRIBUTE_RANGE:
      const bottomRange =
        action.bottomRange.length > 0 ? action.bottomRange : 0;
      const topRange = action.topRange.length > 0 ? action.topRange : 100;
      const currentToggleState = newState.continousClasses
        .get(action.feature)
        .get(0);
      newState.continousClasses = newState.continousClasses.set(
        action.feature,
        List([currentToggleState, bottomRange, topRange])
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

    case types.CLEAR_ALL_ATTRIBUTES:
      newState.continousClasses = Map({});
      newState.featureClasses = Map({});
      newState.label = "";
      newState.labelClasses = List([]);
      return newState;
    default:
      break;
  }

  return prevState;
}
