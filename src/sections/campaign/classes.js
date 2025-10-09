import { createClasses } from "src/theme/create-classes";

// ----------------------------------------------------------------------

export const campaignClasses = {
  item: createClasses("lead__item"),
  column: createClasses("lead__column"),
  itemWrap: createClasses("lead__item__wrap"),
  columnList: createClasses("lead__column_list"),
  state: {
    fadeIn: "--fade-in",
    sorting: "--sorting",
    dragging: "--dragging",
    disabled: "--disabled",
    dragOverlay: "--drag-overlay",
    overContainer: "--over-container",
  },
};
