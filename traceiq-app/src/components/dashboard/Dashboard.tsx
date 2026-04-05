// src/pages/dashboard/index.tsx
import {  Card, CardContent, Grid, Typography } from "@mui/material";

const stats = [
  { title: "Repositories", value: 12 },
  { title: "Open Issues", value: 34 },
  { title: "Tech Debt", value: "High" },
  { title: "AI Insights", value: 7 },
];

export default function Dashboard() {
  return (
    <>
      <Typography variant="h4" mb={3}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {stats.map((item) => (
          <Grid item xs={12} md={3} key={item.title}>
            <Card>
              <CardContent>
                <Typography color="text.secondary">
                  {item.title}
                </Typography>
                <Typography variant="h5">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}