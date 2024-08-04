// src/components/elements/logout/Logout.tsx
import React from "react";

interface LogoutProps {
  onLogout: () => void;
}

export const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  return <button onClick={onLogout}>Logout</button>;
};
