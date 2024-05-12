// import axios from 'axios';
// import NProgress from 'nprogress';
//
// // Создаем два экземпляра Axios, каждый с своим baseURL
// const coreApi = axios.create({
//     baseURL: 'https://test.qrq.ru/core/api/v1/',
// });
//
// const qwepApi = axios.create({
//     baseURL: 'https://test.qrq.ru/qwep/api/v1/',
// });
//
// // Добавляем интерцепторы для каждого экземпляра
// coreApi.interceptors.request.use((config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
//     NProgress.start();
//     return config;
// });
//
// coreApi.interceptors.response.use(
//     (response) => {
//         NProgress.done();
//         return response;
//     },
//     (response) => {
//         NProgress.done();
//         return response;
//     },
// );
//
// qwepApi.interceptors.request.use((config) => {
//     config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
//     NProgress.start();
//     return config;
// });
//
// qwepApi.interceptors.response.use(
//     (response) => {
//         NProgress.done();
//         return response;
//     },
//     (response) => {
//         NProgress.done();
//         return response;
//     },
// );
//
//
// // Функции-обертки для qwep API
// const qwepApiWrapper = {
//     getPreSearch: (params: any) => qwepApi.get('/preSearch', { params }),
//     // Другие методы qwep API
// };
//
// export const $api = {
//     core: coreApiWrapper,
//     qwep: qwepApiWrapper,
// };
//



// import { Api } from '@/shared/api/generated/Api';


// export const $api = new Api(
//   { baseURL: 'https://test.qrq.ru/core/api/v1/' },
// );

// $api.instance.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
//   NProgress.start();
//   return config;
// });
//
// $api.instance.interceptors.response.use(
//   (response) => {
//     NProgress.done();
//     return response;
//   },
//   (response) => {
//     NProgress.done();
//     return response;
//   },
// );
