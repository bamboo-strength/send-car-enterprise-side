import {stringify} from 'qs'
import request from "@/utils/request";
import func from '@/utils/Func';

// 查询是否是管理员账号
export async function isAdminDetail(params) {
  return request(`/api/mer-shop/factory/isAdminDetail?${stringify(params)}`);
}
