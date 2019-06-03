// @flow
declare type HistoryFunctions = {
  +push: Function,
  +replace: Function
};

// NOTE: Below are duplicated from react-router. If updating these, please
// update the react-router and react-router-native types as well.
declare type Location = {
  pathname: string,
  search: string,
  hash: string,
  state?: any,
  key?: string
};
