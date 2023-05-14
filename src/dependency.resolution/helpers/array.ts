export const uniq = <T>(array: T[]) => {
  const uniqArray: T[] = [];
  const set = new Set<T>();
  for (const value of array) {
    if (set.has(value) === false) {
      uniqArray.push(value);
      set.add(value);
    }
  }
  return uniqArray;
};
