import * as actionTypes from '../actions/actionTypes';

const initialState = {
    rooms: [],
    roomList: [],
    currentRoom: [],
    error: '',
    getRoomError: false,
    creatEditRoomError: false,
    deleteRoomError: false,
}
const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_ROOMS:
            return {
                ...state,
                rooms: action.rooms,
                roomList: action.roomList,
                currentRoom: [],
                getRoomError: false,
                creatEditRoomError: false,
                deleteRoomError: false,
            };
        case actionTypes.STORE_CURRENT_ROOM:
            return {
                ...state,
                currentRoom: action.currentRoom,
                getRoomError: false,
                creatEditRoomError: false,
                deleteRoomError: false,
            };
        case actionTypes.LOG_ROOM_ERROR:
            return {
                ...state,
                error: action.error
            };
        case actionTypes.GET_ROOMS_ERROR:
            return {
                ...state,
                getRoomError: true
            };
        case actionTypes.CREATE_EDIT_ROOM_ERROR:
            return {
                ...state,
                creatEditRoomError: true
            };
        case actionTypes.DELETE_ROOM_ERROR:
            return {
                ...state,
                deleteRoomError : true
            };
        default:
            return state;
    }
}
export default roomReducer;