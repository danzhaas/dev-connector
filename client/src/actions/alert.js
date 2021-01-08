import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {   //dispatches this to the reducer
    const id=uuidv4();  // randomly generated alert ID
    dispatch({
        type: SET_ALERT, // states which path of the dispatcher the payload will be delivered on
        payload: { msg, alertType, id}  // unites alert data in one object
    });

    setTimeout(() => dispatch({ type:REMOVE_ALERT, payload: id }), timeout) // after an amount of time, do remove alert action
};
