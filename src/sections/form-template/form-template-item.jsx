import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { RouterLink } from "src/routes/components";

import { fDate } from "src/utils/format-time";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";

// ----------------------------------------------------------------------

const CARD_BG_COLORS = [
  "#E3F2FD", // Light Blue
  "#E8F5E9", // Light Green
  "#E0F7FA", // Light Cyan
];

export function FormTemplateItem({
  sx,
  index = 0,
  formTemplate,
  editHref,
  detailsHref,
  ...other
}) {
  const { name, description, created_at, is_active, fields, created_by } =
    formTemplate;

  const menuActions = usePopover();

  const bgColor = CARD_BG_COLORS[index % CARD_BG_COLORS.length];

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
            transition: "0.3s",
            cursor: "pointer",
            backgroundColor: bgColor,
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
                sx={{ typography: "caption", color: "text.disabled" }}
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
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Typography
              variant="caption"
              sx={{ color: "primary.main", fontWeight: "bold" }}
            >
              Created by: {created_by}
            </Typography>
          </Box>
        </Stack>
      </Card>

      {renderMenuActions()}
    </>
  );
}
