import { useSortable } from "@dnd-kit/sortable";
import { memo, useState, useEffect, forwardRef } from "react";
import { varAlpha, mergeClasses } from "minimal-shared/utils";
import { useBoolean } from "minimal-shared/hooks";

import {
  styled,
  Stack,
  Typography,
  Avatar,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  IconButton,
} from "@mui/material";

import { campaignClasses } from "./classes";
import { Iconify } from "src/components/iconify";
import { fData, fDateTime } from "src/utils";

// ----------------------------------------------------------------------

export function CampaignDetailLeadItem({ lead, sx, avatarColor }) {
  const taskDetailsDialog = useBoolean();

  const {
    setNodeRef,
    listeners,
    isDragging,
    isSorting,
    transform,
    transition,
  } = useSortable({
    id: `lead-${lead.id}`,
  });

  const mounted = useMountStatus();
  const mountedWhileDragging = isDragging && !mounted;

  return (
    <ItemBase
      ref={setNodeRef}
      lead={lead}
      avatarColor={avatarColor}
      open={taskDetailsDialog.value}
      onClick={taskDetailsDialog.onTrue}
      stateProps={{
        transform,
        listeners,
        transition,
        sorting: isSorting,
        dragging: isDragging,
        fadeIn: mountedWhileDragging,
      }}
      sx={sx}
    />
  );
}

// ----------------------------------------------------------------------

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500);

    return () => clearTimeout(timeout);
  }, []);

  return isMounted;
}

// ----------------------------------------------------------------------

const ItemBase = forwardRef((props, ref) => {
  const { lead, open, avatarColor, stateProps, sx, ...other } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    fadeIn,
    sorting,
    disabled,
    dragging,
    dragOverlay,
    transition,
    transform,
    listeners,
  } = stateProps ?? {};
  const { phone_number, meta_data, lead_activities } = lead || {};

  useEffect(() => {
    if (!dragOverlay) {
      return;
    }

    document.body.style.cursor = "grabbing";

    // eslint-disable-next-line consistent-return
    return () => {
      document.body.style.cursor = "";
    };
  }, [dragOverlay]);

  // const renderInfo = () => (
  //   <Stack spacing={0.5} sx={{ position: "relative", p: 1 }}>
  //     <Typography variant="subtitle2" sx={{ color: "info.main" }}>
  //       {meta_data?.name}
  //     </Typography>

  //     <Typography variant="caption"> {phone_number} </Typography>
  //   </Stack>
  // );

  const renderInfo = () => (
    <Stack spacing={1} sx={{ p: 2 }}>
      {/* Top Row: Avatar + Name & Phone */}
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar sx={{ bgcolor: avatarColor, width: 40, height: 40 }} />

        <Stack spacing={0.3}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: "info.main",
              textDecoration: "underline",
            }}
          >
            {meta_data?.name}
          </Typography>

          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            {phone_number}
          </Typography>
        </Stack>
      </Stack>

      {lead_activities && (
        <Stack direction="row" alignItems="flex-start" spacing={1}>
          {/* Left side: Icon + vertical line */}
          <Stack alignItems="center" spacing={0.5}>
            <Iconify
              icon="mdi:information-slab-circle-outline"
              width={18}
              sx={{ color: "text.disabled", mt: "2px" }}
            />
            <Box
              sx={{
                width: "2px",
                height: 30,
                bgcolor: "divider",
              }}
            />
          </Stack>

          {/* Right side: Text content */}
          <Box>
            <Typography variant="caption" color="text.secondary">
              {lead_activities?.created_at
                ? fDateTime(lead_activities?.created_at)
                : "Date not available"}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, mt: 0.5, wordBreak: "break-word" }}
            >
              {lead_activities?.description || "No activity"}
            </Typography>
          </Box>
        </Stack>
      )}

      {/* Bottom Row: Icons aligned with Avatar start */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        // sx={{ pt: 1, pl: isMobile ? 0 : "56px" }} // align with avatar
      >
        {[
          { icon: "mdi:email-outline", label: "Email" },
          { icon: "mdi:message-processing-outline", label: "Message" },
          { icon: "mdi:call", label: "Call" },
        ].map((item, idx) => (
          <IconButton key={idx} size="small" aria-label={item.label}>
            <Iconify
              icon={item.icon}
              width={18}
              sx={{ color: "text.disabled" }}
            />
          </IconButton>
        ))}
      </Stack>
    </Stack>
  );

  return (
    <ItemWrap
      ref={ref}
      className={mergeClasses([campaignClasses.itemWrap], {
        [campaignClasses.state.fadeIn]: fadeIn,
        [campaignClasses.state.dragOverlay]: dragOverlay,
      })}
      style={{
        ...(!!transition && { transition }),
        ...(!!transform && {
          "--translate-x": `${Math.round(transform.x)}px`,
          "--translate-y": `${Math.round(transform.y)}px`,
          "--scale-x": `${transform.scaleX}`,
          "--scale-y": `${transform.scaleY}`,
        }),
      }}
    >
      <ItemRoot
        className={mergeClasses([campaignClasses.item], {
          [campaignClasses.state.sorting]: sorting,
          [campaignClasses.state.dragging]: dragging,
          [campaignClasses.state.disabled]: disabled,
          [campaignClasses.state.dragOverlay]: dragOverlay,
        })}
        data-cypress="draggable-item"
        tabIndex={0}
        sx={sx}
        {...listeners}
        {...other}
      >
        {renderInfo()}
      </ItemRoot>
    </ItemWrap>
  );
});

export default memo(ItemBase);

// ----------------------------------------------------------------------

const ItemWrap = styled("li")(() => ({
  "@keyframes fadeIn": {
    "0%": { opacity: 0 },
    "100%": { opacity: 1 },
  },
  display: "flex",
  transform:
    "translate3d(var(--translate-x, 0), var(--translate-y, 0), 0) scaleX(var(--scale-x, 1)) scaleY(var(--scale-y, 1))",
  transformOrigin: "0 0",
  touchAction: "manipulation",
  [`&.${campaignClasses.state.fadeIn}`]: {
    animation: "fadeIn 500ms ease",
  },
  [`&.${campaignClasses.state.dragOverlay}`]: {
    zIndex: 999,
  },
}));

const ItemRoot = styled("div")(({ theme }) => ({
  width: "100%",
  cursor: "grab",
  outline: "none",
  overflow: "hidden",
  position: "relative",
  transformOrigin: "50% 50%",
  touchAction: "manipulation",
  borderRadius: "var(--item-radius)",
  WebkitTapHighlightColor: "transparent",
  boxShadow: theme.vars.customShadows.z1,
  backgroundColor: theme.vars.palette.common.white,
  transition: theme.transitions.create(["box-shadow"]),
  ...theme.applyStyles("dark", {
    backgroundColor: theme.vars.palette.grey[900],
  }),
  [`&.${campaignClasses.state.disabled}`]: {},
  [`&.${campaignClasses.state.sorting}`]: {},
  // When move item overlay
  [`&.${campaignClasses.state.dragOverlay}`]: {
    backdropFilter: "blur(6px)",
    boxShadow: theme.vars.customShadows.z20,
    backgroundColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.48),
    ...theme.applyStyles("dark", {
      backgroundColor: varAlpha(theme.vars.palette.grey["900Channel"], 0.48),
    }),
  },
  // Placeholder when dragging item
  [`&.${campaignClasses.state.dragging}`]: {
    opacity: 0.2,
    filter: "grayscale(1)",
  },
}));
