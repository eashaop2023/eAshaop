import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import Map from "../../../assets/pharmacyicons/Map.png"

const AddAddressModal = ({ show, onClose, onAddAddress }) => {
  const initialValues = {
    fullName: "",
    phone: "",
    houseNumber: "",
    areaDetails: "",
    landmark: "",
    city: "",
    pinCode: "",
    state: "",
  };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only alphabets allowed in full name")
      .required("Full name is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    houseNumber: Yup.string()
      .matches(/^[a-zA-Z0-9\s-]*$/, "Only alphanumeric characters allowed")
      .max(50, "Maximum 50 characters allowed")
      .required("House/Flat number is required"),
    areaDetails: Yup.string()
      .matches(/^[a-zA-Z0-9\s-]*$/, "Only alphanumeric characters allowed")
      .required("Area details are required"),
    landmark: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, "Only alphabets allowed in landmark")
      .required("Landmark is required"),
    city: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, "Only alphabets allowed in city")
      .required("City is required"),
    pinCode: Yup.string()
      .matches(/^\d+$/, "Only numbers allowed in pincode")
      .required("Pin code is required"),
    state: Yup.string()
      .matches(/^[a-zA-Z\s]*$/, "Only alphabets allowed in state")
      .required("State is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    if (onAddAddress) onAddAddress(values);
    resetForm();
    onClose();
  };


  return (
    <>
    <style>
      {
        `
        .form-control:focus {
  outline: none;
  box-shadow: none;
  border-color: #ccc; /* Optional: custom border color */

}
 
 `
      }
    </style>
    
    <Modal show={show} onHide={onClose} centered size="xl"  dialogClassName="custom-modal-width">
      <Modal.Body style={{ padding: "20px"}}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "502px 464px",
            columnGap: "40px",
            fontFamily: "Urbanist, sans-serif",
            width: "100%",
          }}
        >
          <div style={{height:'620px'}}>
            <img
              src={Map}
              alt="Hyderabad Map"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>

          <div style={{height:'620px',overflowY:'auto',overflowX:'hidden',scrollbarWidth:'none',msOverflowStyle:'none'}}>
            <h4 className="fw-semibold mb-3">Add Address</h4>
           <Formik
  initialValues={initialValues}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
  validateOnChange={true}
  validateOnBlur={true}
>
  {(formik) => (
    <FormikForm>
      <Form.Group className="mb-2" >
        <Form.Label style={{fontSize:'18px',color:'#494949'}}>Full Name</Form.Label>
        <Field name="fullName">
          {({ field }) => (
            <Form.Control
              {...field}
              className="form-control"
              value={field.value}
              style={{height:'32px'}}
              onChange={(e) => {
                const value = e.target.value;
                if (/[^a-zA-Z\s]/.test(value)) return;
                const capitalized = value.replace(/\b\w/g, (char) => char.toUpperCase());
                formik.setFieldValue("fullName", capitalized);
              }}
            />
          )}
        </Field>
        <ErrorMessage name="fullName" component="div" className="text-danger small" />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label style={{fontSize:'18px',color:'#494949'}}>Phone Number</Form.Label>
        <div className="d-flex gap-2 align-items-center">
          <Form.Select style={{ maxWidth: "100px" }} defaultValue="+91">
            <option value="+91">+91</option>
          </Form.Select>
          <Field name="phone">
            {({ field }) => (
              <Form.Control
                {...field}
                className="form-control"
                maxLength={10}
                 style={{height:'32px'}}
                onChange={(e) => {
                  const val = e.target.value;
                  if (/^\d*$/.test(val)) {
                    formik.setFieldValue("phone", val);
                  }
                }}
              />
            )}
          </Field>
        </div>
        <ErrorMessage name="phone" component="div" className="text-danger small mt-1" />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label style={{fontSize:'18px',color:'#494949'}}>House / Flat Number</Form.Label>
        <Field name="houseNumber">
          {({ field }) => (
            <Form.Control
              {...field}
              className="form-control"
               style={{height:'32px'}}
              maxLength={50}
            />
          )}
        </Field>
        <ErrorMessage name="houseNumber" component="div" className="text-danger small" />
      </Form.Group>

      <Form.Group className="mb-2">
        <Form.Label style={{fontSize:'18px',color:'#494949'}}>Area Details</Form.Label>
        <Field name="areaDetails">
          {({ field }) => (
            <Form.Control {...field} className="form-control"  style={{height:'32px'}} />
          )}
        </Field>
        <ErrorMessage name="areaDetails" component="div" className="text-danger small" />
      </Form.Group>

      <Form.Group className="mb-1">
        <Form.Label style={{fontSize:'18px',color:'#494949'}}>Landmark</Form.Label>
        <Field name="landmark">
          {({ field }) => (
            <Form.Control
              {...field}
              className="form-control"
               style={{height:'32px'}}
              onChange={(e) => {
                const value = e.target.value;
                if (/[^a-zA-Z\s]/.test(value)) return;
                formik.setFieldValue("landmark", value);
              }}
            />
          )}
        </Field>
        <ErrorMessage name="landmark" component="div" className="text-danger small" />
      </Form.Group>

      <Row className="mb-2">
        <Col>
          <Form.Label style={{fontSize:'18px',color:'#494949'}}>City</Form.Label>
          <Field name="city">
            {({ field }) => (
              <Form.Control
                {...field}
                className="form-control"
                 style={{height:'32px'}}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/[^a-zA-Z\s]/.test(value)) return;
                  formik.setFieldValue("city", value);
                }}
              />
            )}
          </Field>
          <ErrorMessage name="city" component="div" className="text-danger small" />
        </Col>
        <Col>
          <Form.Label style={{fontSize:'18px',color:'#494949'}}>Pincode</Form.Label>
          <Field name="pinCode">
            {({ field }) => (
              <Form.Control
                {...field}
                className="form-control"
                 style={{height:'32px'}}
                maxLength={6}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    formik.setFieldValue("pinCode", value);
                  }
                }}
              />
            )}
          </Field>
          <ErrorMessage name="pinCode" component="div" className="text-danger small" />
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label style={{fontSize:'18px',color:'#494949'}}>State</Form.Label>
        <Field name="state">
          {({ field }) => (
            <Form.Control
              {...field}
              className="form-control"
               style={{height:'32px'}}
              onChange={(e) => {
                const value = e.target.value;
                if (/[^a-zA-Z\s]/.test(value)) return;
                formik.setFieldValue("state", value);
              }}
            />
          )}
        </Field>
        <ErrorMessage name="state" component="div" className="text-danger small" />
      </Form.Group>

      <div className="d-flex justify-content-center">
      <Button
        style={{
          backgroundColor: "#00A99D",
          border: "none",
          borderRadius: "8px",
          width: "276px",
          height:'42px',
          padding: "12px",
          fontSize: "16px",
        }}
        type="submit"
      >
        Save & Continue
      </Button>
      </div>
    </FormikForm>
  )}
</Formik>
          </div>
        </div>
      </Modal.Body>
    </Modal>
    </>
  );
};

export default AddAddressModal;
