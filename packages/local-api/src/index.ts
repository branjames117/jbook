export const serve = (port: number, filename: string, dir: string): void => {
  console.log('serving traffic on port', port);
  console.log('saving/fetching cells from', filename);
  console.log('that file is in dir', dir);
};
