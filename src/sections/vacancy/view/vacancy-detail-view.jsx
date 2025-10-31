import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  Divider,
  Stack,
  Container,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { useGetVacancyDetail } from "src/api/vacancy";
import { Iconify } from "src/components/iconify";
import { useNavigate } from "react-router";
import { paths } from "src/routes/paths";
import { toast } from "src/components/snackbar";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { fetchOnBoardingRequest } from "src/redux/actions";
import { useRouter } from "src/routes/hooks";
import { setSelectedVacancyId } from "src/redux/actions/vacancy-actions";

export function VacancyDetailView({ id }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { vacancyDetail, vacancyLoading } = useGetVacancyDetail(id);
  const { onBoarding, isLoading: isLoadingOnBoarding } = useAppSelector(
    (state) => state.onBoarding || { onBoarding: {}, isLoading: false }
  );

  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Fetch onboarding status on component mount
  useEffect(() => {
    dispatch(fetchOnBoardingRequest());
  }, [dispatch]);

  // Parse job duties into list items
  const jobDutiesList = vacancyDetail?.job_duties
    ? vacancyDetail.job_duties.split(",").map((duty) => duty.trim())
    : [];

  // Parse requirements into list items (handle null case)
  const requirementsList = vacancyDetail?.requirement
    ? vacancyDetail.requirement.split(",").map((req) => req.trim())
    : [];

  // Parse benefits into chips
  const benefitsList = vacancyDetail?.benefits
    ? vacancyDetail.benefits.split(",").map((benefit) => benefit.trim())
    : [];

  // Handle Apply Now click
  const handleApplyNow = async () => {
    try {
      setIsCheckingStatus(true);

      // Check onboarding status from Redux store
      const status = onBoarding?.status;

      if (status) {
        if (status === "In Progress") {
          // Redirect to apply form if In Progress
          navigate(`/apply/${id}`);
        } else if (status === "Completed") {
          // Redirect to dashboard plan if Completed

          dispatch(setSelectedVacancyId(id));
          navigate(paths.dashboard.plan);
          // router.push(paths.dashboard.plan(id));
          toast.success("Your onboarding form is already completed!");
        } else {
          // Handle other statuses - default to apply form
          navigate(`/apply/${id}`);
        }
      } else {
        // If no status found, redirect to apply form
        navigate(`/apply/${id}`);
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);

      // If error occurs, still allow navigation to apply form
      navigate(`/apply/${id}`);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return ""; // prevent crash
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardContent>
      <Box sx={{ py: { xs: 2, sm: 3 } }}>
        <Container maxWidth="md" disableGutters sx={{ px: { xs: 2, sm: 3 } }}>
          <Card
            elevation={0}
            sx={{
              boxShadow: {
                xs: "0 1px 4px rgba(0,0,0,0.06)",
                sm: "0 2px 8px rgba(0,0,0,0.08)",
              },
              borderRadius: { xs: 2, sm: 3 },
              border: "1px solid",
              borderColor: "grey.100",
            }}
          >
            <CardContent sx={{ p: { xs: 2, sm: 3, md: 4, lg: 5 } }}>
              {/* Header with Avatar and Company Name */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "center", sm: "flex-start" }}
                spacing={{ xs: 2, sm: 0 }}
                sx={{ mb: { xs: 3, sm: 4 } }}
              >
                <Avatar
                  sx={{
                    width: { xs: 64, sm: 72, md: 80 },
                    height: { xs: 64, sm: 72, md: 80 },
                    bgcolor: theme.palette.primary.main,
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                    fontWeight: 600,
                    mr: { xs: 0, sm: 2, md: 3 },
                  }}
                >
                  {getInitials(vacancyDetail.employer_name)}
                </Avatar>
                <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: "grey.900",
                      mb: { xs: 1, sm: 1.5 },
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                      wordBreak: "break-word",
                    }}
                  >
                    {vacancyDetail.employer_name}
                  </Typography>
                  <Chip
                    label={vacancyDetail.status}
                    size="small"
                    color="secondary"
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      height: { xs: 26, sm: 28 },
                    }}
                  />
                </Box>
              </Stack>

              <Divider sx={{ my: { xs: 2, sm: 3 } }} />

              {/* Key Information Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                  gap: { xs: 2, sm: 2.5, md: 3 },
                  mb: { xs: 3, sm: 4 },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    bgcolor: "info.lighter",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Iconify
                    icon="mingcute:location-fill"
                    sx={{
                      color: "error.main",
                      mr: { xs: 1, sm: 1.5 },
                      mt: 0.3,
                      fontSize: { xs: 18, sm: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    >
                      Location
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        wordBreak: "break-word",
                      }}
                    >
                      {vacancyDetail.location}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    bgcolor: "success.lighter",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Iconify
                    icon="mdi:cash-multiple"
                    sx={{
                      color: "success.main",
                      mr: { xs: 1, sm: 1.5 },
                      mt: 0.3,
                      fontSize: { xs: 18, sm: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    >
                      Hourly Wage
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                      }}
                    >
                      ${vacancyDetail.wages}/hour
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: { xs: 1.5, sm: 2 },
                    bgcolor: "secondary.lighter",
                    transition: "all 0.2s ease-in-out",
                    gridColumn: { xs: "1", sm: "span 2", md: "auto" },
                    "&:hover": {
                      bgcolor: "grey.100",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    },
                  }}
                >
                  <Iconify
                    icon="mdi:calendar-month"
                    sx={{
                      color: "info.main",
                      mr: { xs: 1, sm: 1.5 },
                      mt: 0.3,
                      fontSize: { xs: 18, sm: 20 },
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                        fontSize: { xs: "0.65rem", sm: "0.7rem" },
                      }}
                    >
                      Estimated Filing Date
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: { xs: "0.85rem", sm: "0.95rem" },
                        wordBreak: "break-word",
                      }}
                    >
                      {formatDate(vacancyDetail.estimated_lc_filling_date)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: { xs: 2, sm: 3 } }} />

              {/* Job Duties Section */}
              <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "grey.900",
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Job Duties
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: { xs: 2.5, sm: 3 },
                    listStyleType: "disc",
                  }}
                >
                  {jobDutiesList.map((duty, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: { xs: 1, sm: 1.5 },
                        "&::marker": {
                          color: "grey.400",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "grey.700",
                          lineHeight: { xs: 1.6, sm: 1.7 },
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                      >
                        {duty}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* Requirements Section */}
              {requirementsList.length > 0 && (
                <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "grey.900",
                      mb: { xs: 1.5, sm: 2 },
                      fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                    }}
                  >
                    Requirements
                  </Typography>
                  <Box
                    component="ul"
                    sx={{
                      m: 0,
                      pl: { xs: 2.5, sm: 3 },
                      listStyleType: "disc",
                    }}
                  >
                    {requirementsList.map((req, index) => (
                      <Box
                        component="li"
                        key={index}
                        sx={{
                          mb: { xs: 1, sm: 1.5 },
                          "&::marker": {
                            color: "grey.400",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "grey.700",
                            lineHeight: { xs: 1.6, sm: 1.7 },
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                          }}
                        >
                          {req}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: { xs: 2, sm: 3 } }} />

              {/* Benefits Section */}
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "grey.900",
                    mb: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  }}
                >
                  Benefits
                </Typography>
                <Stack
                  direction="row"
                  spacing={{ xs: 0.75, sm: 1 }}
                  sx={{
                    flexWrap: "wrap",
                    gap: { xs: 0.75, sm: 1 },
                  }}
                >
                  {benefitsList.map((benefit, index) => (
                    <Chip
                      key={index}
                      label={benefit}
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: "white",
                        fontWeight: 500,
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        height: { xs: 28, sm: 32 },
                        "& .MuiChip-icon": {
                          color: theme.palette.primary.main,
                          ml: 1,
                        },
                        "& .MuiChip-label": {
                          px: { xs: 1, sm: 1.5 },
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ my: { xs: 3, sm: 4 } }} />

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleApplyNow}
                  // disabled={isCheckingStatus || isLoadingOnBoarding}
                  fullWidth={false}
                  // startIcon={
                  //   isCheckingStatus || isLoadingOnBoarding ? (
                  //     <CircularProgress size={20} color="inherit" />
                  //   ) : null
                  // }
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    fontWeight: 600,
                    px: { xs: 4, sm: 6 },
                    py: { xs: 1.25, sm: 1.5 },
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    textTransform: "none",
                    borderRadius: { xs: 1.5, sm: 2 },
                    minWidth: { xs: "100%", sm: "auto" },
                    maxWidth: { xs: "100%", sm: 300 },
                    boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                      boxShadow: `0 6px 16px ${theme.palette.primary.main}60`,
                      transform: "translateY(-2px)",
                      transition: "all 0.2s ease-in-out",
                    },
                    "&:disabled": {
                      bgcolor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                    },
                  }}
                >
                  {/* {isCheckingStatus || isLoadingOnBoarding ? "Loading..." : "Apply Now"} */}
                  Apply Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </DashboardContent>
  );
}
