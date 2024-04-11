import request from '../../utils/request';

export function Login(data) {
  const url = '/auth/login';
  return request(url, 'POST',data);
}

export function getUserInfo(data) {
  const url = '/auth/profile';
  return request(url,'GET',data);
}

export function getUseSpace(data) {
  const url = '/auth/space';
  return request(url,'GET',data);
}