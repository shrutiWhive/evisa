import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { paths } from "src/routes/paths";
import { usePathname } from "src/routes/hooks";
import { RouterLink } from "src/routes/components";

import { Label } from "src/components/label";
import { CustomPopover } from "src/components/custom-popover";

import { useAppSelector } from "src/redux/hooks";
import { selectProfileState } from "src/redux/selectors";

import { AccountButton } from "./account-button";
import { SignOutButton } from "./sign-out-button";

// ----------------------------------------------------------------------

// function CreditCard({ name, email, creditAmount = 0, sx = {} }) {
//   return (
//     <Box
//       sx={[
//         {
//           p: 2,
//           borderRadius: 2,
//           color: "common.white",
//           background:
//             "linear-gradient(180deg, #5383ff 0%, rgba(53, 73, 255, 0.7) 100%)",
//           boxShadow: "0 4px 14px rgb(0 0 0 / 0.25)", // adding depth
//           position: "relative",
//           overflow: "hidden",
//         },
//         ...(Array.isArray(sx) ? sx : [sx]),
//       ]}
//     >
//       {/* <Typography variant="body2" sx={{ fontStyle: "italic" }}>
//         Remaining Credit {creditAmount}{" "}
//       </Typography> */}

//       <Box mt={2}>
//         <Typography variant="body1">{name}</Typography>

//         <Typography variant="body2">{email}</Typography>
//       </Box>
//     </Box>
//   );
// }

export function AccountPopover({ data = [], sx, ...other }) {
  const pathname = usePathname();

  const { open, anchorEl, onClose, onOpen } = usePopover();

  const { profile } = useAppSelector(selectProfileState);

  const { name, email } = profile || {};

  const renderMenuActions = () => (
    <CustomPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      slotProps={{ paper: { sx: { p: 0, width: 230 } }, arrow: { offset: 20 } }}
    >
      {/* <Box sx={{ p: 2, pb: 1.5 }}>
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
          {email}
        </Typography>
      </Box> */}

      {/* <Box sx={{ p: 2 }}>
        <CreditCard
          name={name}
          email={email}
          creditAmount={profile?.credit || 0}
        />
      </Box> */}

      {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

      {/* <Divider sx={{ borderStyle: "dashed" }} /> */}

      <MenuList sx={{ p: 1, my: 1, "& li": { p: 0 } }}>
        {data.map((option) => {
          const rootLabel = pathname.includes("/dashboard")
            ? "Home"
            : "Dashboard";
          const rootHref = pathname.includes("/dashboard")
            ? "/"
            : paths.dashboard.root;

          return (
            <MenuItem key={option.label}>
              <Link
                component={RouterLink}
                href={option.label === "Home" ? rootHref : option.href}
                color="inherit"
                underline="none"
                onClick={onClose}
                sx={{
                  px: 1,
                  py: 0.75,
                  width: 1,
                  display: "flex",
                  typography: "body2",
                  alignItems: "center",
                  color: "text.secondary",
                  "& svg": { width: 24, height: 24 },
                  "&:hover": { color: "text.primary" },
                }}
              >
                {option.icon}

                <Box component="span" sx={{ ml: 2 }}>
                  {option.label === "Home" ? rootLabel : option.label}
                </Box>

                {option.info && (
                  <Label color="error" sx={{ ml: 1 }}>
                    {option.info}
                  </Label>
                )}
              </Link>
            </MenuItem>
          );
        })}
      </MenuList>

      <Divider sx={{ borderStyle: "dashed" }} />

      <Box sx={{ p: 1 }}>
        <SignOutButton
          size="medium"
          variant="text"
          onClose={onClose}
          sx={{ display: "block", textAlign: "left" }}
        />
      </Box>
    </CustomPopover>
  );

  return (
    <>
      <AccountButton
        onClick={onOpen}
        photoURL=""
        displayName={name}
        sx={sx}
        {...other}
      />

      {renderMenuActions()}
    </>
  );
}
