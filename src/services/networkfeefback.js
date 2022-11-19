import request from '@/utils/request';
import func from "@/utils/Func";

export async function feedbacksave(params) {
  return request('/api/fre-freight/feedback/save', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
