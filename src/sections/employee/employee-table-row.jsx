import { useBoolean } from "minimal-shared/hooks";

import { TableRow, TableCell, Button } from "@mui/material";

import { CONFIG } from "src/global-config";

import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";

import { fDateTime } from "src/utils";

import { Iconify } from "src/components/iconify";

import { useAppSelector } from "src/redux/hooks";
import { selectAuthState } from "src/redux/selectors";

import { EmployeePermissionsDialog } from "./employee-permissions-dialog";

// ----------------------------------------------------------------------

export function EmployeeTableRow({ serialNumber, row }) {
  const router = useRouter();

  const { user } = useAppSelector(selectAuthState);

  const showPermissionsDialog = useBoolean();

  const { id, role, name, email, contact_number, created_at, updated_at } = row;

  const shouldShowPermissionsButton =
    user?.role === CONFIG.adminRole && role !== CONFIG.adminRole;

  const handleView = () => {
    router.push(paths.dashboard.employee.detail(id));
  };

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        onClick={handleView}
        sx={{ cursor: "pointer" }}
      >
        <TableCell>{serialNumber}</TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{name}</TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{email}</TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>{contact_number}</TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {fDateTime(created_at)}
        </TableCell>

        <TableCell sx={{ whiteSpace: "nowrap" }}>
          {fDateTime(updated_at)}
        </TableCell>

        <TableCell align="right">
          {shouldShowPermissionsButton && (
            <Button
              size="small"
              variant="soft"
              startIcon={<Iconify icon="solar:lock-keyhole-bold" />}
              onClick={(e) => {
                e.stopPropagation();
                showPermissionsDialog.onTrue();
              }}
              sx={{ whiteSpace: "nowrap" }}
            >
              Manage permissions
            </Button>
          )}
        </TableCell>
      </TableRow>

      {showPermissionsDialog.value && (
        <EmployeePermissionsDialog
          open={showPermissionsDialog.value}
          onClose={showPermissionsDialog.onFalse}
          //
          employee={{
            id,
            name,
          }}
        />
      )}
    </>
  );
}
