import jwt from "jsonwebtoken";

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (err) {
    return {
      valid: false,
      expired: err.name === "TokenExpiredError",
      decoded: null,
    };
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return { valid: true, expired: false, decoded };
  } catch (err) {
    return {
      valid: false,
      expired: err.name === "TokenExpiredError",
      decoded: null,
    };
  }
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
