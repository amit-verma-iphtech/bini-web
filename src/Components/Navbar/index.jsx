/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from 'react';
import './styles.scss';
import logoFullName from 'Assets/images/bini-logo-small.png';
import { TextInput, SelectInput } from 'Components';
import { ReactComponent as MapIcon } from 'Assets/icons/mapIcon.svg';
import { ReactComponent as ArrowIcon } from 'Assets/icons/down-arrow-big.svg';
import Avatar from '@material-ui/core/Avatar';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import { Pathname } from 'Routes';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CHANGE_SELECTED_STORE, LOGOUT } from 'Store/constants/actionTypes';
import { LearnIcon } from 'Components/LearnIcon';
import { DEMO_END, FULL_DEMO, START_DEMO, TOGGLE_DEMO } from 'Store/constants/demoActionTypes.constants';
import { startDemo } from 'Store/actions';
import TabHeader from 'Components/TabHeader';
import { Config } from 'Configs';
import * as actions from 'Store/actions/index';

const initialStores = [
  {
    name: 'Weserstr. 29',
    value: 'Weserstr. 29'
  },

  {
    name: 'Weserstr. 30',
    value: 'Weserstr. 30'
  },

];
const initialUserData = {
  name: '',
  profilePic: ''
};
export default function Navbar() {
  const customOptions = [
    // { name: 'DEMO', value: 'DEMO' }
  ];
  const { user = initialUserData } = useSelector((state) => state.authReducer);
  const history = useHistory();

  const dispatch = useDispatch();
  const { stores, currentStore } = useSelector((state) => state.storeReducer);
  const [selectedStore, setSelectedStore] = useState();

  const handleSelectStore = (store) => {
    setSelectedStore({ ...store, value: store.id });
    dispatch({ type: CHANGE_SELECTED_STORE, payload: store });
  };
  const handleLogOut = () => {
    dispatch(actions.signOut({}, undefined, undefined, history));
  };

  const { isDemoMode } = useSelector((state) => state.demoReducer);
  useEffect(() => {
    console.log('store-logs', stores, currentStore);
    if (isDemoMode) return;
    if (!selectedStore && stores.length >= 1 && currentStore) {
      const store = currentStore;
      handleSelectStore(store);
    }
    if (!selectedStore && stores.length >= 1 && !currentStore) {
      const store = stores[0];
      handleSelectStore(store);
    }
  }, [stores, currentStore]);

  const handleSelect = (evt) => {
    const search = (obj) => obj.id * 1 === evt.target.value * 1;
    const storeIdx = stores.findIndex(search);
    if (storeIdx !== -1) {
      const currentStore = stores[storeIdx];
      handleSelectStore(currentStore);
    } else {
      setSelectedStore({ value: 'DEMO' });
    }
  };

  const handleFullDemo = () => {
    if (!isDemoMode) {
      dispatch(startDemo({}, undefined, () => { }));
    }
    dispatch({ type: FULL_DEMO, payload: { loading: false } });
  };
  const setIsDemoMode = (isDemo) => {
    if (isDemo && !isDemoMode) {
      dispatch(startDemo({}, undefined, () => { }));
    } else if (!isDemo && isDemoMode) {
      dispatch({ type: DEMO_END });
    }
  };

  // const toggleDemo = () => {
  // };
  return (
    <div className="navbar">
      <div className="navbar-left">
        <div className="logo" onClick={() => history.push(Pathname.home)}>
          <div className="logo-image">
            <img src={logoFullName} alt="biniLogo" />
          </div>
          <div className="logo-name">
            Bini Ops
          </div>
        </div>
      </div>
      <div className="navbar-mid">
        <div className="search-wrapper">
          <span className="icon">
            <MapIcon />
          </span>
          <SelectInput
            onChange={handleSelect}
            value={selectedStore?.value}
            className="search-wrapper-input"
            placeholder="Search..."
            options={stores.map((store) => ({ ...store, value: store.id }))}
            customOptions={customOptions}
          />
          {/* <span className="icon">
            <ArrowIcon />
          </span> */}
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-right-menu">
          { (user?.role === Config.validUserRoles.admin || user?.role === Config.validUserRoles.operator)
          && (
          <>
            <div className="item">
              <LearnIcon onClick={handleFullDemo} normal />
            </div>
            <div className="item">
              <TabHeader tabTwo="Normal" tabOne="Demo" isTabOne={isDemoMode} setIsTabOne={setIsDemoMode} isNav />
            </div>
          </>
          )}

          <div className="item">
            <button onClick={handleLogOut}>logout</button>
          </div>
          <div className="item">
            <NotificationsNoneIcon fontSize="large" />
          </div>
        </div>
        <div className="profile-menu">
          <div>
            <Avatar alt="Cindy Baker" src={user?.profilePic}>{user?.name}</Avatar>
          </div>
          <div className="drop-down-menu">
            {user?.name}
            {' '}
            <ArrowIcon />
          </div>

        </div>
      </div>
    </div>
  );
}
