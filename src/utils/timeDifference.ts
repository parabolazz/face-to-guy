export function timeDifference(current, previous) {

  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  if (elapsed < msPerMinute) {
       return Math.round(elapsed/1000) + ' 秒前';   
  }

  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' 分钟前';   
  }

  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' 小时前';   
  }

  else if (elapsed < msPerMonth) {
       return Math.round(elapsed/msPerDay) + ' 天前';   
  }

  else if (elapsed < msPerYear) {
       return Math.round(elapsed/msPerMonth) + ' 个月前';   
  }

  else {
       return Math.round(elapsed/msPerYear ) + ' 年前';   
  }
}