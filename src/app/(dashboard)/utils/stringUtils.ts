export function truncateString(str: string, num: number) {
  if (str.length <= num * 2) {
    return str;
  } else {
    return str.slice(0, num) + "..." + str.slice(-num);
  }
}
