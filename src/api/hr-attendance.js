import { fetcherHr } from "src/lib/axios/hr-axios";
import { endpoints } from "./endpoints";

export const fetchDateInNepali = async () => {
  try {
    const response = await fetcherHr(endpoints.hr.nepaliDates);

    return response;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export const fetchAttendanceData = async ({ year, month }) => {
    try {
      const response = await fetcherHr(
        `${endpoints.hr.attendance}?year=${year}&month=${month}`
      );
      return response;
    } catch (error) {
      console.error("Attendance fetch failed", error);
      throw error;
    }
  };