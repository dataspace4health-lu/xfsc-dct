import React from 'react';
import { Link } from 'react-router-dom';

interface AppTopBarProps {
  onToggleMenuClick: (event: React.MouseEvent) => void;
  onMobileTopbarMenuClick: (event: React.MouseEvent) => void;
  onMobileSubTopbarMenuClick: (event: React.MouseEvent) => void;
  mobileTopbarMenuActive: boolean;
  layoutColorMode: 'light' | 'dark';
}

export const AppTopBar: React.FC<AppTopBarProps> = (props) => {
  return (
    <div className="layout-topbar">
      <Link to="/" className="layout-topbar-logo">
        <span>DCT</span>
      </Link>
    </div>
  );
};
