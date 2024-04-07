import axios from 'axios';
import { NetworkInfo } from 'react-native-network-info';

let apiInstance = null;

export const initializeApiInstance = async () => {
  // const ipv4Address = await NetworkInfo.getIPAddress();
  // console.log(ipv4Address)
  apiInstance = axios.create({
    // baseURL: `http://${ipv4Address}:5000/`,
    baseURL: `http://192.168.2.231:5000/`,
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
