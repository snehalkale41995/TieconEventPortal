import * as actionTypes from '../actions/actionTypes';

const initialState = {
    sponsors: [],
    sponsorsList: [],
    currentSponsor: {},
    getSponsorError : false,
    creatEditSponsorError : false,
    deleteSponsorError : false,
    categoryOptions: [
        { label: 'Gold Sponsor', value: 'Gold Sponsor' },
        { label: 'Associate Sponsor', value: 'Associate Sponsor' },
        { label: 'Award Sponsor', value: 'Award Sponsor' },
        { label: 'Lanyard & Badge Sponsor', value: 'Lanyard & Badge Sponsor' },
        { label: 'Strategic Communication Partner', value: 'Strategic Communication Partner' },
        { label: 'Technoloogy Partner', value: 'Technoloogy Partner' },
        { label: 'Ecosystem Partner', value: 'Ecosystem Partner' },
        { label: 'Radio Partner', value: 'Radio Partner' },
        { label: 'Post Event Engagement Partner', value: 'Post Event Engagement Partner' },
        { label: 'Other', value: 'Other' }
    ]
}
const sponsorReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_SPONSORS:
            return {
                ...state,
                sponsors: action.sponsors,
                sponsorsList: action.sponsorsList,
                getSponsorError : false,
                creatEditSponsorError : false,
                deleteSponsorError : false,
            };
        case actionTypes.STORE_CURRENT_SPONSOR:
            return {
                ...state,
                currentSponsor: action.currentSponsor,
                getSponsorError : false,
                creatEditSponsorError : false,
                deleteSponsorError : false,
            };
        case actionTypes.GET_SPONSOR_ERROR:
            return {
                ...state,
                getSponsorError : true
            };
        case actionTypes.CREATE_EDIT_SPONSOR_ERROR:
            return {
                ...state,
                creatEditSponsorError : true
            };
        case actionTypes.DELETE_SPONSOR_ERROR:
            return {
                ...state,
                deleteSponsorError : true
            };

        default:
            return state;
    }
}
export default sponsorReducer;