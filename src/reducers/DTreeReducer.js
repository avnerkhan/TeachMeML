import * as types from "../types/DTreeTypes";
import { Map, List } from "immutable";

const initialDtreeState = {
  features: List(["Passed", "GPA", "Language"]),
  featureClasses: Map({
    Passed: List(["Yes", "No"]),
    GPA: List(["4.0", "2.0"]),
    Language: List(["Python", "Java", "C++"]),
    label: List([0, 1])
  }),
  label: "Label",
  labelClasses: List(["1", "0"])
};

export function DTreeReducer(prevState = initialDtreeState, action) {
  const newState = Object.create(prevState, {});

  switch (action.type) {
    case types.ADD_FEATURE_CLASS:
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
      newState.features = newState.features.push(action.feature);
      newState.featureClasses = newState.featureClasses.set(
        action.feature,
        List(["Sample"])
      );
      return newState;
    case types.DELETE_FEATURE:
      newState.features = newState.features.filter(
        featureName => featureName !== action.feature
      );
      newState.featureClasses = newState.featureClasses.delete(action.feature);
      return newState;
    default:
      break;
  }

  return prevState;
}
