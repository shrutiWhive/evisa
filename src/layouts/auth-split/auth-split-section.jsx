import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export function AuthSplitSection(props) {
  const {
    sx,
    method,
    methods,
    layoutQuery = "md",
    title = "EB3 Visa",
    imgUrl = `/assets/illustrations/illustration-dashboard.webp`,
    subtitle = "Simplifying EB3 with Technology and Trust",
    disableSplit,
    ...other
  } = props;

  return (
    <Box
      sx={[
        (theme) => ({
          px: 3,
          pb: 3,
          width: 1,
          maxWidth: 480,
          display: "none",
          position: "relative",
          pt: "var(--layout-header-desktop-height)",
          [theme.breakpoints.up(layoutQuery)]: {
            gap: 8,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <div>
        <Typography variant="h3" sx={{ textAlign: "center", color: "white" }}>
          {title}
        </Typography>

        {subtitle && (
          <Typography
            sx={{
              // color: "text.secondary",
              textAlign: "center",
              mt: 2,
              color: "white",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </div>

      <Box
        component="img"
        alt="Dashboard illustration"
        src={imgUrl}
        sx={{ width: 1, aspectRatio: "4/3", objectFit: "cover" }}
      />

      {!!methods?.length && method && (
        <Box component="ul" sx={{ gap: 2, display: "flex" }}>
          {methods.map((option) => {
            const selected = method === option.label.toLowerCase();

            return (
              <Box
                key={option.label}
                component="li"
                sx={{
                  ...(!selected && {
                    cursor: "not-allowed",
                    filter: "grayscale(1)",
                  }),
                }}
              >
                <Tooltip title={option.label} placement="top">
                  <Link
                    component={RouterLink}
                    href={option.path}
                    sx={{ ...(!selected && { pointerEvents: "none" }) }}
                  >
                    <Box
                      component="img"
                      alt={option.label}
                      src={option.icon}
                      sx={{ width: 32, height: 32 }}
                    />
                  </Link>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

AuthSplitSection.propTypes = {
  sx: PropTypes.object,
  method: PropTypes.string,
  title: PropTypes.string,
  imgUrl: PropTypes.string,
  subtitle: PropTypes.string,
  methods: PropTypes.array,
  layoutQuery: PropTypes.string,
  disableSplit: PropTypes.bool || undefined,
};
