import { combineReducers } from 'redux';
import alert from './alert';

export default combineReducers({    //The combineReducers helper function turns an object whose values are different reducing functions into a single reducing function you can pass to createStore.
    alert   //
})