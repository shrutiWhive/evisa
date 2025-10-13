import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router";

export function Step1Page() {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Step 1: Personal Information
      </Typography>
      <Button variant="contained" onClick={() => navigate("/apply/step2")}>
        Next
      </Button>
    </Box>
  );
}
