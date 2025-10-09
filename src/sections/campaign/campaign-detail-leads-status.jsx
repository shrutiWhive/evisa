import {
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  useSensor,
  useDroppable,
  DndContext,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
  KeyboardSensor,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { useState, useEffect } from "react";

import { Stack, Box, Card, Typography } from "@mui/material";

import { coordinateGetter } from "./utils";

import { CampaignDetailLeadItem } from "./campaign-detail-lead-item";
import { CampaignDetailLeadsStatusColumn } from "./campaign-detail-leads-status-column";

import { campaignClasses } from "./classes";

import { updateLeadStatus } from "src/api";
import { LEADS_STATUS } from "src/constant/lead-status";

const cssVars = {
  "--item-gap": "16px",
  "--item-radius": "12px",
  "--column-gap": "24px",
  "--column-width": "336px",
  "--column-radius": "16px",
  "--column-padding": "20px 16px 16px 16px",
};

export function CampaignDetailLeadsStatus({ leads, leadStatus }) {
  const [leadList, setLeadList] = useState([]);

  const [columns, setColumns] = useState(LEADS_STATUS);

  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    setLeadList(leads);
  }, [leads]);

  useEffect(() => {
    if (leadStatus) {
      const filteredColumns = LEADS_STATUS.filter(
        (col) => col.value === leadStatus
      );

      setColumns(filteredColumns);
    } else {
      setColumns(LEADS_STATUS);
    }
  }, [leadStatus]);

  const grouped = leadList.reduce((acc, lead) => {
    acc[lead.status] = acc[lead.status] || [];
    acc[lead.status].push(lead);
    return acc;
  }, {});

  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Require the mouse to move by 3px pixels before activating
      activationConstraint: { distance: 3 },
    }),
    useSensor(TouchSensor, {
      // Press delay of 250ms, with tolerance of 5px of movement
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter })
  );

  const columnIds = LEADS_STATUS.map((status) => status.id);

  const columnValues = LEADS_STATUS.map((status) => status.value);

  const onDragEnd = async ({ active, over }) => {
    if (!over || active.id === over.id) return;

    const draggedId = active.id;
    const droppedOnId = over.id;

    if (draggedId.startsWith("column-") && droppedOnId.startsWith("column-")) {
      const activeColumnId = draggedId.replace("column-", "");
      const overColumnId = droppedOnId.replace("column-", "");

      const activeIndex = columnValues.indexOf(activeColumnId);
      const overIndex = columnValues.indexOf(overColumnId);

      if (activeIndex === -1 || overIndex === -1) return;

      const newColumnsOrder = arrayMove(columns, activeIndex, overIndex);

      setColumns(newColumnsOrder);
      return;
    }

    if (draggedId.startsWith("lead-")) {
      const leadId = draggedId.replace("lead-", "");

      let targetStatus = null;

      if (droppedOnId.startsWith("column-")) {
        targetStatus = droppedOnId.replace("column-", "");
      } else if (droppedOnId.startsWith("lead-")) {
        const overLeadId = droppedOnId.replace("lead-", "");
        const overLead = leadList.find((l) => l.id == overLeadId);

        if (overLead) targetStatus = overLead.status;
      }

      if (!targetStatus) return;

      const movedLead = leadList.find((l) => l.id == leadId);
      if (!movedLead) return;

      const sourceStatus = movedLead.status;
      const prevLeadList = [...leadList];

      try {
        if (sourceStatus === targetStatus) {
          const currentLeads = grouped[sourceStatus] || [];
          const oldIndex = currentLeads.findIndex((l) => l.id == leadId);
          const newIndex = currentLeads.findIndex(
            (l) => l.id == droppedOnId.replace("lead-", "")
          );

          const reordered = arrayMove(currentLeads, oldIndex, newIndex);
          const rest = leadList.filter((l) => l.status !== sourceStatus);
          setLeadList([...rest, ...reordered]);

          await updateLeadStatus(leadId, {
            order: newIndex,
            status: targetStatus,
          });
        } else {
          const updated = { ...movedLead, status: targetStatus };
          const filtered = leadList.filter((l) => l.id != leadId);

          setLeadList([updated, ...filtered]);

          await updateLeadStatus(leadId, { status: targetStatus });
        }
      } catch (error) {
        console.error(error);

        setLeadList(prevLeadList);
      }
    }
  };

  return (
    <Stack spacing={3} sx={{ ...cssVars }}>
      <Typography variant="h6"> Change Lead Status </Typography>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragEnd={onDragEnd}
      >
        <Stack sx={{ flex: "1 1 auto", overflowX: "auto" }}>
          <Stack
            sx={{
              pb: 3,
              display: "flex",
              minHeight: 0,
              flex: "1 1 auto",
            }}
          >
            <Box
              sx={[
                (theme) => ({
                  display: "flex",
                  gap: "var(--column-gap)",
                  minHeight: 0,
                  flex: "1 1 auto",
                  [`& .${campaignClasses.columnList}`]: {
                    ...theme.mixins.hideScrollY,
                    flex: "1 1 auto",
                  },
                }),
              ]}
            >
              <SortableContext
                items={columnIds}
                strategy={horizontalListSortingStrategy}
              >
                {columns?.map((status) => {
                  const leadsInStatus = grouped[status.value] || [];

                  return (
                    <CampaignDetailLeadsStatusColumn
                      key={status.id}
                      column={status}
                      leads={leadsInStatus}
                      sx={{ backgroundColor: "grey.50" }}
                    >
                      <SortableContext
                        items={leadsInStatus.map((lead) => lead.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {leadsInStatus?.map((lead) => (
                          <CampaignDetailLeadItem
                            key={lead.id}
                            lead={lead}
                            sx={{ backgroundColor: status.primary_color }}
                            avatarColor={status.secondary_color}
                          />
                        ))}
                      </SortableContext>
                    </CampaignDetailLeadsStatusColumn>
                  );
                })}
              </SortableContext>
            </Box>
          </Stack>
        </Stack>
      </DndContext>
    </Stack>
  );
}
