import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED, 
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from '../actions/types';

const initialState = {  
    token: localStorage.getItem('token'),   // if jwt is in local storage, get it
    isAuthenticated: null,  // not authenticated by default
    loading: true,  // loading by default
    user: null  // user unknown by default
}

export default function( state = initialState, action ) {
    const { type, payload } = action;   // deconstructing the variables in the action

    switch(type) {  // if type...
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated:true,
                loading:false,
                user:payload
            }
        case 'LOGIN_SUCCESS':
        case 'REGISTER_SUCCESS':    // ...is this...
            localStorage.setItem('token', payload.token);  //set token in client local storage to payload.token
            return {
                ...state,   // current state
                ...payload, // current payload
                isAuthenticated: true,  // successfully registered and thus authenticated
                loading: false, 
            }
        case 'LOGIN_FAIL':
        case 'AUTH_ERROR':
        case 'REGISTER_FAIL': // ...is this...
            localStorage.removeItem('token');  // remove token
            return {
                ...state,   // current state
                token:null, // no token
                isAuthenticated: false, // not auth
                loading: false, // not loading
            }
        default:
            return state;
    }
}