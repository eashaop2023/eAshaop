import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleChangePassword = async (values, resetForm) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('User not authenticated. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/user/change-password/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to change password');

      toast.success(data.message || 'Password changed successfully!');
      resetForm();
      setTimeout(() => {
        navigate("/user/dashboard");
      }, 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <Topbar />

      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ paddingTop: '150px', paddingBottom: '60px' }}>
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

          /* Responsive widths */
          @media (max-width: 576px) {
            .form-width { width: 100% !important; }
          }
          @media (min-width: 577px) and (max-width: 992px) {
            .form-width { width: 350px !important; }
          }
          @media (min-width: 993px) {
            .form-width { width: 450px !important; }
          }
        `}</style>

        <h2 className="mb-4 fw-medium text-center">Change Password</h2>

        <Formik
          initialValues={{ oldPassword: '', newPassword: '', confirmPassword: '' }}
          validationSchema={ChangePasswordSchema}
          onSubmit={(values, { resetForm }) => handleChangePassword(values, resetForm)}
        >
          {() => (
            <Form className="d-flex flex-column gap-3 form-width">
              {/* Old Password */}
              <div>
                <label htmlFor="oldPassword" className="form-label fw-medium" style={{ fontSize: '1.05rem' }}>
                  Old Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Field
                    name="oldPassword"
                    type={showOld ? 'text' : 'password'}
                    className="form-control custom-input"
                    style={{
                      border: '1px solid #8E8E8E',
                      padding: '10px 45px 10px 15px',
                      borderRadius: '12px',
                      height: '48px',
                    }}
                  />
                  <span
                    onClick={() => setShowOld(!showOld)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '15px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#666',
                    }}
                  >
                    {showOld ? <FiEye size={22} /> : <FiEyeOff size={22} />}
                  </span>
                </div>
                <ErrorMessage name="oldPassword" component="div" className="error-text" />
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="form-label fw-medium" style={{ fontSize: '1.05rem' }}>
                  New Password
                </label>
                <div className="position-relative">
                  <Field
                    name="newPassword"
                    type={showNew ? 'text' : 'password'}
                    className="form-control custom-input"
                    style={{
                      border: '1px solid #8E8E8E',
                      padding: '10px 45px 10px 15px',
                      borderRadius: '12px',
                      height: '48px',
                    }}
                  />
                  <span
                    onClick={() => setShowNew(!showNew)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '15px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#666',
                    }}
                  >
                    {showNew ? <FiEye size={22} /> : <FiEyeOff size={22} />}
                  </span>
                </div>
                <ErrorMessage name="newPassword" component="div" className="error-text" />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="form-label fw-medium" style={{ fontSize: '1.05rem' }}>
                  Confirm Password
                </label>
                <div className="position-relative">
                  <Field
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    className="form-control custom-input"
                    style={{
                      border: '1px solid #8E8E8E',
                      padding: '10px 45px 10px 15px',
                      borderRadius: '12px',
                      height: '48px',
                    }}
                  />
                  <span
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '15px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#666',
                    }}
                  >
                    {showConfirm ? <FiEye size={22} /> : <FiEyeOff size={22} />}
                  </span>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="error-text" />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn mb-3"
                style={{
                  backgroundColor: '#00A99D',
                  color: 'white',
                  padding: '12px',
                  fontSize: '18px',
                  borderRadius: '28px',
                  width: '100%',
                }}
              >
                Change Password
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ChangePassword;
