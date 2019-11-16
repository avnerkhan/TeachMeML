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
