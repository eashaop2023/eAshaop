// const jwt = require('jsonwebtoken');

// const generateToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, { 
//     expiresIn: process.env.JWT_EXPIRES_IN 
//   });
//   console.log("Generated JWT:", token);  // log the raw token
// };

// module.exports = generateToken;


const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  const token = jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  console.log("Generated JWT:", token);  
  return token;
};

module.exports = generateToken;
