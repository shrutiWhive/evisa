import React from "react";
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
} from "@mui/material";

import { DashboardContent } from "src/layouts/dashboard";
import { useGetVacancyDetail } from "src/api/vacancy";
import { Iconify } from "src/components/iconify";
import { useNavigate } from "react-router";

export function VacancyDetailView({ id }) {
  const navigate = useNavigate();
  const { vacancyDetail, vacancyLoading } = useGetVacancyDetail(id);

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
      <Box sx={{ py: 3 }}>
        <Container maxWidth="md" disableGutters>
          <Card
            elevation={0}
            sx={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "grey.100",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
              {/* Header with Avatar and Company Name */}
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Avatar
                  sx={{
                    width: { xs: 56, sm: 64 },
                    height: { xs: 56, sm: 64 },
                    bgcolor: "#2563eb",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    fontWeight: 600,
                    mr: 2,
                  }}
                >
                  {getInitials(vacancyDetail.employer_name)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h5"
                    component="h1"
                    sx={{
                      fontWeight: 700,
                      color: "grey.900",
                      mb: 1,
                      fontSize: { xs: "1.25rem", sm: "1.5rem" },
                    }}
                  >
                    {vacancyDetail.employer_name}
                  </Typography>
                  <Chip
                    label={vacancyDetail.status}
                    size="small"
                    color="success"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.75rem",
                      height: 24,
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Key Information Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 3,
                  mb: 4,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Iconify
                    icon="mingcute:location-fill"
                    sx={{ color: "error.main", mr: 1.5, mt: 0.3, fontSize: 20 }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      Location
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: "0.95rem",
                      }}
                    >
                      {vacancyDetail.location}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Iconify
                    icon="mdi:cash-multiple"
                    sx={{
                      color: "success.main",
                      mr: 1.5,
                      mt: 0.3,
                      fontSize: 20,
                    }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      Hourly Wage
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: "0.95rem",
                      }}
                    >
                      ${vacancyDetail.wages}/hour
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                  <Iconify
                    icon="mdi:calendar-month"
                    sx={{ color: "info.main", mr: 1.5, mt: 0.3, fontSize: 20 }}
                  />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "grey.600",
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                        mb: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      Estimated Filing Date
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        color: "grey.900",
                        fontSize: "0.95rem",
                      }}
                    >
                      {formatDate(vacancyDetail.estimated_lc_filling_date)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Job Duties Section */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "grey.900",
                    mb: 2,
                    fontSize: "1.1rem",
                  }}
                >
                  Job Duties
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 3,
                    listStyleType: "disc",
                  }}
                >
                  {jobDutiesList.map((duty, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{
                        mb: 1.5,
                        "&::marker": {
                          color: "grey.400",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: "grey.700",
                          lineHeight: 1.7,
                          fontSize: "0.875rem",
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
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "grey.900",
                      mb: 2,
                      fontSize: "1.1rem",
                    }}
                  >
                    Requirements
                  </Typography>
                  <Box
                    component="ul"
                    sx={{
                      m: 0,
                      pl: 3,
                      listStyleType: "disc",
                    }}
                  >
                    {requirementsList.map((req, index) => (
                      <Box
                        component="li"
                        key={index}
                        sx={{
                          mb: 1.5,
                          "&::marker": {
                            color: "grey.400",
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "grey.700",
                            lineHeight: 1.7,
                            fontSize: "0.875rem",
                          }}
                        >
                          {req}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 3 }} />

              {/* Benefits Section */}
              <Box>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 700,
                    color: "grey.900",
                    mb: 2,
                    fontSize: "1.1rem",
                  }}
                >
                  Benefits
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    flexWrap: "wrap",
                    gap: 1,
                  }}
                >
                  {benefitsList.map((benefit, index) => (
                    <Chip
                      key={index}
                      label={benefit}
                      // icon={<CheckCircle sx={{ fontSize: 16 }} />}
                      sx={{
                        bgcolor: "#eff6ff",
                        color: "#2563eb",
                        fontWeight: 500,
                        fontSize: "0.875rem",
                        height: 32,
                        "& .MuiChip-icon": {
                          color: "#2563eb",
                          ml: 1,
                        },
                        "& .MuiChip-label": {
                          px: 1.5,
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  size="large"
                  // onClick={handleApplyNow}
                  onClick={() => navigate("/apply")}
                  sx={{
                    bgcolor: "#2563eb",
                    color: "white",
                    fontWeight: 600,
                    px: 6,
                    py: 1.5,
                    fontSize: "1rem",
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                    "&:hover": {
                      bgcolor: "#1d4ed8",
                      boxShadow: "0 6px 16px rgba(37, 99, 235, 0.4)",
                      transform: "translateY(-2px)",
                      transition: "all 0.2s ease-in-out",
                    },
                  }}
                >
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
