import { Checkbox, FormControlLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

// ----------------------------------------------------------------------

export function SignUpTerms({ checked, onChange, sx, ...other }) {
  return (
    <Box
      component="span"
      sx={[
        () => ({
          mt: 3,
          display: "block",
          textAlign: "center",
          typography: "caption",
          color: "text.secondary",
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* {"By signing up, I agree to "}
      <Link underline="always" color="text.primary">
        Terms of service
      </Link>
      {" and "}
      <Link underline="always" color="text.primary">
        Privacy policy
      </Link>
      .
    </Box>
  ); */}

      <FormControlLabel
        control={
          <Checkbox checked={checked} onChange={onChange} size="small" />
        }
        label={
          <Box component="span">
            {"I agree to all "}
            <Link
              underline="always"
              color="text.primary"
              href="/terms-of-service"
              target="_blank"
              rel="noopener"
            >
              Terms and conditions
            </Link>
            {/* {" and "}
            <Link
              underline="always"
              color="text.primary"
              href="/privacy-policy"
              target="_blank"
              rel="noopener"
            >
              Privacy Policy
            </Link> */}
            .
          </Box>
        }
      />
    </Box>
  );
}
