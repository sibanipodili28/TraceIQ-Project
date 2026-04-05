// src/pages/settings/index.tsx
import { Typography, Button } from "@mui/material";

export default function Settings() {
  return (
    <>
      <Typography variant="h4" mb={3}>
        Settings
      </Typography>

      <Button
        variant="contained"
        color="error"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
      >
        Logout
      </Button>
    </>
  );
}