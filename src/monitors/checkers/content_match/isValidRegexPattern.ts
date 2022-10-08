export default (pattern: string): boolean => {
  try {
    new RegExp(pattern.replace(/^\//, '').replace(/\/$/, ''));

    return true;
  }
  catch(err) {
    return false;
  }
}
