import axios from "axios";

//baseURL 값으로 /api를 기본으로 가지고 있는 axios 객체를 만들어서 export로 return 해준다
const api = axios.create({
    baseURL:"/api"
})

// // 요청 인터셉터 (예: 토큰 자동 추가)
// api.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = token;
//     }
//     return config;
// });

//리턴해준다
export default api;