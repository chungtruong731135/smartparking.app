import { createSlice } from '@reduxjs/toolkit';
import base64 from 'base-64';

const initialState = {
  accessToken: '',
  userInfo: null,

  listLoading: false,
  actionsLoading: false,
  error: null,
};
export const callTypes = {
  list: 'list',
  action: 'action',
};

export const globalSlice = createSlice({
  name: 'global',
  initialState: initialState,
  reducers: {
    catchError: (state, action) => {
      state.error = `${action.type}: ${action.payload.error}`;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = false;
      } else {
        state.actionsLoading = false;
      }
    },

    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },

    startCall: (state, action) => {
      state.error = null;
      if (action.payload.callType === callTypes.list) {
        state.listLoading = true;
      } else {
        state.actionsLoading = true;
      }
    },

    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },

    // parseJwt: (action) => {
    //   try {
    //     const base64Url = action.split('.')[1];
    //     const base64Decoded = base64.decode(base64Url);
    //     return JSON.parse(base64Decoded);
    //   } catch (e) {
    //     console.error('Lỗi phân tích token:', e);
    //   }
    // },
  },
});

export const parseJwt = (token) => {
  try {
      const base64Url = token.split('.')[1];
      const base64Decoded = base64.decode(base64Url);
      return JSON.parse(base64Decoded);
  } catch (e) {
      console.error('Lỗi phân tích token:', e);
  }
};
