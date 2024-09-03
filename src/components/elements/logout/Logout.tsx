import React from "react";

import { LogoutProps } from "@typings/LogoutProps";

import "./logout.scss";
import { Icon } from "@/components/elements/icon/Icon";

export const Logout: React.FC<LogoutProps> = ({ onLogout }) => {
  return (
    <button className="logout" onClick={onLogout}>
      <Icon name="arrow-right-from-bracket" type="fas" />
    </button>
  );
};
