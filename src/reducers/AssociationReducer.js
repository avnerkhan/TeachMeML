import * as types from "../types/AssociationTypes";
import { List } from "immutable";

const initialAssociationState = {
  transactionItems: List(["A", "B", "C", "D", "E"])
};

export function AssociationReducer(
  prevState = initialAssociationState,
  action
) {
  const newState = Object.create(prevState, {});

  switch (action.type) {
    case types.ADD_TRANSACTION_TYPE:
      if (!newState.transactionItems.includes(action.transactionItem)) {
        newState.transactionItems = newState.transactionItems.push(
          action.transactionItem
        );
      }
      return newState;
    case types.DELETE_TRANSACTION_TYPE:
      newState.transactionItems = newState.transactionItems.filter(
        transactionItem => transactionItem !== action.transactionItem
      );
      return newState;
    case types.EDIT_TRANSACTION_TYPE:
      if (!newState.transactionItems.includes(action.transactionItem)) {
        newState.transactionItems = newState.transactionItems.set(
          action.index,
          action.transactionItem
        );
      }
      return newState;
    default:
      break;
  }

  return prevState;
}
