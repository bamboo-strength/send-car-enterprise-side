import Func from '@/utils/Func';


export function maps(){
  return new Map();
}

export function isTimeValue(val) {
  let is = false;
  if (Func.notEmpty(val.startTime) && Func.notEmpty(val.endTime)){
    is = true;
  }else {
    is = false;
  }
  return is;
}