import request from '@/utils/request';

export async function list(params) {
  return request('/api/mer-message/merFeedback/queryMerbackList', {
    method: 'POST',
    body: params,
  });
}
