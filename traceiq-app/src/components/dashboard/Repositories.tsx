// src/pages/repositories/index.tsx
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from "@mui/material";

export default function Repositories() {
  return (
    <>
      <Typography variant="h4" mb={3}>
        Repositories
      </Typography>

      <Grid container spacing={3}>
        {[1, 2, 3].map((repo) => (
          <Grid item xs={12} md={4} key={repo}>
            <Card>
              <CardContent>
                <Typography variant="h6">Repo {repo}</Typography>
                <Typography variant="body2">
                  Description of repo
                </Typography>

                <Button sx={{ mt: 2 }} variant="contained">
                  Analyze
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}