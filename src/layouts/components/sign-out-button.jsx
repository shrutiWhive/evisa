import { useCallback } from "react";

import Button from "@mui/material/Button";

import { paths } from "src/routes/paths";
import { useRouter } from "src/routes/hooks";

import { clearOrganization } from "src/redux/actions";
import { useAppDispatch } from "src/redux/hooks";

import { toast } from "src/components/snackbar";

import { signOut } from "src/api";

// ----------------------------------------------------------------------

export function SignOutButton({ onClose, sx, ...other }) {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const handleLogout = useCallback(async () => {
    try {
      const response = await signOut();

      onClose?.();

      dispatch(clearOrganization());

      router.push(paths.home);
      toast.success(response.message || "You have been logged out!");
    } catch (error) {
      console.error(error);

      toast.error("Unable to logout!");
    }
  }, [onClose, router]);

  return (
    <Button
      fullWidth
      variant="soft"
      size="large"
      color="error"
      onClick={handleLogout}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}
