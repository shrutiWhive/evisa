import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { Iconify } from "src/components/iconify";
import { useState } from "react";

export function AddDocumentDialog({ open, onClose, onSave }) {
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      if (!fileName) {
        setFileName(e.dataTransfer.files[0].name);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      if (!fileName) {
        setFileName(e.target.files[0].name);
      }
    }
  };

  const handleSave = () => {
    onSave({ fileName, file });
    handleClose();
  };

  const handleClose = () => {
    setFileName("");
    setFile(null);
    setDragActive(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#114B46",
          borderRadius: 2,
          p: 1,
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#ffffff",
          pb: 2,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Add Document
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: "#ffffff",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Iconify icon="eva:close-fill" width={24} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 3 }}>
        {/* File Name Input */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff",
              mb: 1,
              fontWeight: 500,
            }}
          >
            File Name <span style={{ color: "#ff5252" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter the file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#ffffff",
                bgcolor: "rgba(255, 255, 255, 0.05)",
                "& fieldset": {
                  borderColor: "#2BA597",
                },
                "&:hover fieldset": {
                  borderColor: "#5DC8B9",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2BA597",
                },
              },
              "& .MuiOutlinedInput-input::placeholder": {
                color: "rgba(255, 255, 255, 0.5)",
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Upload File */}
        <Box>
          <Typography
            variant="body2"
            sx={{
              color: "#ffffff",
              mb: 1,
              fontWeight: 500,
            }}
          >
            Upload File <span style={{ color: "#ff5252" }}>*</span>
          </Typography>
          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            sx={{
              border: "2px dashed",
              borderColor: dragActive ? "#2BA597" : "#4F8E88",
              borderRadius: 2,
              p: 4,
              textAlign: "center",
              bgcolor: dragActive
                ? "rgba(43, 165, 151, 0.05)"
                : "rgba(255, 255, 255, 0.02)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                borderColor: "#2BA597",
                bgcolor: "rgba(43, 165, 151, 0.05)",
              },
            }}
            onClick={() => document.getElementById("file-upload").click()}
          >
            <input
              id="file-upload"
              type="file"
              hidden
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx"
            />
            <Iconify
              icon="eva:cloud-upload-outline"
              width={48}
              height={48}
              sx={{ color: "#5DC8B9", mb: 1 }}
            />
            <Typography
              variant="body1"
              sx={{
                color: "#ffffff",
                mb: 0.5,
              }}
            >
              {file ? file.name : "Drag or upload file"}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {file ? "Click to change file" : "Click to browse"}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 2 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#FFB74D",
            color: "#FFB74D",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": {
              borderColor: "#FFA726",
              bgcolor: "rgba(255, 183, 77, 0.1)",
            },
          }}
        >
          Discard
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!fileName || !file}
          sx={{
            bgcolor: "#FFB74D",
            color: "#114B46",
            textTransform: "none",
            fontWeight: 600,
            px: 4,
            "&:hover": {
              bgcolor: "#FFA726",
            },
            "&:disabled": {
              bgcolor: "rgba(255, 183, 77, 0.3)",
              color: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
