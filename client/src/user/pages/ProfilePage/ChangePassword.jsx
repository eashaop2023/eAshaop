import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import 'bootstrap/dist/css/bootstrap.min.css';
import Topbar from '../Topbar/Topbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../../api-config';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const ChangePasswordSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old Password is required'),
  newPassword: Yup.string()
    .matches(
      passwordRegex,
      'Must include uppercase, lowercase, number, special character, and be at least 6 characters'
    )
    .required('New Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

function ChangePassword() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

const handleChangePassword = async (values, resetForm) => {
  try {
    const userId = localStorage.getItem('userId'); // required to identify the user
    if (!userId) {
      toast.error('User not authenticated. Please log in again.');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/user/change-password/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || 'Failed to change password');

    toast.success(data.message || 'Password changed successfully!');
    resetForm();
    
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

  return (
    <div>
      <Topbar />
      <div>
        <style>{`
          .custom-input:focus {
            outline: none !important;
            box-shadow: none !important;
          }
          .error-text {
            color: red;
            font-size: 0.875rem;
            margin-top: 3px;
            margin-left: 10px;
          }
        `}</style>

        <div
          className="w-100 d-flex flex-column align-items-center justify-content-center"
          style={{ paddingTop: '170px' }}
        >
          <h2 className="mb-4 fw-medium text-center">Change Password</h2>
          <Formik
            initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
            validationSchema={ChangePasswordSchema}
            onSubmit={(values, { resetForm }) => handleChangePassword(values, resetForm)}
          >
            {() => (
              <Form className="d-flex flex-column gap-3">

                {/* Old Password */}
                <div>
                  <label htmlFor="oldPassword" className="form-label" style={{ fontSize: '1.12rem' }}>
                    Old Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Field
                      name="oldPassword"
                      autoComplete="new-password"
                      type={showOld ? 'text' : 'password'}
                      className="form-control custom-input"
                      style={{ border: '1px solid #8E8E8E', padding: '10px 24px', borderRadius: '12px', height: '48px', width: "450px" }}
                    />
                    <span
                      onClick={() => setShowOld(!showOld)}
                      style={{ position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666' }}
                    >
                      {showOld ? <FiEye size={24} /> : <FiEyeOff size={24} />}
                    </span>
                  </div>
                  <ErrorMessage name="oldPassword" component="div" className="error-text" />
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="form-label" style={{ fontSize: '1.12rem' }}>
                    New Password
                  </label>
                  <div className="position-relative">
                    <Field
                      name="newPassword"
                      type={showNew ? 'text' : 'password'}
                      className="form-control custom-input"
                      style={{ border: '1px solid #8E8E8E', padding: '10px 24px', borderRadius: '12px', width: '450px' }}
                    />
                    <span
                      onClick={() => setShowNew(!showNew)}
                      style={{ position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666' }}
                    >
                      {showNew ? <FiEye size={24} /> : <FiEyeOff size={24} />}
                    </span>
                  </div>
                  <ErrorMessage name="newPassword" component="div" className="error-text" />
                </div>

                {/* Confirm Password */}
                <div className='mb-3'>
                  <label htmlFor="confirmPassword" className="form-label" style={{ fontSize: '1.12rem' }}>
                    Confirm Password
                  </label>
                  <div className='position-relative'>
                    <Field
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      className="form-control custom-input"
                      style={{ border: '1px solid #8E8E8E', padding: '10px 24px', borderRadius: '12px', width: '450px' }}
                    />
                    <span
                      onClick={() => setShowConfirm(!showConfirm)}
                      style={{ position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', cursor: 'pointer', color: '#666' }}
                    >
                      {showConfirm ? <FiEye size={24} /> : <FiEyeOff size={24} />}
                    </span>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="error-text" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="btn mb-3"
                  style={{ backgroundColor: '#00A99D', color: 'white', padding: '10px', fontSize: '18px', width: '100%', borderRadius: '24px' }}
                >
                  Change Password
                </button>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
