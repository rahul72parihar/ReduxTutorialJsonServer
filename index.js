import { applyMiddleware, createStore } from "redux";
import { combineReducers } from "redux-immer";
import produce from "immer";
import thunk from "redux-thunk";
import axios from "axios";

//action type
const commentsInit = "comments/init";
const postInitSuccess = "post/init/success";
const postInitPending = "post/init/pending";
const postInitFail = "post/init/fail";
const profileInit = "profile/init";

//reducers
const postReducer = (state = 0, action) => {
  switch (action.type) {
    case postInitSuccess:
      state = { ...action.data, pending: false };
      return state;
    case postInitPending:
      state = { ...state, pending: true };
      return state;
    case postInitFail:
      state = { ...state, pending: false };
      return state;
    default:
      return state;
  }
};
const commentsReducer = (state = 0, action) => {
  switch (action.type) {
    case commentsInit:
    default:
      return state;
  }
};
const profileReducer = (state = 0, action) => {
  switch (action.type) {
    case profileInit:
    default:
      return state;
  }
};

// Combine reducers and apply middleware
const store = createStore(
  combineReducers(produce, {
    post: postReducer,
    comments: commentsReducer,
    profile: profileReducer,
  }),
  applyMiddleware(thunk.default)
);

//action creator
const postActionSuccessful = (data) => {
  return { type: postInitSuccess, data: data };
};
const postActionFailed = () => {
  return { type: postInitFail };
};
const postActionPending = () => {
  return { type: postInitPending };
};

store.subscribe(() => console.log(store.getState()));

//thunk action
export function initializePosts(id) {
  return async function (dispatch, getState) {
    try {
      dispatch(postActionPending());
      const response = await axios.get(`http://localhost:3000/posts/${id}`);
      dispatch(postActionSuccessful(response.data));
    } catch {
      dispatch(postActionFailed());
    }
  };
}

//dispatch
store.dispatch(initializePosts(1));
