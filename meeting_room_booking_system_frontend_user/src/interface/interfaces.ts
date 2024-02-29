import axios, { AxiosRequestConfig } from "axios";
import { RegisterUser } from "../page/register/Register";
import { UpdatePassword } from "../page/update_password/UpdatePassword";
import { UserInfo } from "../page/update_info/UpdateInfo";
import { message } from "antd";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3005",
  timeout: 3000,
});



//请求拦截器  每次请求前都会执行 用于在请求头中加入token
axiosInstance.interceptors.request.use(function (config) {
  const accessToken =localStorage.getItem("access_token") || "";
  if (accessToken) {
    config.headers.authorization = "Bearer " + accessToken; //将token放到请求头发送给服务器 Bearer是JWT的认证头部信息 用于验证token后面加上空格
  }
  return config;
});

// 请求拦截器   每次请求前都会执行
interface PendingTask {
  config: AxiosRequestConfig;
  resolve: Function;
}

let refreshing = false;
const queue: PendingTask[] = []; // 用来存储每个请求的标识和请求参数

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    let { data, config } = error.response;

    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve,
        });
      });
    }

    if (data.code === 401 && !config.url.includes("/user/refresh")) {
      refreshing = true;

      const res = await refreshToken();

      refreshing = false;

      if (res.status === 200) {
        queue.forEach(({ config, resolve }) => {
          resolve(axiosInstance(config));
        });

        return axiosInstance(config);
      } else {
        message.error(res.data);

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } else {
      return error.response;
    }
  }
);

//刷新token 用于刷新token 返回新的token
async function refreshToken() {
  const res = await axiosInstance.get("/user/refresh", {
    params: {
      refresh_token: localStorage.getItem("refresh_token"),
    },
  });
  localStorage.setItem("access_token", res.data.access_token || "");
  localStorage.setItem("refresh_token", res.data.refresh_token || "");
  return res;
}

//登录接口
export async function login(username: string, password: string) {
  return await axiosInstance.post("/user/login", {
    username,
    password,
  });
}

//发送验证码
export async function registerCaptcha(email: string) {
  return await axiosInstance.get("/user/register_captcha", {
    params: {
      address: email,
    },
  });
}

//注册接口
export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post("/user/register", registerUser);
}

//更新密码发送验证码接口
export async function updatePasswordCaptcha(email: string) {
  return await axiosInstance.get("/user/update_password/captcha", {
    params: {
      address: email,
    },
  });
}

//更新密码接口
export async function updatePassword(data: UpdatePassword) {
  return await axiosInstance.post("/user/update_password", data);
}

export async function getUserInfo() {
  return await axiosInstance.get("/user/info");
}

export async function updateInfo(data: UserInfo) {
  return await axiosInstance.post("/user/update", data);
}

export async function updateUserInfoCaptcha() {
  return await axiosInstance.get("/user/update/captcha");
}
