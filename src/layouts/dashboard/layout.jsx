import { merge } from "es-toolkit";
import { useEffect } from "react";
import { useBoolean } from "minimal-shared/hooks";

import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import { iconButtonClasses } from "@mui/material/IconButton";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  fetchProfileRequest,
  fetchAllPermissionsRequest,
  fetchCurrentUserPermissionsRequest,
  fetchSiteSettingRequest,
} from "src/redux/actions";
import {
  selectAuthState,
  selectPermissionState,
  selectProfileState,
} from "src/redux/selectors";

import { Label } from "src/components/label";
import { Iconify } from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";

import { NavMobile } from "./nav-mobile";
import { NavVertical } from "./nav-vertical";
import { layoutClasses } from "../core/classes";
import { NavHorizontal } from "./nav-horizontal";
import { MainSection } from "../core/main-section";
import { MenuButton } from "../components/menu-button";
import { HeaderSection } from "../core/header-section";
import { LayoutSection } from "../core/layout-section";
import { accountNavData } from "../nav-config-account";
import { AccountPopover } from "../components/account-popover";
import {
  navData as dashboardNavData,
  formatNavData,
} from "../nav-config-dashboard";
import { dashboardLayoutVars, dashboardNavColorVars } from "./css-vars";
import { Box, Typography } from "@mui/material";

// ----------------------------------------------------------------------

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = "lg",
}) {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const settings = useSettingsContext();

  const { isLogin } = useAppSelector(selectAuthState);

  const { isLoading: currentUserPermissionsLoading, currentUserPermissions } =
    useAppSelector(selectPermissionState);

  const { profile } = useAppSelector(selectProfileState);

  // const dynamicNavData = [
  //   {
  //     items: [...currentUserPermissions]
  //       .sort((a, b) => a.position - b.position)
  //       .map(formatNavData),
  //   },
  // ];

  const dynamicNavData = [
    {
      items: currentUserPermissions
        .filter((item) => item.is_active) // Filter root items too
        .sort((a, b) => a.position - b.position)
        .map(formatNavData)
        .filter(Boolean), // Remove nulls from formatting
    },
  ];

  const navVars = dashboardNavColorVars(
    theme,
    settings.state.navColor,
    settings.state.navLayout
  );

  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();

  const isNavMini = settings.state.navLayout === "mini";
  const isNavHorizontal = settings.state.navLayout === "horizontal";
  const isNavVertical = isNavMini || settings.state.navLayout === "vertical";
  useEffect(() => {
    dispatch(fetchSiteSettingRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!isLogin) return;

    dispatch(fetchCurrentUserPermissionsRequest());

    dispatch(fetchProfileRequest());
  }, [dispatch, isLogin]);

  const navigationData = !currentUserPermissions?.length
    ? dashboardNavData
    : dynamicNavData;


  const renderHeader = () => {
    const headerSlotProps = {
      container: {
        maxWidth: false,
        sx: {
          ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
          ...(isNavHorizontal && {
            bgcolor: "var(--layout-nav-bg)",
            height: { [layoutQuery]: "var(--layout-nav-horizontal-height)" },
            [`& .${iconButtonClasses.root}`]: {
              color: "var(--layout-nav-text-secondary-color)",
            },
          }),
        },
      },
    };

    const headerSlots = {
      topArea: (
        <Alert severity="info" sx={{ display: "none", borderRadius: 0 }}>
          This is an info Alert.
        </Alert>
      ),
      bottomArea: isNavHorizontal ? (
        <NavHorizontal
          data={navigationData}
          layoutQuery={layoutQuery}
          cssVars={navVars.section}
        />
      ) : null,
      leftArea: (
        <>
          {/** @slot Nav mobile */}
          <MenuButton
            onClick={onOpen}
            sx={{
              mr: 1,
              ml: -1,
              [theme.breakpoints.up(layoutQuery)]: { display: "none" },
            }}
          />
          <NavMobile
            data={navigationData}
            open={open}
            onClose={onClose}
            cssVars={navVars.section}
          />
        </>
      ),
      rightArea: (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Credit Amount Text */}
          <Box
            sx={{
              gap: 1,
              display: "flex",
              alignItems: "center",
              color: "primary.main",
            }}
          >
            <Iconify icon="solar:wallet-money-bold" width={22} />

            <Label color="primary">
              Remaining Credits: {profile?.credit || 0}
            </Label>
          </Box>

          {/* Account Popover */}
          <AccountPopover data={accountNavData} />
        </Box>
      ),
    };

    return (
      <HeaderSection
        layoutQuery={layoutQuery}
        disableElevation={isNavVertical}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderSidebar = () => (
    <NavVertical
      data={navigationData}
      isNavMini={isNavMini}
      layoutQuery={layoutQuery}
      cssVars={navVars.section}
      onToggleNav={() =>
        settings.setField(
          "navLayout",
          settings.state.navLayout === "vertical" ? "mini" : "vertical"
        )
      }
    />
  );

  const renderFooter = () => null;

  const renderMain = () => (
    <MainSection {...slotProps?.main}>{children}</MainSection>
  );

  return (
    <LayoutSection
      /** **************************************
       * @Header
       *************************************** */
      headerSection={renderHeader()}
      /** **************************************
       * @Sidebar
       *************************************** */
      sidebarSection={isNavHorizontal ? null : renderSidebar()}
      /** **************************************
       * @Footer
       *************************************** */
      footerSection={renderFooter()}
      /** **************************************
       * @Styles
       *************************************** */
      cssVars={{ ...dashboardLayoutVars(theme), ...navVars.layout, ...cssVars }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: isNavMini
                ? "var(--layout-nav-mini-width)"
                : "var(--layout-nav-vertical-width)",
              transition: theme.transitions.create(["padding-left"], {
                easing: "var(--layout-transition-easing)",
                duration: "var(--layout-transition-duration)",
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
