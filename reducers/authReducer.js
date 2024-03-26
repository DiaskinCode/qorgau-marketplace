// reducers/authReducer.js

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'LOGOUT':
      // Handle logout action if needed
      return initialState;
    // Add other cases for different actions
    default:
      return state;
  }
};

export default authReducer;
