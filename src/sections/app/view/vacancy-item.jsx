import { usePopover } from "minimal-shared/hooks";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ListItemText from "@mui/material/ListItemText";

import { RouterLink } from "src/routes/components";

import { fDate, fDateTime } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";

import { Iconify } from "src/components/iconify";
import { CustomPopover } from "src/components/custom-popover";
import { Button } from "@mui/material";
import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

// ----------------------------------------------------------------------

export function VacancyItem({
  job,
  editHref,
  detailsHref,
  onDelete,
  sx,
  ...other
}) {
  const menuActions = usePopover();

  //   const renderMenuActions = () => (
  //     <CustomPopover
  //       open={menuActions.open}
  //       anchorEl={menuActions.anchorEl}
  //       onClose={menuActions.onClose}
  //       slotProps={{ arrow: { placement: "right-top" } }}
  //     >
  //       <MenuList>
  //         <li>
  //           <MenuItem
  //             component={RouterLink}
  //             href={detailsHref}
  //             onClick={() => menuActions.onClose()}
  //           >
  //             <Iconify icon="solar:eye-bold" />
  //             View
  //           </MenuItem>
  //         </li>

  //         <li>
  //           <MenuItem
  //             component={RouterLink}
  //             href={editHref}
  //             onClick={() => menuActions.onClose()}
  //           >
  //             <Iconify icon="solar:pen-bold" />
  //             Edit
  //           </MenuItem>
  //         </li>

  //         <MenuItem
  //           onClick={() => {
  //             menuActions.onClose();
  //             onDelete();
  //           }}
  //           sx={{ color: "error.main" }}
  //         >
  //           <Iconify icon="solar:trash-bin-trash-bold" />
  //           Delete
  //         </MenuItem>
  //       </MenuList>
  //     </CustomPopover>
  //   );

  const renderImages = () => (
    <Box sx={{ p: 1, gap: 0.5, display: "flex" }}>
      <Box sx={{ flexGrow: 1, position: "relative" }}>
        {/* <Image
          src="https://assets.publishing.service.gov.uk/media/5a60e43040f0b652634c90ee/s300_visa_pic.jpg"
          alt="Visa Document"
          sx={{ width: 1, height: 164, borderRadius: 1 }}
        /> */}
        <Box
          component="img"
          src="https://assets.publishing.service.gov.uk/media/5a60e43040f0b652634c90ee/s300_visa_pic.jpg"
          alt="Visa Document"
          sx={{
            mt: 2,
            maxWidth: 400,
            width: "100%",
            borderRadius: 2,
            objectFit: "cover",
          }}
        />
      </Box>
    </Box>
  );

  const renderTexts = () => (
    <ListItemText
      sx={[(theme) => ({ p: theme.spacing(2.5, 2.5, 2, 2.5) })]}
      primary={`Posted date: ${fDateTime(job.created_at)}`}
      secondary={
        <Link component={RouterLink} href={detailsHref} color="inherit">
          {job.employer_name}
        </Link>
      }
      slotProps={{
        primary: {
          sx: { typography: "caption", color: "text.disabled" },
        },
        secondary: {
          noWrap: true,
          component: "h6",
          sx: { mt: 1, color: "text.primary", typography: "subtitle1" },
        },
      }}
    />
  );

  const renderInfo = () => (
    <Box
      sx={[
        (theme) => ({
          gap: 1.5,
          display: "flex",
          position: "relative",
          flexDirection: "column",
          p: theme.spacing(0, 2.5, 2.5, 2.5),
        }),
      ]}
    >
      {[
        {
          icon: (
            <Iconify
              icon="mingcute:location-fill"
              sx={{ color: "error.main" }}
            />
          ),
          label: job.location,
        },

        {
          icon: (
            <Iconify
              icon="solar:money-bag-bold"
              sx={{ color: "primary.main" }}
            />
          ),
          label: `${job.wages} per hour`,
        },
      ].map((item) => (
        <Box
          key={item.label}
          sx={[
            {
              gap: 0.5,
              display: "flex",
              typography: "body2",
              alignItems: "center",
            },
          ]}
        >
          {item.icon}
          {item.label}
        </Box>
      ))}
    </Box>
  );
  const router = useRouter();

  const handleClick = () => {
    router.push(paths.dashboard.vacancy.detail(job.id));
  };

  const renderAction = () => (
    <>
      <Divider sx={{ borderStyle: "dashed" }} />
      <Box sx={{ p: 2.5, pt: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          endIcon={<Iconify icon="mdi:arrow-right" />}
          onClick={handleClick}
          //   onClick={onApply}
          sx={{
            borderRadius: 1.5,
            textTransform: "none",
            fontWeight: 600,
            py: 1.2,
          }}
        >
          Apply Now
        </Button>
      </Box>
    </>
  );
  return (
    <>
      <Card sx={sx} {...other}>
        {renderImages()}
        {renderTexts()}
        {renderInfo()}
        {renderAction()}
      </Card>
    </>
  );
}
