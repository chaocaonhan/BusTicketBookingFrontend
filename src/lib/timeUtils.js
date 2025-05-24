// utils/timeUtils.js
export const parseTime = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours + minutes / 60;
};

export const calculateDuration = (startTime, endTime) => {
  const start = parseTime(startTime);
  const end = parseTime(endTime);
  let duration = end - start;
  if (duration < 0) duration += 24;
  return `${Math.floor(duration)} giờ`;
};
