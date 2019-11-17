import * as types from "../types/DTreeTypes";

export function addFeature(feature) {
  return {
    type: types.ADD_FEATURE,
    feature
  };
}

export function deleteFeature(feature) {
  return {
    type: types.DELETE_FEATURE,
    feature
  };
}

export function addFeatureClass(feature, modify) {
  return {
    type: types.ADD_FEATURE_CLASS,
    feature,
    modify
  };
}

export function deleteFeatureClass(feature, modify) {
  return {
    type: types.DELETE_FEATURE_CLASS,
    feature,
    modify
  };
}

export function deleteLabelClass(className) {
  return {
    type: types.DELETE_LABEL_CLASS,
    className
  };
}

export function addLabelClass(className) {
  return {
    type: types.ADD_LABEL_CLASS,
    className
  };
}

export function changeLabelName(newName) {
  return {
    type: types.CHANGE_LABEL_NAME,
    newName
  };
}
