/*
Reducer logic for Association. Reducers handle state management throughout application
*/
import * as types from "../types/AssociationTypes";
import { List } from "immutable";

const initialAssociationState = {
  // List of all potential transactions
  transactionItems: List(["A", "B", "C", "D", "E"])
};

export function AssociationReducer(
  prevState = initialAssociationState,
  action
) {
  const newState = Object.create(prevState, {});

  switch (action.type) {
    case types.ADD_TRANSACTION_TYPE:
      const newTransactionItem =
        action.transactionItem.length > 0 ? action.transactionItem : "Z";
      if (!newState.transactionItems.includes(newTransactionItem)) {
        newState.transactionItems = newState.transactionItems.push(
          newTransactionItem
        );
      }
      return newState;
    case types.DELETE_TRANSACTION_TYPE:
      if (newState.transactionItems.size > 1) {
        newState.transactionItems = newState.transactionItems.filter(
          transactionItem => transactionItem !== action.transactionItem
        );
      }
      return newState;
    case types.EDIT_TRANSACTION_TYPE:
      const newTransactionItemEdit =
        action.transactionItem.length > 0 ? action.transactionItem : "Z";
      if (!newState.transactionItems.includes(newTransactionItemEdit)) {
        newState.transactionItems = newState.transactionItems.set(
          action.index,
          newTransactionItemEdit
        );
      }
      return newState;
    default:
      break;
  }

  return prevState;
}
