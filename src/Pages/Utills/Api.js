// import axios from 'axios';

// const baseUrl = 'https://admin.frozenwala.com/api/auth/';

// const get = async endPoints => {
//   const accessToken = localStorage.getItem('access_token');

//   return axios.get(baseUrl + endPoints, {
//     headers: {
//         Authorization: `Bearer ${accessToken}`, // Use the passed token
//       },
//   });
// };

// const postFormdata = async (endPoints, formData) => {
//   const accessToken = localStorage.getItem('access_token');

//   return axios.post(baseUrl + endPoints, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//       Authorization: `Bearer ${accessToken}`, // Use the passed token
//       },
//   });
// };

// const post = async (endPoints, body) => {
//   const accessToken = localStorage.getItem('access_token');

//   return axios.post(baseUrl + endPoints, body, {
//     headers: {
//         Authorization: `Bearer ${accessToken}`, // Use the passed token
//       },
//   });
// };

// const remove = async (endPoints) => {
//   const accessToken = localStorage.getItem('access_token');

//   return axios.delete(baseUrl + endPoints, {
//     headers: {
//         Authorization: `Bearer ${accessToken}`, // Use the passed token
//       },
//   });
// };

// export default {get, post, postFormdata, remove};


import axios from 'axios';

const accessToken = localStorage.getItem('access_token');


const api = axios.create({
  baseURL: "https://backend.frozenwala.com/",
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
export default api;