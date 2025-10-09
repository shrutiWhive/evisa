import {
  alpha,
  Card,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Typography,
} from "@mui/material";

import { Iconify } from "src/components/iconify";
import { LEADS_STATUS } from "src/constant/lead-status";

export function CampaignDetailLeadsFilters({
  viewMode,
  onChangeViewMode,
  statusList,
  status,
  onChangeStatus,
  statusCountMap = {},
}) {
  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);
  return (
    <Card>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Left side: Select and status list horizontally */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="status-select-label"> Status </InputLabel>
            <Select
              value={status}
              onChange={(e) => onChangeStatus(e.target.value)}
              label="Status"
              labelId="status-select-label"
            >
              <MenuItem value=""> None </MenuItem>
              <Divider sx={{ borderStyle: "dashed" }} />
              {statusList.map((statusItem) => (
                <MenuItem key={statusItem} value={statusItem}>
                  {capitalizeFirstLetter(statusItem)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {LEADS_STATUS.filter((item) => statusList.includes(item.value)).map(
              (item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: status === item.value ? "grey.100" : "transparent",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      bgcolor: item.secondary_color,
                    }}
                  />
                  <Typography variant="caption">
                    {item.label} ({statusCountMap[item.value] || 0})
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Box>

        {/* Right side: View Mode Buttons */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <IconButton
            onClick={() => onChangeViewMode("status")}
            sx={(theme) => ({
              transition: "0.2s",
              ...(viewMode === "status" && {
                backgroundColor: alpha(theme.palette.info.light, 0.1),
                color: theme.palette.info.main,
              }),
              "&:hover": {
                backgroundColor:
                  viewMode === "status"
                    ? alpha(theme.palette.info.light, 0.3)
                    : theme.palette.grey[100],
              },
            })}
          >
            <Iconify icon="uim:grids" width={28} />
          </IconButton>

          <IconButton
            onClick={() => onChangeViewMode("list")}
            sx={(theme) => ({
              transition: "0.2s",
              ...(viewMode === "list" && {
                backgroundColor: alpha(theme.palette.info.light, 0.1),
                color: theme.palette.info.main,
              }),
              "&:hover": {
                backgroundColor:
                  viewMode === "list"
                    ? alpha(theme.palette.info.light, 0.3)
                    : theme.palette.grey[100],
              },
            })}
          >
            <Iconify icon="majesticons:checkbox-list" width={28} />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
}
