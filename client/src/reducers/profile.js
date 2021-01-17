import { 
    PROFILE_ERROR,
    GET_PROFILE,
    GET_PROFILES,
    CLEAR_PROFILE,
    UPDATE_PROFILE,
    GET_REPOS
} from '../actions/types';

const initialState = {  
    profile:null,   // the profile in view on screen.  Could be user's or some other user's profile they're visiting.
    profiles: [],    // profile listing, list of devs
    repos: [],
    loading:true,
    error: {}
}

export default function ( state = initialState, action ) {
    const { type, payload } = action;

    switch (type) {
        case GET_PROFILE: 
        case UPDATE_PROFILE:
            return {
                ...state,
                profile:payload,
                loading:false
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading:false
            }
        case PROFILE_ERROR: 
            return {
                ...state,
                error:payload,
                loading: false,
                profile:null
            };
        case CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
                repos:[],
                loading:false
            };
        case GET_REPOS:
            return {
                ...state,
                repos: payload,
                loading:false
            }
        default:
            return state;
    }
}
