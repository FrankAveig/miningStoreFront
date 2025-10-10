export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${dayName} ${day} ${month} del ${year} ${hours}h${minutes}`;
}

export function toDatetimeLocal(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function pad(n) {
  return n.toString().padStart(2, '0');
}

export function getTimeLeft(endDate) {
  const diff = new Date(endDate) - new Date();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function getDateDifference(startDate, endDate = new Date()) {
  const start = new Date(startDate); // 11-12-1995
  const end = new Date(endDate); //01-09-2025
  // valores iniciales brutos
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  // si los días son negativos → pedir prestado un mes
  if (days < 0) {
    months -= 1;
    // último día del mes anterior a "end"
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // si los meses son negativos → pedir prestado un año
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days }; // { years: 29, months: 8, days: 20 }
}

export function eighteenYearsAgoISO(baseDate = new Date()) {
  const y = baseDate.getFullYear() - 18;
  const m = baseDate.getMonth();
  const d = baseDate.getDate();

  // Día seguro del mes destino (evita overflow en meses más cortos)
  const lastDayOfTargetMonth = new Date(y, m + 1, 0).getDate();
  const safeDay = Math.min(d, lastDayOfTargetMonth);

  const dt = new Date(y, m, safeDay);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
}

export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '$0.00';
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return '$0.00';
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(numericAmount);
}

/*2025-12-11T05:00:00.000000Z --> 2025-12-11*/
export function formatDateInput(isoString) {
  if (!isoString) return '';
  return isoString.split('T')[0];
}