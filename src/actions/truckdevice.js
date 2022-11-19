import { TRUCKINFO_NAMESPACE } from './truckinfo';

export const TRUCKDEVICE_NAMESPACE = 'truckdevice';

export function TRUCKDEVICE_LIST(payload) {
  return {
    type: `${TRUCKDEVICE_NAMESPACE}/fetchList`,
    payload,
  };
}

export function TRUCKDEVICE_DETAIL(id) {
  return {
    type: `${TRUCKDEVICE_NAMESPACE}/fetchDetail`,
    payload: { id },
  };
}

export function TRUCKDEVICE_RELATIONDETAIL(payload) {
  return {
    type: `${TRUCKDEVICE_NAMESPACE}/fetchrelationdetail`,
    payload: { payload },
  };
}

export function TRUCKDEVICE_CLEAR_DETAIL() {
  return {
    type: `${TRUCKDEVICE_NAMESPACE}/clearDetail`,
    payload: {},
  };
}

export function TRUCKDEVICE_SUBMIT(payload) {
  return {
    type: `${TRUCKDEVICE_NAMESPACE}/submit`,
    payload,
  };
}

export function TRUCKDEVICE_REMOVE(payload) {
  return {
    type: `${TRUCKDEVICE_NAMESPACE}/remove`,
    payload,
  };
}

export function TRUCKDEVICE_INIT(payload) {
  return {
    type: `${TRUCKDEVICE_NAMESPACE}/fetchInit`,
    payload,
  };
}
