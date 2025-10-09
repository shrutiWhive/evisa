// components/color-picker-field.jsx
import { Box, Typography, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";
import { Controller, useFormContext } from "react-hook-form";
import { ORG_COLOR_OPTIONS } from "src/sections/profile/profile-color";

const COLORS = [
  "#5C6AC4",
  "#00B8D9",
  "#000000",
  "#FF5630",
  "#FFC107",
  "#36B37E",
  "#FFFFFF",
];

export default function SecondaryColorPicker({
  secondary_color,
  label = "Color",
}) {
  const { control } = useFormContext();

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>

      <Controller
        name={secondary_color}
        control={control}
        render={({ field, fieldState  }) => (
          <>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {ORG_COLOR_OPTIONS.map((color, index) => {
                //   const isSelected = field.value?.shades === color.shades;
                const isSelected =
                  field.value && field.value.main === color.shades.main;
                return (
                  <IconButton
                    key={index}
                    onClick={() => {
                      field.onChange(color.shades);
                    }}
                    sx={{
                      width: 32,
                      height: 32,
                      p: 0.5,
                      borderRadius: "50%",
                      bgcolor: color.shades.main,
                      // border: isSelected ? "2px solid #000" : "1px solid #ccc",
                      boxShadow: isSelected
                        ? "0 0 0 4px rgba(0,0,0,0.1)"
                        : "none",
                      position: "relative",
                      "&:hover": {
                        bgcolor: color.shades.main, // maintain same color on hover
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
