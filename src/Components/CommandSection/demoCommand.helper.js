import { demoActionAdd, demoCommandVerify, demoVisitAdd, demoVisitorExit } from 'Store/actions';
import { NEXT_OBSERVATION } from 'Store/constants/actionTypes';
import { DEMO_BASKET_UPDATE } from 'Store/constants/demoActionTypes.constants';

// const findObservationById = (array, observationId) => {
//   const index = array.findIndex(({ id }) => id === observationId);
//   return array[index];
// };

export const handleDemoCommandVerify = ({ dispatch, data, actionData: actionPayload, useSelector }) => {
  const actionData = { ...actionPayload };
  const { currentObservation } = useSelector;
  actionData.actionAt = currentObservation.start;
  // const selectedObservation = findObservationById(observations, actionData.actionOn);

  console.log('demo-Commands-->', data, actionData);
  dispatch(demoCommandVerify(data));
  dispatch(demoActionAdd(actionData));
  dispatch({ type: NEXT_OBSERVATION });
};

export const handleDemoCommandUnVerify = ({ dispatch, data, actionData: actionPayload, useSelector }) => {
  const actionData = { ...actionPayload };
  const { currentObservation } = useSelector;
  actionData.actionAt = currentObservation.start;

  console.log('demo-Commands-->', data, actionData);
  dispatch(demoActionAdd(actionData));
};
export const handleDemoAddVisitor = ({ dispatch, data, actionData: actionPayload, useSelector, setSnackbar }) => {
  const actionData = { ...actionPayload };
  const { currentObservation } = useSelector;
  actionData.actionAt = currentObservation.start;

  const { allDemoVisits } = useSelector;
  const visitId = allDemoVisits.length + 1;
  const basketId = visitId;
  const visitAlreadyIn = allDemoVisits.filter(({ user: { id }, end }) => id === data.userId && (!end || end === null));
  console.log('demo-Commands-->', visitAlreadyIn.length > 0, data, actionData, allDemoVisits, visitAlreadyIn);

  if (visitAlreadyIn.length > 0) {
    return setSnackbar({ isVisible: true, type: 'error', message: 'Visitor already in some store' });
  }
  const visit = {
    id: visitId,
    observationId: data.observationId,
    start: data.start,
    end: null,
    storeId: 1,
    user: {
      id: data.userId,
      name: data.userName
    },
    ref_visit_images: [],
    basket: {
      id: basketId,
      isPaid: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        // { count: 0 }
      ],
      visitId
    }
  };
  dispatch(demoActionAdd(actionData));
  dispatch(demoVisitAdd(visit));
};

export const handleDemoExitVisitor = ({ dispatch, data, actionData: actionPayload, useSelector }) => {
  const actionData = { ...actionPayload };
  const { currentObservation } = useSelector;
  actionData.actionAt = currentObservation.start;

  console.log('demo-Commands-->', data, actionData);
  dispatch(demoVisitorExit({ id: data.userId, exit: currentObservation.start }));// here userId is visitId actually
  dispatch(demoActionAdd(actionData));
};
export const handleDemoAddRemoveItem = ({ dispatch, data, actionData: actionPayload, useSelector, setSnackbar, userName, itemName }) => {
  console.log('handleDemoAddRemoveItem--> 1',);

  const actionData = { ...actionPayload };
  const { currentObservation } = useSelector;
  actionData.actionAt = currentObservation.start;

  console.log('demo-Commands-->', data, actionData);

  console.log('handleDemoAddRemoveItem--> 2',);
  const { items, allDemoVisits } = useSelector;
  const visitAlreadyIn = allDemoVisits.filter(({ basket: { id: basketId } }) => basketId === data.basketId);

  console.log('handleDemoAddRemoveItem--> 3',);
  if (!visitAlreadyIn[0]) {
    console.log('handleDemoAddRemoveItem--> 4',);
    return setSnackbar({ isVisible: true, type: 'error', message: 'Basket Is not used by any visitor' });
  }

  console.log('handleDemoAddRemoveItem--> 5',);
  const findItemById = (array, itemId) => array.findIndex(({ id }) => id === itemId);
  const itemsIndex = findItemById(items, data.itemId);

  console.log('handleDemoAddRemoveItem--> 6',);
  if (itemsIndex === -1) return setSnackbar({ isVisible: true, type: 'error', message: 'Invalid Item' });
  console.log('handleDemoAddRemoveItem--> 7',);
  const visitor = { ...visitAlreadyIn[0] };
  const selectedItem = items[itemsIndex];

  // finding item inside visitor basket items list...
  const visitorItemIndex = findItemById(visitor.basket.items, data.itemId);
  console.log('handleDemoAddRemoveItem--> 8',);
  if (visitorItemIndex === -1) { // if not found in list...
    console.log('handleDemoAddRemoveItem--> 9',);
    // is not found in items list but you gave command to remove items
    if (data.remove) return setSnackbar({ isVisible: true, type: 'error', message: 'Item is already not in basket' });
    console.log('handleDemoAddRemoveItem--> 10',);

    // adding item now ...
    const item = {
      name: data.name,
      id: data.itemId,
      ref_basket_item:
      { count: data.add || 1 }
    };
    console.log('handleDemoAddRemoveItem--> 11',);
    visitor.basket.items = [...visitor.basket.items, item];
    console.log('handleDemoAddRemoveItem--> 13',);
    dispatch(demoActionAdd(actionData));
    console.log('handleDemoAddRemoveItem--> 13', visitor);
    return dispatch({ type: DEMO_BASKET_UPDATE, payload: { visitor } });
  }
  console.log('handleDemoAddRemoveItem--> 14',);
  const selectedVisitorItem = visitor.basket.items[visitorItemIndex];
  if (data.add) {
    console.log('handleDemoAddRemoveItem--> 15',);
    selectedVisitorItem.ref_basket_item.count += data.add;
  }
  console.log('handleDemoAddRemoveItem--> 16',);
  if (data.remove) {
    console.log('handleDemoAddRemoveItem--> 17',);
    selectedVisitorItem.ref_basket_item.count -= data.remove;
  }
  console.log('handleDemoAddRemoveItem--> 18',);

  // remove item if count goes equal or less then zero...
  if (selectedVisitorItem.ref_basket_item.count <= 0) {
    console.log('handleDemoAddRemoveItem--> 19',);
    actionData.text = `${userName} removed ${itemName} from his basket`;
    visitor.basket.items.splice(visitorItemIndex, 1);
  }
  console.log('handleDemoAddRemoveItem--> 20',);

  // const sampleData = {
  //   add: 3,
  //   basketId: 1,
  //   itemId: 10,
  //   observationId: 2,
  //   remove: undefined
  // };
  console.log('handleDemoAddRemoveItem--> 21',);
  dispatch({ type: DEMO_BASKET_UPDATE, payload: { visitor } });
  dispatch(demoActionAdd(actionData));
};
