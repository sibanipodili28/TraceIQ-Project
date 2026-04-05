// src/pages/index.tsx
import { Box, Button, Typography, Container, Paper } from "@mui/material";

export default function Login() {
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 5, mt: 10, textAlign: "center" }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          RepoMind AI 🚀
        </Typography>

        <Typography variant="body1" color="text.secondary" mb={3}>
          Analyze your GitHub repositories with AI
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() =>
            (window.location.href =
              "http://localhost:3000/api/auth/github")
          }
        >
          Login with GitHub
        </Button>
      </Paper>
    </Container>
  );
}