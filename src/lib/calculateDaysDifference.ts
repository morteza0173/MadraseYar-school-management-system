export const calculateDaysDifference = (date: Date): string => {
  const now = new Date();
  const targetDate = new Date(date);

  const diffInMs = targetDate.getTime() - now.getTime();

  const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays > 0) {
    return `${diffInDays} روز باقی مانده`;
  } else if (diffInDays < 0) {
    return `${Math.abs(diffInDays)} روز گذشته است`;
  } else if (diffInDays === 0) {
    return "امروز";
  } else {
    return "نامشخص";
  }
};
