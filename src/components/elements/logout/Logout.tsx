import React from "react";

import { LogoutProps } from "../../../typings/LogoutProps";

export const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  return <button onClick={onLogout}>Logout</button>;
};
