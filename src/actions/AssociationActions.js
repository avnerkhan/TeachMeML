import * as types from "../types/AssociationTypes";

export function deleteTransactionType(transactionItem) {
  return {
    type: types.DELETE_TRANSACTION_TYPE,
    transactionItem
  };
}

export function addTransactionType(transactionItem) {
  return {
    type: types.ADD_TRANSACTION_TYPE,
    transactionItem
  };
}

export function editTransactionType(transactionItem, index) {
  return {
    type: types.EDIT_TRANSACTION_TYPE,
    transactionItem,
    index
  };
}
