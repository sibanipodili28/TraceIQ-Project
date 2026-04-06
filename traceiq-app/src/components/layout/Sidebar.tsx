// src/components/Sidebar.tsx
import {
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Repositories", path: "/repositories" },
  { name: "Insights", path: "/insights" },
  { name: "Issues", path: "/issues" },
  { name: "Tech Debt", path: "/tech-debt" },
  { name: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const router = useRouter();

  return (
    <List>
      {menu.map((item) => (
        <ListItemButton
          key={item.path}
          selected={router.pathname === item.path}
          onClick={() => router.push(item.path)}
        >
          <ListItemText primary={item.name} />
        </ListItemButton>
      ))}
    </List>
  );
}