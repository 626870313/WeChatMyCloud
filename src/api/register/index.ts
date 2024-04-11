import request from '../../utils/request';

export function Signup(data) {
  const url = '/auth/Signup';
  return request(url, 'POST',data);
}

