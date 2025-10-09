import { memo, forwardRef } from "react";
import { CSS } from "@dnd-kit/utilities";
import { varAlpha, mergeClasses } from "minimal-shared/utils";
import { useSortable, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";

import { styled, Box, IconButton, Typography } from "@mui/material";

import { Iconify } from "src/components/iconify";

import { campaignClasses } from "./classes";

// ----------------------------------------------------------------------

const animateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export function CampaignDetailLeadsStatusColumn({
  children,
  column,
  leads,
  sx,
}) {
  const { id, value, label } = column;

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transition,
    active,
    over,
    transform,
  } = useSortable({
    id: `column-${value}`,
    data: { type: "container", children: leads },
    animateLayoutChanges,
  });

  const leadsIds = leads.map((lead) => lead.id);

  const isOverContainer = over
    ? (column.id === over.id && active?.data.current?.type !== "container") ||
      leadsIds.includes(over.id)
    : false;

  return (
    <ColumnBase
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      sx={sx}
      stateProps={{
        dragging: isDragging,
        overContainer: isOverContainer,
        handleProps: { ...attributes, ...listeners },
      }}
      slots={{
        header: (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6"> {label} </Typography>

            <IconButton size="small" {...attributes} {...listeners}>
              <Iconify icon="nimbus:drag-dots" />
            </IconButton>
          </Box>
        ),
        main: children,
      }}
    />
  );
}

// ----------------------------------------------------------------------

const ColumnBase = forwardRef((props, ref) => {
  const { slots, stateProps, sx, ...other } = props;

  return (
    <ColumnBaseRoot
      ref={ref}
      className={mergeClasses([campaignClasses.column], {
        [campaignClasses.state.dragging]: stateProps?.dragging,
        [campaignClasses.state.dragOverlay]: stateProps?.dragOverlay,
        [campaignClasses.state.overContainer]: stateProps?.overContainer,
      })}
      sx={sx}
      {...other}
    >
      {slots?.header && slots.header}

      {slots?.main && (
        <ColumnBaseList className={campaignClasses.columnList}>
          {slots.main}
        </ColumnBaseList>
      )}
    </ColumnBaseRoot>
  );
});

export default memo(ColumnBase);

// ----------------------------------------------------------------------

const ColumnBaseRoot = styled("div")(({ theme }) => {
  const backgroundStyles = {
    default: {
      top: 0,
      left: 0,
      content: '""',
      width: "100%",
      height: "100%",
      position: "absolute",
      borderRadius: "inherit",
      backgroundColor: "transparent",
      transition: theme.transitions.create(["background-color"]),
    },
    over: {
      backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
      ...theme.applyStyles("dark", {
        backgroundColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.16),
      }),
    },
  };

  return {
    flexShrink: 0,
    borderWidth: 1,
    height: "100%",
    display: "flex",
    position: "relative",
    borderStyle: "solid",
    flexDirection: "column",
    gap: theme.spacing(2.5),
    borderColor: "transparent",
    width: "var(--column-width)",
    padding: "var(--column-padding)",
    borderRadius: "var(--column-radius)",
    backgroundColor: theme.vars.palette.background.neutral,
    ...theme.applyStyles("dark", {
      backgroundColor: theme.vars.palette.grey[800],
    }),
    "&::before": backgroundStyles.default,
    // When move card to this column
    [`&.${campaignClasses.state.overContainer}`]: {
      "&::before": backgroundStyles.over,
    },
    // When move column overlay
    [`&.${campaignClasses.state.dragOverlay}`]: {
      backdropFilter: `blur(6px)`,
      borderColor: varAlpha(theme.vars.palette.grey["500Channel"], 0.08),
      backgroundColor: varAlpha(
        theme.vars.palette.background.neutralChannel,
        0.48
      ),
      ...theme.applyStyles("dark", {
        backgroundColor: varAlpha(theme.vars.palette.grey["800Channel"], 0.48),
      }),
    },
    // Placeholder when dragging column
    [`&.${campaignClasses.state.dragging}`]: {
      opacity: 0,
    },
  };
});

const ColumnBaseList = styled("ul")(() => ({
  minHeight: 80,
  display: "flex",
  gap: "var(--item-gap)",
  flexDirection: "column",
}));
