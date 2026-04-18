 export function timeAgo(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);

  const diffInSeconds = Math.floor((now - past) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(diffInSeconds / 3600);
  const days = Math.floor(diffInSeconds / 86400);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hr ago`;
  } else if (days < 7) {
    return `${days} day ago`;
  } else {
    return past.toLocaleDateString();
  }
}