import * as crypto from 'crypto';

function sortObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObject);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).sort().reduce((result: any, key) => {
      result[key] = sortObject(obj[key]);
      return result;
    }, {});
  }
  return obj;
}

export function generateHash(obj: unknown): string {
  const sorted = sortObject(obj);
  const jsonString = JSON.stringify(sorted);
  return crypto.createHash('sha256').update(jsonString).digest('hex');
}