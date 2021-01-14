import { 
    PROFILE_ERROR,
    GET_PROFILE,
    CLEAR_PROFILE
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
            return {
                ...state,
                profile:payload,
                loading:false
            }
        case PROFILE_ERROR: 
            return {
                ...state,
                error:payload,
                loading: false
            }
        case CLEAR_PROFILE:
            return {
                ...state,
                profile:null,
                repos:[],
                loading:false
            }
        default:
            return state;
    }
}
