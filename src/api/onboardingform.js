import { fetcher, poster } from "src/lib";
import { endpoints } from "./endpoints";

export const saveMainApplicantDetail = async (data) => {
  try {
    const response = await poster(endpoints.form.mainApplicantDetail, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveCurrentAddress = async (data) => {
  try {
    const response = await poster(endpoints.form.currentAddress, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveContactDetail = async (data) => {
  try {
    const response = await poster(endpoints.form.contactDetail, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveAcademicInformation = async (data) => {
  try {
    const response = await poster(endpoints.form.academicInformation, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveEnglishLanguage = async (data) => {
  try {
    const response = await poster(endpoints.form.englishlanguage, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveWorkExperiences = async (data) => {
  try {
    const response = await poster(endpoints.form.workExperiences, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveDependentInformation = async (data) => {
  try {
    const response = await poster(endpoints.form.dependentInformation, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveMaritalStatus = async (data) => {
  try {
    const response = await poster(endpoints.form.maritalStatus, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveEmergencyContact = async (data) => {
  try {
    const response = await poster(endpoints.form.emergencyContact, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveImmigrationHistory = async (data) => {
  try {
    const response = await poster(endpoints.form.immigrationHistory, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveVisa = async (data) => {
  try {
    const response = await poster(endpoints.form.visa, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveVisaRejection = async (data) => {
  try {
    const response = await poster(endpoints.form.visaRejection, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveImmigrationIncident = async (data) => {
  try {
    const response = await poster(endpoints.form.immigrationIncident, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveCriminalRecords = async (data) => {
  try {
    const response = await poster(endpoints.form.criminalRecord, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveInadmissibility = async (data) => {
  try {
    const response = await poster(endpoints.form.inadmissibility, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveHealth = async (data) => {
  try {
    const response = await poster(endpoints.form.health, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const saveFinalSubmit = async (data) => {
  try {
    const response = await poster(endpoints.form.finalSubmit, data);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchOnBoardingStatus = async (id) => {
  try {
    const response = await fetcher(endpoints.form.status);

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};
