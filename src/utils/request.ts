import Taro from '@tarojs/taro';

const baseURL = 'http://127.0.0.1:3000';

export default async function request(url, method, data) {
  const token = Taro.getStorageSync('token'); 
  try { 
    const response = await Taro.request({
      url: baseURL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '', 
      },
    });

    if (response.statusCode === 200) {
      return response.data;
    } else {
      if (response.statusCode === 401) {
        Taro.navigateTo({
          url: '/pages/login/index',
        });
      }
      throw new Error(`Request failed with status code ${response.statusCode}`);
    }
  } catch (error) {
    console.error('Request error:', error);
    throw error;
  }
}
