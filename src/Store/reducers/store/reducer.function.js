/* eslint-disable array-callback-return */
import __mock__ from 'Store/__mock__';

const reducerGetStore = (params) => {
  const { state, action } = params;

  const storeData = action.payload.data;
  console.log('received stores', storeData);
  const setNewSelectedStore = () => {
    const currentStore = storeData[0];
    const selectedStoreId = currentStore.id;
    localStorage.setItem('selectedStoreId', JSON.stringify({ id: selectedStoreId }));
    return { currentStore, selectedStoreId };
  };
  const data = localStorage.getItem('selectedStoreId');
  const newData = JSON.parse(data);

  if (newData) {
    const { id } = newData;
    console.log('1..');
    const selectedStoreId = id;
    let { currentStore } = state;
    if (storeData.length > 0) {
      console.log('2..');
      const idx = storeData.findIndex((store) => store.id === selectedStoreId);
      if (idx !== -1) {
        console.log('3..', idx);
        // if store found in store list...
        currentStore = storeData[idx];
      } else {
        console.log('4..');
        setNewSelectedStore();
      }
    }
    console.log('5..');
    const updatedState = { ...state, stores: storeData, currentStore, selectedStoreId };
    console.log('setdata..1', updatedState);
    console.log('6..');
    return updatedState;
  }
  console.log('7..');

  const { currentStore, selectedStoreId } = setNewSelectedStore();
  const updatedState = { ...state, stores: storeData, currentStore, selectedStoreId };
  console.log('setdata..2', updatedState);
  console.log('8 ..');
  return updatedState;
  // return { ...state, stores: action.payload.data };
};

const reducerGetStoreItems = (params) => {
  const { state, action } = params;

  return ({ ...state, items: action.payload.data.map((item, idx) => ({ ...item, key: idx })) });
};
const reducerGetOrganizations = (params) => {
  const { state, action } = params;
  const organizations = action.payload.data;
  const storesWithAccess = [];

  // check stores in all organizations
  organizations.map((organization) => {
    organization.stores.map((store) => {
      // add store if not already add in storeWithAccess
      const index = storesWithAccess.findIndex(({ id }) => id === store.id);
      if (index === -1) return storesWithAccess.push(store);
    });
  });
  return ({ ...state, organizations: action.payload.data, stores: storesWithAccess });
};

const reducerChangeSelectedStore = (params) => {
  const { state, action } = params;
  localStorage.setItem('selectedStoreId', JSON.stringify({ id: action.payload.id }));
  return { ...state, currentStore: action.payload, selectedStoreId: action.payload.id };
};

const reducerLoadSelectedStoreId = (params) => {
  const { state, action } = params;

  const data = localStorage.getItem('selectedStoreId');
  const { id } = JSON.parse(data);
  const selectedStoreId = id;
  let { currentStore } = state;
  if (state.stores.length > 0) {
    const idx = state.stores.findIndex((store) => store.id === selectedStoreId);
    if (idx !== -1) {
      // if store found in store list...
      currentStore = state.stores[idx];
    }
  }
  return { ...state, selectedStoreId, ...currentStore && { currentStore } };
};

const reducerStartDemo = (params) => {
  const { state, action } = params;

  console.log('Hitting in stores Start Demo....', state, action);
  return { ...state,
    normalStateBackup: state,
    stores: __mock__.storeMock.stores,
    selectedStoreId: __mock__.storeMock.selectedStoreId,
    currentStore: __mock__.storeMock.stores[0],
  };
};
const reducerEndDemo = (params) => {
  const { state, action } = params;

  console.log('Hitting in stores End Demo....', state, action);
  if (Object.keys(state.normalStateBackup).length > 0) return { ...state.normalStateBackup, isDemoMode: false };

  console.log('You are not on demo mode');
  return state;
};

export {
  reducerChangeSelectedStore,
  reducerGetStore,
  reducerGetStoreItems,
  reducerLoadSelectedStoreId,
  reducerStartDemo,
  reducerEndDemo,
  reducerGetOrganizations,
};
