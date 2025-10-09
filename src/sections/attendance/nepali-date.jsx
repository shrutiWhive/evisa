import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { fetchDateInNepali } from "src/api/hr-attendance";

export default function NepaliDateDialog({ open, onClose, onSelect }) {
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchDateInNepali()
        .then((res) => {
          setYears(res?.years || []);
          setMonths(res?.months || []);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleConfirm = () => {
    if (selectedYear && selectedMonth) {
      onSelect({ year: selectedYear, month: selectedMonth });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Select Nepali Year and Month</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Stack alignItems="center" justifyContent="center" py={4}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={2} mt={1}>
            <FormControl fullWidth>
              <InputLabel>Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                label="Year"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                label="Month"
              >
                {months.map((month) => (
                  <MenuItem key={month.numeric} value={month.numeric}>
                    {month.en} ({month.np})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleConfirm}
          disabled={!selectedYear || !selectedMonth}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}
