// // src/pages/repositories/index.tsx
// import {
//   Typography,
//   Card,
//   CardContent,
//   Grid,
//   Button,
// } from "@mui/material";

// export default function Repositories() {
//   return (
//     <>
//       <Typography variant="h4" mb={3}>
//         Repositories
//       </Typography>

//       <Grid container spacing={3}>
//         {[1, 2, 3].map((repo) => (
//           <Grid item xs={12} md={4} key={repo}>
//             <Card>
//               <CardContent>
//                 <Typography variant="h6">Repo {repo}</Typography>
//                 <Typography variant="body2">
//                   Description of repo
//                 </Typography>

//                 <Button sx={{ mt: 2 }} variant="contained">
//                   Analyze
//                 </Button>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </>
//   );
// }

"use client";

import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";

interface Repo {
  name: string;
  clone_url: string;
  private: boolean;
}

export default function Repositories() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRepos = async () => {
    try {
      const token = localStorage.getItem("token");

      // ✅ Safety check
      console.log("Fetching repos with token:", token);
      if (!token) {
        console.error("No GitHub token found in localStorage");
        setLoading(false);
        return;
      }

      const res = await fetch("http://localhost:3000/api/repo/github", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ FIXED
        },
      });

      const data = await res.json();

      console.log("API DATA:", data);

      // ✅ Ensure array
      if (Array.isArray(data)) {
        setRepos(data);
      } else {
        console.error("Invalid response:", data);
        setRepos([]);
      }
    } catch (error) {
      console.error("Error fetching repos:", error);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  // ✅ Loading UI
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h4" mb={3}>
        Repositories
      </Typography>

      <Grid container spacing={3}>
        {repos.length === 0 ? (
          <Typography>No repositories found</Typography>
        ) : (
          repos.map((repo) => (
            <Grid item xs={12} sm={6} md={4} key={repo.name}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{repo.name}</Typography>

                  <Typography variant="body2" color="text.secondary">
                    {repo.private ? "Private Repository" : "Public Repository"}
                  </Typography>

                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    onClick={() => handleAnalyze(repo.clone_url)}
                  >
                    Analyze
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </>
  );
}

// ✅ Separate function (clean code)
const handleAnalyze = async (cloneUrl: string) => {
  try {
    const res = await fetch("http://localhost:3000/api/repo/clone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clone_url: cloneUrl }),
    });

    const data = await res.json();

    alert(data.message || "Repo cloned successfully");
  } catch (error) {
    console.error("Clone error:", error);
    alert("Failed to clone repo");
  }
};