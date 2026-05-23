export const wmoToWeather = (code: number): { label: string; icon: string } => {
    if (code === 0) return { label: 'آفتابی', icon: '☀️' };
    if (code <= 3) return { label: 'نیمه ابری', icon: '⛅' };
    if (code <= 48) return { label: 'مه', icon: '🌫️' };
    if (code <= 65) return { label: 'بارانی', icon: '🌧️' };
    if (code <= 77) return { label: 'برفی', icon: '❄️' };
    if (code <= 82) return { label: 'رگبار', icon: '🌦️' };
    return { label: 'طوفانی', icon: '⛈️' };
  };
  
  export const persianWeekdays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
  
  export const getPersianWeekday = (dateString: string): string => {
    const date = new Date(dateString);
    return persianWeekdays[date.getDay()];
  };
  