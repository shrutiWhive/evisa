// components/color-picker-field.jsx
import { Box, Typography, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { Controller, useFormContext } from "react-hook-form";
import { ORG_COLOR_OPTIONS } from "src/sections/profile/profile-color";

export default function PrimaryColorPicker({ primary_color, label = "Color" }) {
  const { control } = useFormContext();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      <Controller
        name={primary_color}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {ORG_COLOR_OPTIONS.map((color, index) => {
                const isSelected =
                  field.value && field.value.main === color.shades.main;
                return (
                  <IconButton
                    key={index}
                    onClick={() => field.onChange(color.shades)}
                    sx={{
                      width: 32,
                      height: 32,
                      p: 0.5,
                      borderRadius: "50%",
                      bgcolor: color.shades.main,
                      boxShadow: isSelected
                        ? "0 0 0 4px rgba(0,0,0,0.1)"
                        : "none",
                      "&:hover": {
                        bgcolor: color.shades.main,
                      },
                    }}
                  >
                    {isSelected && (
                      <Icon
                        icon="eva:checkmark-fill"
                        style={{
                          color:
                            color.shades.lighter === "#FFFFFF"
                              ? "#000"
                              : "#fff",
                          fontSize: 18,
                        }}
                      />
                    )}
                  </IconButton>
                );
              })}
            </Box>
            {fieldState.error && (
              <Typography variant="caption" color="error">
                {fieldState.error.message}
              </Typography>
            )}
          </>
        )}
      />
    </Box>
  );
}
