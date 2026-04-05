// src/pages/tech-debt/index.tsx
import { Typography, LinearProgress } from "@mui/material";

export default function TechDebt() {
  return (
    <>
      <Typography variant="h4" mb={3}>
        Technical Debt
      </Typography>

      <Typography>Code Quality Score</Typography>
      <LinearProgress variant="determinate" value={60} />
    </>
  );
}