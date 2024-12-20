export const debounceAsync = (func, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    return new Promise((resolve, reject) => {
      timer = setTimeout(async () => {
        try {
          const result = await func(...args);
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, delay);
    });
  };
};

export const isSameDay = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const isBeforeDay = (date1, date2) => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1.getTime() < d2.getTime();
};

export const isSameOrBeforeDay = (date1, date2) => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1.getTime() <= d2.getTime();
};

export const isSameOrAfterDay = (date1, date2) => {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  return d1.getTime() >= d2.getTime();
};

export const isInRange = (date, startDate, endDate) => {
  const normalizedDate = new Date(date);
  const normalizedStartDate = new Date(startDate);
  const normalizedEndDate = new Date(endDate);

  // Normalize to midnight
  normalizedDate.setHours(0, 0, 0, 0);
  normalizedStartDate.setHours(0, 0, 0, 0);
  normalizedEndDate.setHours(0, 0, 0, 0);

  return (
    normalizedDate >= normalizedStartDate && normalizedDate <= normalizedEndDate
  );
};

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
];

const formatDate = (date) => {
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return { month, day, year };
};

export const formatNameDate = (from, to) => {
  const fromDayFormat = formatDate(from);
  if (from && !to) {
    return `${fromDayFormat.month} ${fromDayFormat.day} ${fromDayFormat.year}`;
  } else {
    const toDayFormat = formatDate(to);
    if (fromDayFormat.year === toDayFormat.year) {
      if (fromDayFormat.month === toDayFormat.month) {
        return `${fromDayFormat.month} ${fromDayFormat.day} - ${toDayFormat.day} ${toDayFormat.year} `;
      } else {
        return `${fromDayFormat.month} ${fromDayFormat.day} - ${toDayFormat.month} ${toDayFormat.day} ${toDayFormat.year} `;
      }
    } else {
      return `${fromDayFormat.month} ${fromDayFormat.day} ${fromDayFormat.year} - ${toDayFormat.day} ${toDayFormat.month} ${toDayFormat.year} `;
    }
  }
};

export const formatDotDate = (date) => {
  return date.replaceAll('/', '.');
};

export const daysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

export const formatSingleDateObject = (date) => {
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, '0'); // Ensures 2 digits for the day
  const year = date.getFullYear();
  return `${month} ${day} ${year}`;
};

export const formatMultiDateObject = (date1, date2) => {
  const getFormattedDate = (date) => {
    const month = monthNames[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return { month, day, year };
  };

  const d1 = getFormattedDate(date1);
  const d2 = getFormattedDate(date2);

  // If the same month and year
  if (d1.year === d2.year && d1.month === d2.month) {
    return `${d1.month} ${d1.day} - ${d2.day} ${d2.year}`;
  }

  // If the same year but different months
  if (d1.year === d2.year) {
    return `${d1.month} ${d1.day} - ${d2.month} ${d2.day} ${d2.year}`;
  }

  // If different years
  return `${d1.month} ${d1.day} ${d1.year} - ${d2.month} ${d2.day} ${d2.year}`;
};

export const daysAgo = (direction, days) => {
  const date = new Date();
  date.setDate(date.getDate() + direction * days);
  return date;
};
