import { useState } from "react";

export const useOnboardingForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    countryOfBirth: "",
    citizenship1: "",
    citizenship2: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    address: "",
    email: "",
    phone: "",
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateMultipleFields = (fields) => {
    // This function allows updating multiple fields at once
    // Instead of calling `updateFormData` for each field, you can pass an object with field names as keys and new values as values
    // For example: `updateMultipleFields({ firstName: "John", middleName: "Doe" })`
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  return {
    formData,
    setFormData,
    updateFormData,
    updateMultipleFields,
  };
};
