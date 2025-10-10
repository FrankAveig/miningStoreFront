export function deepSet(obj, path, val) {
  const keys = path.split('.');
  const clone = structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
  let cur = clone;

  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    if (cur[k] == null || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = val;
  return clone;
}