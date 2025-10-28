import { useState, useCallback } from "react";
import {
  Box,
  Stack,
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Typography,
  Pagination,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { VacancyItem } from "./vacancy-item";

export function VacancyList({ vacancyList }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const handleSearchChange = useCallback((event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((event) => {
    setSortBy(event.target.value);
  }, []);

  const handleFilterChange = useCallback((event) => {
    setFilterType(event.target.value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((event, page) => {
    setCurrentPage(page);
  }, []);

  // Filter and sort logic
  const filteredJobs = vacancyList
    .filter((job) => {
      const matchesSearch =
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "all" || job.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "popular") return (b.views || 0) - (a.views || 0);
      return 0;
    });

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Stack spacing={3}>
      {/* Search and Filters */}
      <Stack
        spacing={2}
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
      >
        <TextField
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search jobs..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify
                  icon="eva:search-fill"
                  sx={{ color: "text.disabled" }}
                />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: { sm: 360 } }}
        />

        <Stack direction="row" spacing={1} sx={{ minWidth: { sm: "auto" } }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={filterType} onChange={handleFilterChange}>
              <MenuItem value="all">All Types</MenuItem>
              <MenuItem value="full-time">Full Time</MenuItem>
              <MenuItem value="part-time">Part Time</MenuItem>
              <MenuItem value="contract">Contract</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={sortBy} onChange={handleSortChange}>
              <MenuItem value="latest">Latest</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
              <MenuItem value="popular">Popular</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      {/* Results count */}
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {filteredJobs.length} jobs found
      </Typography>

      {/* Job Grid */}
      <Box
        sx={{
          gap: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {paginatedJobs.map((job) => (
          <VacancyItem key={job.id} job={job} />
        ))}
      </Box>

      {/* Empty State */}
      {filteredJobs.length === 0 && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No jobs found
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Stack>
  );
}
