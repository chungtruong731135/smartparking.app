import axios from 'axios';
import Sever from '../config/Sever';

const SERVER_URL = Sever.SERVER_URL;

let apiInstance = null;

export { SERVER_URL };

export const initializeApiInstance = async () => {
  apiInstance = axios.create({
    baseURL: SERVER_URL,
    timeout: 30000,
  });
};

export const setAuthToken = (token) => {
  if (!apiInstance) return;
  if (token) {
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiInstance.defaults.headers.common['Authorization'];
  }
};

const API = {
  requestGET_SP: async (urlService) => {
    if (!apiInstance) await initializeApiInstance();
    return await apiInstance
      .get(urlService)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return { data: null };
      });
  },

  requestPOST_SP: async (urlService, data) => {
    if (!apiInstance) await initializeApiInstance();
    return await apiInstance
      .post(urlService, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return { data: null };
      });
  },
  
  requestPOST_Login: async (urlService, data) => {
    if (!apiInstance) await initializeApiInstance();
    return await apiInstance
      .post(urlService, JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'tenant': 'root'
        }
      })
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return { data: null };
      });
  },

  requestDELETE: async (urlService) => {
    if (!apiInstance) await initializeApiInstance();
    return await apiInstance
      .delete(urlService)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return { data: null };
      });
  },
};

export default API;
