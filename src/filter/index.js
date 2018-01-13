import dateFormat from 'date-fns/format';
// import dateParse from 'date-fns/parse'

export default function date(time, format = 'YYYY-MM-DD HH:mm:ss') {
  // 检查时间戳单位是秒还是毫秒
  const timeVal = time.toString().length < 11 ? time * 1000 : time;
  const dateVal = new Date(timeVal);
  return dateFormat(dateVal, format);
}
