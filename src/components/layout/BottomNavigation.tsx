import React from "react";
import { NavLink } from "react-router-dom";
import { Gauge, Box, ClipboardList, Clock3, MessageCircle, LucideIcon } from "lucide-react";

interface MobileLink {
  to: string;
  label: string;
  icon: LucideIcon;
}

const mobileLinks: MobileLink[] = [
  { to: "/home", label: "Dashboard", icon: Gauge },
  { to: "/assets", label: "Assets", icon: Box },
  { to: "/work-orders", label: "Orders", icon: ClipboardList },
  { to: "/timer", label: "Timer", icon: Clock3 },
  { to: "/chat", label: "Chat", icon: MessageCircle },
];

export const BottomNavigation: React.FC = () => {
  return (
    <nav className="bottom-nav">
      {mobileLinks.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => (isActive ? "mobile-link active" : "mobile-link")}
        >
          <Icon />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
