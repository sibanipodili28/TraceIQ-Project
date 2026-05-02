"use client";

import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import { useState } from "react";

type Branch = {
  name: string;
};

type Repo = {
  githubRepoId: string;
  fullName: string;
  branches: Branch[];
};

type Props = {
  repos: Repo[];
  loading: boolean;
  onRefresh: () => void;
};

export default function Repositories({
  repos,
  loading,
}: Props) {
  const [selectedBranches, setSelectedBranches] = useState<{
    [key: string]: string;
  }>({});

  const [analyzingRepo, setAnalyzingRepo] = useState<string | null>(null);

  // ✅ FILTER: only repos with branches
  const validRepos = repos.filter(
    (repo) => repo.branches && repo.branches.length > 0
  );

  const handleBranchChange = (repoId: string, branch: string) => {
    setSelectedBranches((prev) => ({
      ...prev,
      [repoId]: branch,
    }));
  };

  return (
  <>
    <Typography variant="h4" mb={2}>
      Repositories
    </Typography>

    {loading ? (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    ) : (
      <Box>
        <Grid container spacing={1.5}>
        {validRepos.length === 0 ? (
          <Typography>No repositories with branches found</Typography>
        ) : (
          validRepos.map((repo) => (
            <Grid item xs={12} key={repo.githubRepoId}>
              <Card
                sx={{
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  px: 2,
                }}
              >
                <CardContent
                  sx={{
                    width: "100%",
                    p: "6px !important",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        maxWidth: "60%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {repo.fullName}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Select
                        size="small"
                        value={
                          selectedBranches[repo.githubRepoId] ||
                          repo.branches[0]?.name
                        }
                        onChange={(e) =>
                          handleBranchChange(
                            repo.githubRepoId,
                            e.target.value as string
                          )
                        }
                        sx={{
                          width: 150,
                          height: 28,
                        }}
                      >
                        {repo.branches.map((branch) => (
                          <MenuItem key={branch.name} value={branch.name}>
                            {branch.name}
                          </MenuItem>
                        ))}
                      </Select>

                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          height: 28,
                          minWidth: 100,
                        }}
                        disabled={analyzingRepo === repo.githubRepoId}
                      >
                        {analyzingRepo === repo.githubRepoId
                          ? "Analyzing..."
                          : "Analyze"}
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
        </Grid>
      </Box>
    )}
  </>
);
}