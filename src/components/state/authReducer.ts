import React from 'react';

// コード補完を効かせるためにSymbol使用中
export const loginType = Symbol('login');
export const logoutType = Symbol('logout');

export interface AuthAction {
  type: typeof loginType | typeof logoutType;
}

export interface AuthState {
  isLogin: boolean;
}

const initialState: AuthState = { isLogin: false };

const reducer: React.Reducer<AuthState, AuthAction> = (state, action) => {
  switch (action.type) {
    case loginType:
      localStorage.setItem('login', 'true');
      return { isLogin: true };
    case logoutType:
      localStorage.setItem('login', '');
      return initialState;
    default:
      return state;
  }
};

export default {
  initialState,
  reducer,
};
