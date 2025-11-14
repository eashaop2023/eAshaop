
const jwt = require('jsonwebtoken');
/**
 * Generate JWT token for user or doctor
 * @param {Object} payload - { id: ObjectId, role: 'user' | 'doctor' }
 */
const generateToken = (id,role) => {
  const token = jwt.sign(
     {id,role} ,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  console.log("Generated JWT:", token);  
  return token;
};

module.exports = {generateToken};
