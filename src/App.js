import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import useEventListener from '@use-it/event-listener';
import {
  OperatingView,
  Dashboard,
  PrivateHome } from 'Pages/Private';
import {
  PageNotFound,
  Auth,
  Home,
  ComingSoon } from 'Pages/Public';

import {
  Navbar,
} from 'Components';

import { Pathname } from 'Routes';
import { useDispatch, useSelector } from 'react-redux';
import { AUTO_LOGIN, INIT_MULTI_UNVERIY_ACTION, INIT_MULTI_VERIY_ACTION, TOGGLE_VIDEO_PLAYER } from 'Store/constants/actionTypes';
import TagInput from 'Components/TagInput';
import 'react-loading-skeleton/dist/skeleton.css';
import socket, { socket_init } from 'socket';
import { socketPing } from 'socket/services/socket.service';
import { getTimeDifference } from 'Helpers';
import IntroJs from 'Components/IntroJs/DemoInto';
import ActionMultipleObservation from 'Helpers/ActionMultipleObservation';
import { Config } from 'Configs';
import { requestBackendVersion, } from 'Api/request';
import ProductsView from 'Pages/Private/ProductsView';
import Settings from 'Pages/Private/Settings/index';

import * as actions from 'Store/actions';

export default function App() {
  const dispatch = useDispatch();
  //  loading all initial required data...

  useEffect(() => {
    dispatch(actions.getUsers());
    // dispatch(actions.getStores());
  }, []);

  // const { socket } = useSelector((state) => state.socketReducer);
  useEffect(() => {
    // Socket Init...
    socket_init();
    socket.on('welcome', (payload) => {
      console.log('socket, welcome_emit: payload=>', payload);
    });
  }, []);
  const { user } = useSelector((state) => state.authReducer);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('jwt'));
    const jwtToken = JSON.parse(localStorage.getItem('jwtToken'));
    const userProfile = JSON.parse(localStorage.getItem('userProfile'));
    const stayLoggedIn = JSON.parse(localStorage.getItem('stayLoggedIn'));
    if (data && data !== null) {
      dispatch({ type: AUTO_LOGIN, payload: { ...jwtToken, ...stayLoggedIn, ...userProfile } });
    }
  }, []);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  useEffect(() => {
    const logged = !!user;
    setIsLoggedIn(logged);
    if (logged) {
      dispatch(actions.getOrganizations({ userId: user.id }));
    }
  }, [user]);

  const { multipleActionBlocked, currentObservation } = useSelector((state) => state.observationReducer);
  useEffect(() => {
    if (currentObservation && currentObservation.id) {
      localStorage.setItem('currentObservation', currentObservation.id);
    }
  }, [currentObservation]);
  const handleUserKeyPress = (event) => {
    const { key, keyCode } = event;
    console.log('wowo', key, keyCode);
    if (multipleActionBlocked) return alert('Multiple Action is blocked until ongoing one finishes');
    if ((event.ctrlKey || event.metaKey) && (event.keyCode === 13 || event.keyCode === 10)) {
      return dispatch({ type: INIT_MULTI_VERIY_ACTION, });
    }
    if ((event.altKey && (event.keyCode === 13 || event.keyCode === 10))) {
      return dispatch({ type: INIT_MULTI_UNVERIY_ACTION, });
    }
  };
  useEffect(() => {
    console.log('**added listener');
    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      console.log('**removed listener');
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  });
  // spaceListener and videoPlayer toggle
  const { typingMode } = useSelector((state) => state.commandReducer);
  if (!typingMode) useEventListener('keydown', (event) => { if (event.keyCode === 32) dispatch({ type: TOGGLE_VIDEO_PLAYER }); });
  const [backend_version, setBackend_version] = useState('NaN');
  useEffect(() => {
    requestBackendVersion().then((res) => setBackend_version(res.backend_version)).catch((err) => console.log('version-err', err));
  }, []);
  return (
    <>
      <Router>
        {isLoggedIn
          ? (
            <>
              <div className="app-version">
                <span>
                  {`Bini v${Config.version}`}
                </span>
                <span>
                  {`Backend v${backend_version}`}
                </span>
              </div>
              {/* <button onClick={getTimeDifference}>time difference CloudStore</button> */}
              <Navbar />
              <ActionMultipleObservation />
              <Switch>
                {/* <Route component={TagInput} /> */}
                <Route exact path={Pathname.home} component={PrivateHome} />
                <Route exact path={Pathname.signIn}>
                  <Redirect to={Pathname.home} />
                </Route>
                <Route exact path={Pathname.signUp}>
                  <Redirect to={Pathname.operatingView} />
                </Route>
                <Route exact path={Pathname.demo} component={IntroJs} />
                <Route exact path={Pathname.dashboard} component={Dashboard} />
                <Route exact path={Pathname.operatingView} component={OperatingView} />
                <Route exact path={Pathname.products} component={ProductsView} />
                <Route exact path={Pathname.settings} component={Settings} />
                <Route exact path={Pathname.comingSoon} component={ComingSoon} />
                <Route component={PageNotFound} />
              </Switch>
            </>
          )
          : (
            <>
              <Switch>
                <Route exact path={Pathname.signIn} component={Auth} />
                <Route exact path={Pathname.demo} component={IntroJs} />
                <Route exact path={Pathname.signUp} component={Auth} />
                <Route>
                  <Redirect to={Pathname.signIn} />
                </Route>
              </Switch>
            </>
          )}
      </Router>
    </>
  );
}
