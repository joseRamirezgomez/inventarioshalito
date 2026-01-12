export function formatBase(value, unit) {
  if (unit === 'g') {
    if (value >= 1000) return (value/1000).toFixed(2) + ' kg';
    return value + ' g';
  }
  if (unit === 'ml') {
    if (value >= 1000) return (value/1000).toFixed(2) + ' L';
    return value + ' ml';
  }
  return value + ' ' + unit;
}
