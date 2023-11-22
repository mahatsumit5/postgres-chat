export const generateToken = () => {
  let tokenLength = 6;
  let token = "";
  let characters = "0123456789";
  for (let i = 0; i < tokenLength; i++) {
    token += characters.charAt(Math.floor(Math.random() * 10));
  }
  return token;
};
