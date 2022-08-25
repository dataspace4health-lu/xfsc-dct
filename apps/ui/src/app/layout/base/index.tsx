import React from 'react';
import classNames from 'classnames';
import { Outlet } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import PrimeReact from 'primereact/api';
import { AppTopBar } from '../../components/topbar';
import { AppFooter } from '../../components/app-footer/intex';

interface BaseLayoutProps {
  onSignOut: () => void;
}

let layoutMode = 'static';
let layoutColorMode: 'light' | 'dark' = 'light';
let inputStyle = 'outlined';
let ripple = true;

export const BaseLayout: React.FC<BaseLayoutProps> = ({ onSignOut }) => {
  const [staticMenuInactive, setStaticMenuInactive] = React.useState(false);
  const [overlayMenuActive, setOverlayMenuActive] = React.useState(false);
  const [mobileMenuActive, setMobileMenuActive] = React.useState(false);
  const [mobileTopbarMenuActive, setMobileTopbarMenuActive] =
    React.useState(false);
  PrimeReact.ripple = true;
  let menuClick = false;
  let mobileTopbarMenuClick = false;

  React.useEffect(() => {
    if (mobileMenuActive) {
      addClass(document.body, 'body-overflow-hidden');
    } else {
      removeClass(document.body, 'body-overflow-hidden');
    }
  }, [mobileMenuActive]);

  const onWrapperClick = (event: React.MouseEvent) => {
    if (!menuClick) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }

    if (!mobileTopbarMenuClick) {
      setMobileTopbarMenuActive(false);
    }

    mobileTopbarMenuClick = false;
    menuClick = false;
  };

  const onToggleMenuClick = (event: React.MouseEvent) => {
    menuClick = true;
    if (isDesktop()) {
      if (layoutMode === 'overlay') {
        if (mobileMenuActive === true) {
          setOverlayMenuActive(true);
        }
        setOverlayMenuActive((prevState) => !prevState);
        setMobileMenuActive(false);
      }
      setStaticMenuInactive((prevState) => !prevState);
    } else {
      setMobileMenuActive((prevState) => !prevState);
    }
    event.preventDefault();
  };

  const onMobileTopbarMenuClick = (event: React.MouseEvent) => {
    mobileTopbarMenuClick = true;

    setMobileTopbarMenuActive((prevState) => !prevState);
    event.preventDefault();
  };

  const onMobileSubTopbarMenuClick = (event: React.MouseEvent) => {
    mobileTopbarMenuClick = true;

    event.preventDefault();
  };

  const isDesktop = () => {
    return window.innerWidth >= 992;
  };

  const addClass = (element: HTMLElement, className: string) => {
    if (element.classList) element.classList.add(className);
    else element.className += ' ' + className;
  };

  const removeClass = (element: HTMLElement, className: string) => {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          '(^|\\b)' + className.split(' ').join('|') + '(\\b|$)',
          'gi',
        ),
        ' ',
      );
  };

  const wrapperClass = classNames('layout-wrapper', {
    'layout-overlay': layoutMode === 'overlay',
    'layout-static': layoutMode === 'static',
    'layout-static-sidebar-inactive':
      staticMenuInactive && layoutMode === 'static',
    'layout-overlay-sidebar-active':
      overlayMenuActive && layoutMode === 'overlay',
    'layout-mobile-sidebar-active': mobileMenuActive,
    'p-input-filled': inputStyle === 'filled',
    'p-ripple-disabled': ripple === false,
    'layout-theme-light': layoutColorMode === 'light',
  });

  return (
    <div className={wrapperClass} onClick={onWrapperClick}>
      <AppTopBar
        onToggleMenuClick={onToggleMenuClick}
        layoutColorMode={layoutColorMode}
        mobileTopbarMenuActive={mobileTopbarMenuActive}
        onMobileTopbarMenuClick={onMobileTopbarMenuClick}
        onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick}
      />
      <div className="layout-main-container" style={{ marginLeft: 0 }}>
        <div className="layout-main">
          <Outlet />
        </div>

        <AppFooter layoutColorMode={layoutColorMode} />
      </div>

      <CSSTransition
        classNames="layout-mask"
        timeout={{ enter: 200, exit: 200 }}
        in={mobileMenuActive}
        unmountOnExit
      >
        <div className="layout-mask p-component-overlay"></div>
      </CSSTransition>
    </div>
  );
};
