import { useState, useEffect } from 'react';
import { ReactComponent as MenuIcon } from 'Assets/icons/menu-dark.svg';
// import { ReactComponent as DashboardIcon } from 'Assets/icons/home.svg';
// import { ReactComponent as ProductsIcon } from 'Assets/icons/products.svg';
// import { ReactComponent as SettingsIcon } from 'Assets/icons/settings.svg';
import './styles.scss';
import { useHistory, useLocation } from 'react-router-dom';
import { Pathname } from 'Routes';
import { Config } from 'Configs';
import { useSelector } from 'react-redux';
import SvgIcon from '@mui/material/SvgIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ProductsIcon from '@mui/icons-material/ShoppingBasket';
import SettingsIcon from '@mui/icons-material/Settings';

const primaryColor = '#ff671b';
function HomeIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}
const tabTypes = {
  home: 'home',
  products: 'products',
  settings: 'settings',
  operatingView: 'operatingView'
};
const sidebarDefault = {
  show: 'default-show',
  hide: 'default-hide',
};

const Sidebar = () => {
  const location = useLocation();
  const [isSidebar, setIsSidebar] = useState(sidebarDefault.hide);
  const [activeTab, setActiveTab] = useState(tabTypes.home);
  useEffect(() => {
    if (location.pathname === Pathname.home) return setActiveTab(tabTypes.home);
    if (location.pathname === Pathname.operatingView) return setActiveTab(tabTypes.operatingView);
    if (location.pathname === Pathname.settings) return setActiveTab(tabTypes.settings);
    if (location.pathname === Pathname.products) return setActiveTab(tabTypes.products);
  }, [location.pathname]);
  const { user } = useSelector((state) => state.authReducer);
  const [hasOperatingDashboardAccess, setHasOperatingDashboardAccess] = useState(false);
  useEffect(() => {
    if (user.role === Config.validUserRoles.admin || user.role === Config.validUserRoles.operator) return setHasOperatingDashboardAccess(true);
    return setHasOperatingDashboardAccess(false);
  }, [user]);
  const history = useHistory();
  const onTabClick = (newActiveTab) => {
    setActiveTab(newActiveTab);

    if (newActiveTab === tabTypes.home) return history.push(Pathname.home);

    if (newActiveTab === tabTypes.operatingView) {
      if (hasOperatingDashboardAccess) return history.push(Pathname.operatingView);

      alert("You don't have access for operating dashboard");
      return history.push(Pathname.home);
    }

    if (newActiveTab === tabTypes.products) return history.push(Pathname.products);
    if (newActiveTab === tabTypes.settings) return history.push(Pathname.settings);
    return history.push(Pathname.comingSoon);
  };
  const handleSidebar = () => {
    if (isSidebar === sidebarDefault.show) return setIsSidebar(false);
    if (isSidebar === sidebarDefault.hide) return setIsSidebar(true);
    return setIsSidebar(!isSidebar);
  };

  return (
    <>
      <div className={`section-sidebar ${isSidebar === false ? 'close' : isSidebar === true ? 'show' : isSidebar}`}>
        <div
          className="sidebar-toggle"
          onClick={() => handleSidebar()}
        >
          <MenuIcon />
        </div>
        <div
          className="sidebar-items"
        >
          <div
            className={`item  ${activeTab === tabTypes.home ? 'active' : ''}`}
            onClick={() => onTabClick(tabTypes.home)}
          >
            <div className="icon"><HomeIcon style={{ color: activeTab === tabTypes.home ? '#fff' : primaryColor }} fontSize="large" /></div>
            <span className="text">Home</span>
          </div>
          {hasOperatingDashboardAccess
          && (
          <div
            className={`item  ${activeTab === tabTypes.operatingView ? 'active' : ''}`}
            onClick={() => onTabClick(tabTypes.operatingView)}
          >
            <div className="icon">
              <DashboardIcon style={{ color: activeTab === tabTypes.operatingView ? '#fff' : primaryColor }} fontSize="large" />

            </div>
            <span className="text">Dashboard</span>
          </div>
          )}

          <div
            className={`item  ${activeTab === tabTypes.products ? 'active' : ''}`}
            onClick={() => onTabClick(tabTypes.products)}
          >
            <div className="icon">
              <ProductsIcon style={{ color: activeTab === tabTypes.products ? '#fff' : primaryColor }} fontSize="large" />

            </div>
            <span className="text">Products</span>
          </div>
          {user.role === Config.validUserRoles.admin
          && (
          <div
            className={`item  ${activeTab === tabTypes.settings ? 'active' : ''}`}
            onClick={() => onTabClick(tabTypes.settings)}
          >
            <div className="icon"><SettingsIcon style={{ color: activeTab === tabTypes.settings ? '#fff' : primaryColor }} fontSize="large" /></div>
            <span className="text">Settings</span>
          </div>
          )}
        </div>

      </div>

    </>
  );
};
export default Sidebar;
