import { onBoardingSlice } from "../reducer/onboardingstatus-slice";

export const { fetchOnBoardingRequest, fetchOnBoardingSuccess, fetchOnBoardingFailure } =
  onBoardingSlice.actions;
