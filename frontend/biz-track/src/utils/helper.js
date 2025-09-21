export const validateEmail = (email) => {
  return /\S+@\S+/.test(email);
};
