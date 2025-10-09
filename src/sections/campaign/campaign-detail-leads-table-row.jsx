import { meta } from "@eslint/js";
import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  Box,
  Avatar,
  Stack,
  Checkbox,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { followupLeads, reRewardLeads } from "src/api";
import { Iconify } from "src/components/iconify";
import { LEADS_STATUS } from "src/constant/lead-status";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import { toast } from "src/components/snackbar";

import { fDateTime } from "src/utils";

import { selectAuthState } from "src/redux/selectors";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";

import dayjs from "dayjs";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import {
  setLeadFollowUp,
  setPaginationState,
  setSelectedLeadId,
} from "src/redux/actions/lead-actions";

export function CampaignDetailLeadsTableRow({
  row,
  metaKeys,
  selected,
  onSelectRow,
}) {
  const { id, phone_number, meta_data, lead_activities, topup_status } = row;
  const dispatch = useAppDispatch();
  // const isSelected = selectedLeadIds.includes(row.id);

  const [status, setStatus] = useState(row.status);
  const router = useRouter();
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [followupDialogOpen, setFollowupDialogOpen] = useState(false);
  const statusColor = topup_status === "pending" ? "warning" : "success";

  const getLeadStatus = (value) =>
    LEADS_STATUS.find((item) => item.value === value);
  const { user, token } = useAppSelector(selectAuthState);

  const orgId = user?.organization_id;
  const [tempDateTime, setTempDateTime] = useState(dayjs());

  // useEffect(() => {
  //   if (!orgId) return undefined;

  //   const channelName = `lead-status.org.${orgId}`;
  //   const channel = echo.channel(channelName);

  //   const eventName = "App\\Events\\LeadStatusUpdated";

  //   channel.listen(eventName, (data) => {
  //     console.log("Lead status updated:", data);
  //   });

  //   return () => {
  //     console.log(`Leaving channel: ${channelName}`);
  //     echo.leave(channelName);
  //   };
  // }, [orgId]);

  const statusLead = getLeadStatus(status);
  const avatarColor = statusLead?.secondary_color || "#90caf9";
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);

  // const updatedFollowups = useAppSelector((state) => state.lead.followUp);

  const updatedFollowup = useAppSelector(
    (state) => state.lead.followUp?.[String(row.id)]
  );
  const followUp = updatedFollowup || row.lead_followups?.[0];
  console.log("this is activity, lead_activities", followUp);

  // const fallbackFollowup = row.lead_followups?.[0];

  // const activeFollowup = updatedFollowup || fallbackFollowup;

  const selectedLeadId = useAppSelector((state) => state.lead.selectedLeadId);
  const pageIndex = useAppSelector((state) => state.lead.pageIndex);
  const pageSize = useAppSelector((state) => state.lead.pageSize);
  const isSelected = selectedLeadId === row.id;

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "email":
        return (
          <Iconify
            icon="mdi:email-edit-outline"
            width={20}
            height={20}
            color="#1976d2"
          />
        );
      case "call":
        return (
          <Iconify
            icon="mdi:card-account-phone"
            width={20}
            height={20}
            color="#2e7d32"
          />
        );
      case "sms":
        return (
          <Iconify
            icon="mdi:message-text"
            width={20}
            height={20}
            color="#0288d1"
          />
        );
      case "meeting":
        return (
          <Iconify
            icon="mdi:virtual-meeting"
            width={20}
            height={20}
            color="#6a1b9a"
          />
        );
      case "status_update":
        return (
          <Iconify
            icon="mdi:settings-refresh-outline"
            width={20}
            height={20}
            color="#0288d1"
          />
        );
      default:
        return (
          <Iconify
            icon="mdi:information-outline"
            width={20}
            height={20}
            color="#0288d1"
          />
        );
    }
  };

  const handleClick = () => {
    dispatch(setSelectedLeadId(row.id)); // ✅ save clicked lead ID
    dispatch(setPaginationState({ pageIndex, pageSize }));
    router.push(paths.dashboard.leadDetail.detail(row.id));
  };

  const handleRewardClick = (e) => {
    e.stopPropagation();
    setRewardDialogOpen(true);
  };

  const handleFollowupClick = (e) => {
    e.stopPropagation();
    setFollowupDialogOpen(true);
  };

  const handleRewardConfirm = async () => {
    setIsLoading(true);
    try {
      const response = await reRewardLeads(row.id);

      toast.success(response.message || "Lead successfully rewarded!");
      // setRewardDialogOpen(false);
    } catch (error) {
      toast.error(
        error?.message || "Failed to reward the lead. Please try again."
      );
    } finally {
      setIsLoading(false);
      setRewardDialogOpen(false);
    }
  };

  const handleRewardCancel = () => {
    setRewardDialogOpen(false);
  };

  const handleFollowupCancel = () => {
    setFollowupDialogOpen(false);
  };

  const handleFollowupLead = async () => {
    setIsLoadingSchedule(true);
    try {
      const response = await followupLeads(row.id, {
        date_time: tempDateTime.format("YYYY-MM-DD HH:mm:ss"),
      });

      const latestFollowup = response.data.lead_followups?.[0];
      console.log("thisis latest response", latestFollowup);
      dispatch(
        setLeadFollowUp({
          leadId: String(row.id), // ensure it's string to match selector
          followUpData: latestFollowup,
        })
      );
      toast.success(response.message || "Lead schedule successfully !");
      // setRewardDialogOpen(false);
    } catch (error) {
      toast.error(
        error?.message || "Failed to reward the lead. Please try again."
      );
    } finally {
      setIsLoadingSchedule(false);
      setFollowupDialogOpen(false);
    }
  };

  return (
    <>
      <TableRow
        hover
        onClick={handleClick}
        sx={{
          backgroundColor: isSelected ? "#E3F2FD" : "inherit",
          transition: "background-color 0.3s ease",
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={selected}
            onClick={(e) => {
              e.stopPropagation();
              onSelectRow();
            }}
          />
        </TableCell>

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ bgcolor: avatarColor, width: 40, height: 40 }} />

            <Typography variant="body2">{phone_number}</Typography>
          </Stack>
        </TableCell>

        {/* {metaKeys.map((key) => (
      <TableCell key={key}>
        {" "}
        {key === "known_date" && meta_data[key]
          ? fDateTime(meta_data[key])
          : meta_data[key]}
      </TableCell>
    ))} */}

        {/* {Object.entries(meta_data || {})
      .slice(0, 3)
      .map(([key, value]) => (
        <TableCell key={key}>
          {key === "known_date" ? fDateTime(value) : String(value)}
        </TableCell>
      ))} */}

        {metaKeys.map((key) => (
          <TableCell key={key}>
            {key === "known_date" && meta_data?.[key]
              ? fDateTime(meta_data[key])
              : meta_data?.[key] || "-"}
          </TableCell>
        ))}
        <TableCell>
          {lead_activities ? (
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              {getActivityIcon(lead_activities.type)}

              <Box>
                <Typography variant="body2">{lead_activities.title}</Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "primary.main", whiteSpace: "nowrap" }}
                >
                  {lead_activities.updated_by
                    ? `updated by: ${lead_activities.updated_by}`
                    : `created by: ${lead_activities.created_by}`}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "text.disabled" }}>
              No activity
            </Typography>
          )}
        </TableCell>

        <TableCell>
          <Chip
            label={topup_status}
            color={statusColor}
            size="small"
            variant="soft"
          />
        </TableCell>

        <TableCell>
          {status
            ? (() => {
                const statusInfo = getLeadStatus(status);
                return statusInfo ? (
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      display: "inline-block",
                      backgroundColor: statusInfo.primary_color,
                      fontWeight: 500,
                      fontSize: 13,
                      textTransform: "capitalize",
                      minWidth: 80,
                      textAlign: "center",
                    }}
                  >
                    {statusInfo.label}
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {status}
                  </Typography>
                );
              })()
            : "-"}
        </TableCell>

        {/* <TableCell align="center" sx={{ minWidth: 250 }}>
          <Tooltip title="Click to schedule follow-up" placement="top">
            <Box sx={{ width: "100%" }}>
              {row.lead_followups && row.lead_followups.length > 0 ? (
                <Box
                  key={row.lead_followups[0].id}
                  onClick={handleFollowupClick}
                  sx={{
                    bgcolor: dayjs(row.lead_followups[0].date_time).isBefore(
                      dayjs()
                    )
                      ? "error.main"
                      : "success.main",
                    color: "common.white",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textAlign: "left",
                    width: "fit-content",
                    maxWidth: 280,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 13, mt: 0.3 }}>
                    {dayjs(row.lead_followups[0].date_time).format(
                      "YYYY-MM-DD hh:mm A"
                    )}
                  </Typography>

                  {!dayjs(row.lead_followups[0].date_time).isBefore(
                    dayjs()
                  ) && (
                    <Typography
                      variant="caption"
                      sx={{ fontSize: 12, mt: 0.3 }}
                    >
                      {(() => {
                        const followupDate = dayjs(
                          row.lead_followups[0].date_time
                        );
                        const now = dayjs();
                        const duration = dayjs.duration(followupDate.diff(now));
                        return `${duration.days()} days ${duration.hours()} hours ${duration.minutes()} mins`;
                      })()}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleFollowupClick}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.light",
                      borderColor: "primary.dark",
                    },
                  }}
                >
                  + Schedule Follow-up
                </Button>
              )}
            </Box>
          </Tooltip>
        </TableCell> */}

        <TableCell align="center" sx={{ minWidth: 250 }}>
          <Tooltip title="Click to schedule follow-up" placement="top">
            <Box sx={{ width: "100%" }}>
              {followUp ? (
                <Box
                  onClick={handleFollowupClick}
                  sx={{
                    bgcolor: dayjs(followUp.date_time).isBefore(dayjs())
                      ? "error.main"
                      : "success.main",
                    color: "common.white",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textAlign: "left",
                    width: "fit-content",
                    maxWidth: 280,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 13 }}>
                    {dayjs(followUp.date_time).format("YYYY-MM-DD hh:mm A")}
                  </Typography>

                  {!dayjs(followUp.date_time).isBefore(dayjs()) && (
                    <Typography variant="caption" sx={{ fontSize: 12 }}>
                      {(() => {
                        const followupDate = dayjs(followUp.date_time);
                        const now = dayjs();
                        const duration = dayjs.duration(followupDate.diff(now));
                        return `${duration.days()} days ${duration.hours()} hours ${duration.minutes()} mins`;
                      })()}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleFollowupClick}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    borderColor: "primary.main",
                    color: "primary.main",
                    "&:hover": {
                      bgcolor: "primary.light",
                      borderColor: "primary.dark",
                    },
                  }}
                >
                  + Schedule Follow-up
                </Button>
              )}
            </Box>
          </Tooltip>
        </TableCell>

        <TableCell>
          {topup_status === "pending" || topup_status === "failed" ? (
            <Tooltip title="Click to re-reward the leads" arrow>
              <Button
                variant="contained"
                color="info"
                fullWidth
                sx={{ mb: 1 }}
                onClick={handleRewardClick}
              >
                Reward
              </Button>
            </Tooltip>
          ) : null}
        </TableCell>
      </TableRow>
      <Dialog open={rewardDialogOpen} onClose={handleRewardCancel}>
        <DialogTitle>Confirm Reward</DialogTitle>
        <DialogContent>
          <Typography>Do you want to reward the lead?</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Name:</strong>{" "}
            {meta_data?.full_name || meta_data?.name || "-"}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong> Phone Number:</strong> {phone_number}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleRewardCancel}
            color="inherit"
            disabled={isLoading}
          >
            No
          </Button>
          <Button
            onClick={handleRewardConfirm}
            variant="contained"
            color="info"
            disabled={isLoading}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={followupDialogOpen}
        onClose={handleFollowupCancel}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Schedule Follow-up</DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <MobileDateTimePicker
              value={tempDateTime}
              onChange={(newValue) => setTempDateTime(newValue)}
              format="YYYY-MM-DD HH:mm:ss"
              slotProps={{
                textField: {
                  fullWidth: true,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            color="inherit"
            onClick={handleFollowupCancel}
            disabled={isLoadingSchedule}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => {
              // Replace this with actual API logic
              handleFollowupLead();

              setFollowupDialogOpen(false);
            }}
            disabled={isLoadingSchedule}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {isLoadingSchedule && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      )}
    </>
  );
}
