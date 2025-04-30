import { format, formatDistance, isToday, isThisWeek, startOfWeek, endOfWeek, parseISO } from 'date-fns';
export const formatDate = (date, formatString = 'MMM d, yyyy') => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatTime = (date) => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'h:mm a');
};

export const formatRelative = (date) => {
  if (!date) return 'N/A';
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const checkIsToday = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

export const checkIsThisWeek = (date) => {
  if (!date) return false;
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isThisWeek(dateObj);
};

export const getCurrentWeekRange = () => {
  const now = new Date();
  return {
    start: startOfWeek(now),
    end: endOfWeek(now)
  };
};

export const formatForApi = (date) => {
  if (!date) return null;
  return date.toISOString();
};