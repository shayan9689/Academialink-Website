export function timeAgo(isoDate: string): string {
  const d = new Date(isoDate);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return 'Just now';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} ${min === 1 ? 'minute' : 'minutes'} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} ${hr === 1 ? 'hour' : 'hours'} ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day} ${day === 1 ? 'day' : 'days'} ago`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} ${month === 1 ? 'month' : 'months'} ago`;
  const year = Math.floor(month / 12);
  return `${year} ${year === 1 ? 'year' : 'years'} ago`;
}
