import i18next from 'i18next';
import moment from 'moment';

export const getCurrentLocale = () =>
  i18next.language === 'es' ? 'es-us' : 'en';

export const DATE_FORMAT = 'MMM DD, YYYY';

export const formatDate = (date: string | Date, relative = false) => {
  if (!date) {
    return '';
  }
  const dateMoment = moment(date).locale(getCurrentLocale());
  if (relative) {
    return dateMoment.calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      lastDay: '[Yesterday]',
      nextWeek: DATE_FORMAT,
      lastWeek: DATE_FORMAT,
      sameElse: DATE_FORMAT,
    });
  }
  return dateMoment.format(DATE_FORMAT);
};

export const formatTime = (date: string | Date) => {
  if (!date) {
    return '';
  }
  return moment(date).locale(getCurrentLocale()).format('h:mm A');
};

export const getDuration = (start: string | Date, end: string | Date) => {
  if (!start || !end) {
    return '';
  }
  return moment(end).diff(moment(start), 'minutes');
};
