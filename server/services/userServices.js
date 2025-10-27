const { cloudinary } = require("../config/cloudinaryUser");
const userRepository = require("../repository/userRepository");
const User = require("../models/user");

/* const registration_sendOtp = async (body) => {
  return await userRepository.registration_sendOtp(body);
};

const registration_verifyOtp = async (body) => {
  return await userRepository.registration_verifyOtp(body);
}; */

/* const user_login = async (body) => {
  return await userRepository.user_login(body);
}; */

const user_logout = async (body) => {
  return await userRepository.user_logout(body);
};

/* 
const registration_resendOtp = async (body) => {
  return await userRepository.registration_resendOtp(body);
};

const forgotPassword_sendOtp = async (body) => {
  return await userRepository.forgotPassword_sendOtp(body);
};

const forgotPassword_verifyOtp = async (body) => {
  return await userRepository.forgotPassword_verifyOtp(body);
};

const forgotPassword_resendOtp = async (body) => {
  return await userRepository.forgotPassword_resendOtp(body);

}; */

// const resetPassword = async (body) => {
//   return await userRepository.resetPassword(body);
// };

const uploadeProfileImage = async (userId, imageUrl) => {
  return await userRepository.uploadeProfileImage(userId, imageUrl);
};

const updateProfileImage = async (userId, imageUrl) => {
  const trimmedUserId = userId.trim();

  // Call repository to update the DB
  const updatedUser = await userRepository.uploadeProfileImage(
    trimmedUserId,
    imageUrl
  );

  // Return consistent key for frontend
  return {
    ...updatedUser,
    profileImage: { cloudinaryUrl: imageUrl },
  };
};

const getAllUsers = async () => {
  return await userRepository.getAllUsers();
};

const getUserById = async (userId) => {
  return await userRepository.getUserById(userId);
};

const updateUserProfile = async (userId, updateData) => {
  return await userRepository.updateUserProfile(userId, updateData);
};

// Upload documents
const uploadDocuments = async (userId, files) => {
  const docs = files.map((file) => ({
    public_id: file.filename || file.originalname.split(".")[0],
    url: file.path || file.secure_url,
    format: file.mimetype,
    fileName: file.originalname,
    size: file.size,
    uploadedAt: new Date(),
  }));
  // You may want to save docs to the user here, or return them
  return docs;
};

// Get
const getDocuments = async (userId) => {
  return await userRepository.getUserDocuments(userId);
};

/* const updateDocument = async (
  userId,
  public_id,
  files,
  isFullArray = false
) => {
  if (isFullArray) {
    // Upload all files to Cloudinary and create array
    const docs = [];
    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "user_documents",
      });
      docs.push({
        public_id: result.public_id,
        url: result.secure_url,
        format: file.mimetype,
        fileName: file.originalname,
        size: file.size,
        uploadedAt: new Date(),
      });
    }

    // Update full array
    const updatedUser = await userRepository.updateDocument(
      userId,
      null,
      docs,
      true
    );
    return updatedUser;
  } else {
    // Single file update
    const file = files; // single file
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "user_documents",
    });

    const newDoc = {
      public_id: result.public_id,
      url: result.secure_url,
      format: file.mimetype,
      fileName: file.originalname,
      size: file.size,
      uploadedAt: new Date(),
    };

    const updatedUser = await userRepository.updateDocument(
      userId,
      public_id,
      newDoc,
      false
    );
    return updatedUser;
  }
}; */

const getDependentUserId = async (userId) => {
  return await userRepository.getDependentUserId(userId);
};

module.exports = {
//  registration_sendOtp,
//  registration_verifyOtp,
  // user_login,
  user_logout,
  //registration_resendOtp,
  //forgotPassword_sendOtp,
  //forgotPassword_verifyOtp,
  //forgotPassword_resendOtp,
  // resetPassword,
  uploadeProfileImage,
  updateProfileImage,
  getAllUsers,
  getUserById,
  updateUserProfile,
  uploadDocuments,

  getDocuments,
  // updateDocument,
  getDependentUserId
};
