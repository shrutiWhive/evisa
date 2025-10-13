import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router";
import { Iconify } from "src/components/iconify";
import { Logo } from "src/components/logo"; // replace with your own

const drawerWidth = 260;

export default function OnboardingLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const sidebarItems = [
    "Main Applicant Details",
    "Current Address",
    "Contact Details",
    "Sponsor’s Information",
    "Academic Information",
    "English Language Proficiency",
  ];

  const drawer = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "#052c61",
        color: "#fff",
        py: 3,
      }}
    >
      <List>
        {sidebarItems.map((text) => (
          <ListItemButton
            key={text}
            sx={{
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
              "&:hover": { backgroundColor: "#003b82" },
            }}
          >
            <ListItemText
              primary={text}
              primaryTypographyProps={{
                fontSize: 14,
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#031c45",
      }}
    >
      {/* ===== HEADER ===== */}
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#052c61",
          boxShadow: "none",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: "none" } }}
            >
              <Iconify icon="eva:arrow-ios-back-fill" width={12} />
            </IconButton>
            <Logo sx={{ height: 36 }} />
          </Box>
          <IconButton color="inherit">
            {/* <NotificationsNoneIcon /> */}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Divider between header and content */}
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.15)" }} />

      {/* ===== MAIN SECTION (Sidebar + Body) ===== */}
      <Box sx={{ display: "flex", flexGrow: 1, height: "100%" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: { xs: 0, md: drawerWidth },
            flexShrink: 0,
            display: { xs: "none", md: "block" },
            backgroundColor: "#052c61",
          }}
        >
          {drawer}
        </Box>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: "#052c61",
              color: "#fff",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Right Body Section */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, md: 4 },
            backgroundColor: "#031c45",
            color: "#fff",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#052c61",
              borderRadius: 2,
              p: 4,
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
