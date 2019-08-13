import * as types from "../types/DTreeTypes";
import { Map, List } from "immutable";

const initialDtreeState = {
  dataLabels: List(["Passed", "GPA", "Language"]),
  labelClasses: Map({
    Passed: List(["Yes", "No"]),
    GPA: List(["4.0", "2.0"]),
    Language: List(["Python", "Java", "C++"]),
    label: List([0, 1])
  })
};

export function DTreeReducer(prevState = initialDtreeState, action) {
  const newState = Object.create(prevState, {});

  switch (action.type) {
    case types.ADD_DATA_CLASS:
      let newEntry = newState.labelClasses
        .get(action.feature)
        .push(action.modify);
      newState.labelClasses = newState.labelClasses.set(
        action.feature,
        newEntry
      );
      return newState;
    case types.DELETE_DATA_CLASS:
      newState.labelClasses = newState.labelClasses.set(
        action.feature,
        newState.labelClasses
          .get(action.feature)
          .filter(modValue => modValue !== action.modify)
      );
      if (newState.labelClasses.get(action.feature).length === 0)
        newState.labelClasses.delete(action.feature);
      return newState;
    case types.ADD_DATA_LABEL:
      newState.dataLabels = newState.dataLabels.push(action.feature);
      newState.labelClasses = newState.labelClasses.set(
        action.feature,
        List(["Sample"])
      );
      return newState;
    case types.DELETE_DATA_LABEL:
      newState.dataLabels = newState.dataLabels.filter(
        featureName => featureName !== action.feature
      );
      newState.labelClasses = newState.labelClasses.delete(action.feature);
      return newState;
    default:
      break;
  }

  return prevState;
}
