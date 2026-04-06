// src/pages/issues/index.tsx
import { Typography, List, ListItem } from "@mui/material";

export default function Issues() {
  return (
    <>
      <Typography variant="h4" mb={3}>
        Issue Analyzer
      </Typography>

      <List>
        <ListItem>Bug in API response</ListItem>
        <ListItem>Memory leak detected</ListItem>
      </List>
    </>
  );
}