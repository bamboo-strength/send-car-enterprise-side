
/**
 * 时间秒数格式化
 * @param s 时间戳（单位：秒）
 * @returns {*} 格式化后的时分秒
 */
export function sec_to_time(s) {
  let t;
  if(s > -1){
    let hour = Math.floor(s/3600);
    let min = Math.floor(s/60) % 60;
    let sec = s % 60;
    if(hour < 10) {
      t = `${hour}:`;
    } else {
      t = `${hour}:`;
    }

    if(min < 10){t += "0";}
    t += `${min}:`;
    if(sec < 10){t += "0";}
    t += sec;
  }
  return t;
}

/**
 * 时间转为秒
 * @param time 时间(00:00:00)
 * @returns {string} 时间戳（单位：秒）
 */
export function time_to_sec (time) {
  let s = '';
  let hour = `${time}`.split(':')[0];
  let min = `${time}`.split(':')[1];
  let sec = `${time}`.split(':')[2];

  s = Number(hour*3600) + Number(min*60) + Number(sec);

  return s;
};
