import axios from 'axios';  //makes http requests from front end
import { setAlert } from './alert'; // communicates valuable info to user
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED, 
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL
} from './types';
import setAuthToken from '../utils/setAuthToken';

//Load User
export const loadUser=() => async dispatch => {
    if(localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const res = await axios.get('/api/auth');

        dispatch({
            type:USER_LOADED,
            payload:res.data
        })
    } catch (error) {
        dispatch({
            type:AUTH_ERROR
        })
    }
}

//Register user
export const register = ({ name, email, password }) => async dispatch => {  // 
    const config = {    // configures HTTP request headers and other options
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ name, email, password }); // input multiple variables, output one JSON object containing the variables in strings

    try { // make request
        const res = await axios.post('/api/users', body, config);   // makes POST http request to /api/users with the above body and config values

        dispatch({  // if promise is fulfilled successfully
            type: REGISTER_SUCCESS, // perform this function in the reducer
            payload: res.data   // use this data to update state
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;    // errors from the data in the response declared errors

        if(errors) {    // if there are errors 
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))    // for each error, perform setAlert action    
        }

        dispatch({
            type:REGISTER_FAIL  // perform this function in the reducer
        })
    }
}



//Login user
export const login = ( email, password ) => async dispatch => {  // 
    const config = {    // configures HTTP request headers and other options
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password }); // input multiple variables, output one JSON object containing the variables in strings

    try { // make request
        const res = await axios.post('/api/auth', body, config);   // makes POST http request to /api/users with the above body and config values

        dispatch({  // if promise is fulfilled successfully
            type: LOGIN_SUCCESS, // perform this function in the reducer
            payload: res.data   // use this data to update state
        });

        dispatch(loadUser());
    } catch (err) {
        const errors = err.response.data.errors;    // errors from the data in the response declared errors

        if(errors) {    // if there are errors 
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))    // for each error, perform setAlert action    
        }

        dispatch({
            type:LOGIN_FAIL  // perform this function in the reducer
        })
    }
}