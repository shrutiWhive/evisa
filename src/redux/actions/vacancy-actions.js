import { vacancySlice } from "../reducer/vacancy/vacancy-slice";

export const { fetchVacancyRequest, fetchVacancySuccess, fetchVacancyFailure, setSelectedVacancyId, clearSelectedVacancyId } =
  vacancySlice.actions;
