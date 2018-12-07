import * as actionTypes from "../actions/actionTypes";
import axios from "axios";
import AppConfig from "../../constants/AppConfig";

export const storeRooms = (roomData, roomList) => {
  return {
    type: actionTypes.GET_ROOMS,
    rooms: roomData,
    roomList: roomList
  };
};
export const storeCurrentRoom = currentRoom => {
  return {
    type: actionTypes.STORE_CURRENT_ROOM,
    currentRoom: currentRoom
  };
};
export const logRoomError = () => {
  return {
    type: actionTypes.LOG_ROOM_ERROR,
    error: "Oops...Something went wrong.Please try again..."
  };
};

export const getRoomError = () => {
  return {
    type: actionTypes.GET_ROOMS_ERROR
  };
};

export const createEditRoomError = () => {
  return {
    type: actionTypes.CREATE_EDIT_ROOM_ERROR
  };
};
export const deleteRoomError = () => {
  return {
    type: actionTypes.DELETE_ROOM_ERROR
  };
};

export const getRooms = () => {
  let roomData = [];
  let roomList = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/room`)
      .then(response => {
        roomData = response.data;
        roomData.forEach(room => {
          roomList.push({ label: room.roomName, value: room._id });
          if (room.event !== null) {
            room.eventName = room.event.eventName;
          }
        });
        dispatch(storeRooms(roomData, roomList));
      })
      .catch(error => {
        dispatch(getRoomError());
      });
  };
};

export const getRoomById = id => {
  let roomData = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/room/${id}`)
      .then(response => {
        roomData = response.data;
        dispatch(storeCurrentRoom(roomData));
      })
      .catch(error => {
        dispatch(getRoomError());
      });
  };
};
export const createRoom = room => {
  return dispatch => {
    axios
      .post(`${AppConfig.serverURL}/api/room`, room)
      .then(response => {
        dispatch(getRooms());
      })
      .catch(error => {
        dispatch(createEditRoomError());
      });
  };
};

export const editRoom = (id, room) => {
  return dispatch => {
    axios
      .put(`${AppConfig.serverURL}/api/room/${id}`, room)
      .then(response => {
        dispatch(getRooms());
      })
      .catch(error => {
        dispatch(createEditRoomError());
      });
  };
};

export const deleteRoom = id => {
  return dispatch => {
    axios
      .delete(`${AppConfig.serverURL}/api/room/${id}`)
      .then(response => {
        dispatch(getRooms());
      })
      .catch(error => {
        dispatch(deleteRoomError());
      });
  };
};

export const getRoomsForEvent = eventId => {
  let roomData = [];
  let roomList = [];
  return dispatch => {
    axios
      .get(`${AppConfig.serverURL}/api/room/event/${eventId}`)
      .then(response => {
        roomData = response.data;
        roomData.forEach(room => {
          roomList.push({ label: room.roomName, value: room._id });
          if (room.event !== null) {
            room.eventName = room.event.eventName;
          }
        });
        dispatch(storeRooms(roomData, roomList));
      })
      .catch(error => {
        dispatch(logRoomError());
      });
  };
};
