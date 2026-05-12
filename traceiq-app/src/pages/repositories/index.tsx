// import Repositories from "@/src/components/dashboard/Repositories";

// export default function Repos() {
//   debugger
//   return (
//     <>
//     <Repositories />
//     </>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import Repositories from "@/src/components/dashboard/Repositories";

type Branch = {
  name: string;
};

type Repo = {
  githubRepoId: string;
  fullName: string;
  branches: Branch[];
};

export default function Repos() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }
      debugger
      const res = await fetch("http://localhost:3000/api/repo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

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

  return (
    <Repositories
      repos={repos}
      loading={loading}
      onRefresh={fetchRepos}
    />
  );
}