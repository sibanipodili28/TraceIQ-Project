// src/pages/insights/index.tsx
import { Typography, Card, CardContent } from "@mui/material";

export default function Insights() {
  return (
    <>
      <Typography variant="h4" mb={3}>
        AI Code Insights
      </Typography>

      <Card>
        <CardContent>
          <Typography>
            🔍 Detected high complexity in utils.js
          </Typography>
          <Typography>
            ⚠️ Potential bug in auth.service.ts
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}