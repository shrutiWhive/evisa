import { useId, forwardRef } from "react";
import { mergeClasses } from "minimal-shared/utils";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";

import { RouterLink } from "src/routes/components";

import { useAppSelector } from "src/redux/hooks";
import { selectSiteSetting } from "src/redux/selectors";

import { logoClasses } from "./classes";

// ----------------------------------------------------------------------

export const Logo = forwardRef((props, ref) => {
  const {
    className,
    href = "/dashboard",
    isSingle = true,
    disabled,
    logoUrl,
    sx,
    ...other
  } = props;

  const theme = useTheme();
  const gradientId = useId();

  const fallbackLogo = "/logo/logo-color.png";

  const { siteSetting } = useAppSelector(selectSiteSetting);

  const logoSource = logoUrl || siteSetting?.favicon || fallbackLogo;

  const logoImg = (
    <img
      alt="Site logo"
      src={logoSource}
      width="100%"
      height="100%"
      style={{ objectFit: "contain" }}
    />
  );

  return (
    <LogoRoot
      ref={ref}
      component={RouterLink}
      href={href}
      aria-label="Logo"
      underline="none"
      className={mergeClasses([logoClasses.root, className])}
      sx={[
        () => ({
          display: "flex",
          alignItems: "center",
          gap: 1,
          ...(disabled && { pointerEvents: "none" }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        sx={{
          height: isSingle ? 40 : 36,
          flexShrink: 0,
        }}
      >
        {logoImg}
      </Box>

      {/* {siteSetting?.site_name && (
        <Typography
          variant="h7"
          sx={{
            color: "white",
            fontWeight: 600,
          }}
        >
          {siteSetting.site_name}
        </Typography>
      )} */}
    </LogoRoot>
  );
});

// ----------------------------------------------------------------------

const LogoRoot = styled(Link)(() => ({
  flexShrink: 0,
  display: "inline-flex",
  alignItems: "center",
  verticalAlign: "middle",
  textDecoration: "none",
  justifyContent: "center",
}));
