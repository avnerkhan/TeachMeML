import * as types from "../types/DTreeTypes";

export function addDataLabel(feature) {
  return {
    type: types.ADD_DATA_LABEL,
    feature
  };
}

export function deleteDataLabel(feature) {
  return {
    type: types.DELETE_DATA_LABEL,
    feature
  };
}

export function addDataClass(feature, modify) {
  return {
    type: types.ADD_DATA_CLASS,
    feature,
    modify
  };
}

export function deleteDataClass(feature, modify) {
  return {
    type: types.DELETE_DATA_CLASS,
    feature,
    modify
  };
}
