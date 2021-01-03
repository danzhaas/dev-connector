import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';    // middleware allows us to make async requests in our actions
import rootReducer from './reducers'    // our reducers

const initialState = {};
const middleware = [thunk];
const store = createStore(
    rootReducer, 
    initialState, 
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;