// You can place this in a separate file like 'memberSchema.js' and import it.
import { z } from "zod";

export const memberSchema = z.object({
    fullName: z
      .string()
      .min(1, "Full name is required.")
      .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes."),
    
    dob: z
      .string()
      .min(1, "Date of birth is required.")
      .refine((date) => new Date(date) <= new Date(), "Date of birth cannot be in the future."),

    mobileNumber: z
      .string()
      .min(1, "Mobile number is required.")
      .regex(/^\d{10}$/, "Mobile number must be 10 digits."),
      
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Email is invalid."),
      
    gender: z
      .string()
      .min(1, "Please select a gender."),
      
    relation: z
      .string()
      .min(1, "Please select a relation."),
      
    customRelation: z
      .string()
      .optional(), // Make it optional by default
      
    address: z
      .string()
      .min(1, "Address is required."),
      
    pinCode: z
      .string()
      .min(1, "Pin code is required.")
      .regex(/^\d{6}$/, "Pin code must be 6 digits."),

  }).refine((data) => {
    // If 'relation' is 'other', 'customRelation' must not be empty.
    if (data.relation === "other") {
      return data.customRelation && data.customRelation.length > 0;
    }
    return true; // Otherwise, this validation passes.
  }, {
    // Custom error message for the refined rule.
    message: "Please specify the relation.",
    path: ["customRelation"], // The error will be attached to the 'customRelation' field.
});