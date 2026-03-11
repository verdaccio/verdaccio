export const getTarball = (name: string): string => {
  const r = name.split('/');
  if (r.length === 1) {
    return r[0];
  } else {
    return r[1];
  }
};
