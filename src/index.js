import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './Store/reducers/index';
import App from './App';
import './index.scss';
/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers,
  composeEnhancers(applyMiddleware(thunk)));
/* eslint-enable */
render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root')
);
