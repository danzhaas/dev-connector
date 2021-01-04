import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

// alerts will be objects with an id, message, and action type

const initialState = [] // alerts will be empty be default

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case 'SET_ALERT':
            return [...state, payload];
        case 'REMOVE_ALERT': 
            return state.filter(alert => alert.id !== payload); // returns an array with all items except the one matching the specified id.
        default:
            return state;
    }
}