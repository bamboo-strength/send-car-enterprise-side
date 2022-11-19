import { MATERIALMINE_NAMESPACE } from '@/actions/materialMine';

export const PACKAGE_NAMESPACE = 'packages';

export function PACKAGE_INIT(payload) {
  return {
    type: `${PACKAGE_NAMESPACE}/fetchInit`,
    payload,
  };
}

export function PACKAGE_LIST(payload) {
  return {
    type:  `${PACKAGE_NAMESPACE}/fetchList`,
    payload,
  };
}

export function PACKAGE_DETAIL(id) {
  return {
    type: `${PACKAGE_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function PACKAGE_DETAIL_M(payload) {
  return {
    type: `${PACKAGE_NAMESPACE}/fetchDetailCode`,
    payload,
  };
}

export function PACKAGE_SUBMIT(payload) {

  return {
    type: `${PACKAGE_NAMESPACE}/submit`,
    payload,
  };
}

export function PACKAGE_REMOVE(payload) {
  return {
    type: `${PACKAGE_NAMESPACE}/remove`,
    payload,
  };
}


export function UPDATESTATE(payload) { // 控制提交loading
  return {
    type: `${PACKAGE_NAMESPACE}/updateState`,
    payload,
  };
}
