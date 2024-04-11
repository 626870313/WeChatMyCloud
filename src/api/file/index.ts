import request from '../../utils/request';

export function getFileList(data) {
  const url = '/upload/files';
  return request(url, 'GET',data);
}

export function upFiles(data) {
  const url = '/upload/files';
  return request(url, 'POST',data);
}

export function upFolder(data) {
  const url = '/upload/folders';
  return request(url, 'POST',data);
}

export function upFileName(data) {
  const url = '/upload/files';
  return request(url, 'PUT',data);
}

export function deleteFile(data) {
  const url = '/upload/files';
  return request(url, 'Delete',data);
}