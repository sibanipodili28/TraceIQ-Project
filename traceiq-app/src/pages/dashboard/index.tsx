// src/pages/dashboard/index.tsx
import Dashboard from "@/src/components/dashboard/Dashboard";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Overview() {
  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;

    if (token) {
      localStorage.setItem("token", token as string);
      console.log("Token saved:", token);
    }
  }, [router.query]);

  return <>
  <Dashboard />
  </>;
}