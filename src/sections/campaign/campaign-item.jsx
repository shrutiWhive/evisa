import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button } from "@mui/material";

import { RouterLink } from "src/routes/components";

import { fDate } from "src/utils/format-time";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

export function CampaignItem({
  sx,
  campaign,
  index,
  editHref,
  detailsHref,
  leadNurturing,
  ...other
}) {
  const menuActions = usePopover();

  const buttonColors = [
    {
      backgroundColor: "primary.lighter",
      color: "primary.main",
      "&:hover": { backgroundColor: "primary.light" },
    },

    {
      backgroundColor: "success.lighter",
      color: "success.main",
      "&:hover": { backgroundColor: "success.light" },
    },
    {
      backgroundColor: "info.lighter",
      color: "info.main",
      "&:hover": { backgroundColor: "info.light" },
    },
  ];

  const buttonSx = buttonColors[index % 3];

  const {
    name,
    description,
    created_at,
    qr_code_url,
    topup_amount,
    total_leads,
    is_active,
    ntc_reward_type,
    ncell_reward_type,
  } = campaign;

  const renderMenuActions = () => (
    <CustomPopover
      open={menuActions.open}
      anchorEl={menuActions.anchorEl}
      onClose={menuActions.onClose}
      slotProps={{ arrow: { placement: "bottom-center" } }}
    >
      <MenuList>
        <li>
          <MenuItem
            component={RouterLink}
            href={detailsHref}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:eye-bold" />
            View
          </MenuItem>
        </li>

        <li>
          <MenuItem
            component={RouterLink}
            href={editHref}
            onClick={() => menuActions.onClose()}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </li>
      </MenuList>
    </CustomPopover>
  );

  return (
    <>
      <Card
        sx={[
          {
            display: "flex",
            "&:hover": {
              boxShadow: 6,
              transform: "scale(1.01)",
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Stack
          spacing={2}
          sx={[
            (theme) => ({
              flexGrow: 1,
              p: 3,
            }),
          ]}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Label variant="soft" color={is_active ? "success" : "error"}>
              {is_active ? "Active" : "Inactive"}
            </Label>

            <Box sx={{ gap: 1, display: "flex", alignItems: "center" }}>
              <Box
                component="span"
                sx={{ typography: "caption", color: "text.red" }}
              >
                {fDate(created_at)}
              </Box>

              <IconButton
                color={menuActions.open ? "inherit" : "default"}
                onClick={menuActions.onOpen}
              >
                <Iconify icon="eva:more-horizontal-fill" />
              </IconButton>
            </Box>
          </Box>

          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Link
                component={RouterLink}
                href={detailsHref}
                color="inherit"
                variant="subtitle1"
                sx={[
                  (theme) => ({
                    ...theme.mixins.maxLine({ line: 2 }),
                  }),
                ]}
              >
                {name}
              </Link>

              <Button
                size="small"
                variant="soft"
                color="info"
                component={RouterLink}
                href={leadNurturing}
                startIcon={<Iconify icon="famicons:person" width={18} />}
                sx={{
                  whiteSpace: "nowrap",
                  backgroundColor: "primary.lighter",
                }}
              >
                Lead Communication
              </Button>
            </Box>

            <Typography
              variant="body2"
              sx={[
                (theme) => ({
                  ...theme.mixins.maxLine({ line: 2 }),
                  color: "text.secondary",
                }),
              ]}
            >
              {description}
            </Typography>
          </Stack>

          <Box
            sx={{
              gap: 1,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Rewards
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  color:
                    ntc_reward_type === "Topup"
                      ? "success.main"
                      : ntc_reward_type === "Data"
                      ? "info.main"
                      : ntc_reward_type === "None"
                      ? "info.main"
                      : "error.main",
                }}
              >
                NTC Reward: {ntc_reward_type}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color:
                    ncell_reward_type === "Topup"
                      ? "success.main"
                      : ncell_reward_type === "Data"
                      ? "info.main"
                      : ncell_reward_type === "None"
                      ? "error.main"
                      : "warning.main",
                }}
              >
                NCELL Reward: {ncell_reward_type}
              </Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Total Leads
              </Typography>

              <Typography variant="subtitle2">{total_leads}</Typography>
            </Stack>

            <Stack spacing={1}>
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                QR Code
              </Typography>

              <Iconify icon="solar:qr-code-bold" />
            </Stack>
          </Box>
        </Stack>
      </Card>

      {renderMenuActions()}
    </>
  );
}
