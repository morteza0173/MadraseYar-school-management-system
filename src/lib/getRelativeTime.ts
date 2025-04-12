export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();


  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);



  const rtf = new Intl.RelativeTimeFormat("fa", { numeric: "auto" });
  if (seconds < 60) return rtf.format(-seconds, "second");
  if (minutes < 60) return rtf.format(-minutes, "minute");
  if (hours < 24) return rtf.format(-hours, "hour");
  return rtf.format(-days, "day");
};
