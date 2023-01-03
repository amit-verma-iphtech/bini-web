/* eslint-disable no-use-before-define */
/* eslint-disable no-new */
import React, { useEffect, useCallback, useRef, useMemo } from 'react';
import DragSort from '@yaireo/dragsort';
import '@yaireo/dragsort/dist/dragsort.css';
import Tags from '@yaireo/tagify/dist/react.tagify';
import './style.scss';
import { useDispatch, useSelector } from 'react-redux';
import { verify_multiple_observation, unverify_multiple_observation } from 'Store/actions';
import * as api from 'Api/request';

const constants = {
  verify: 'verify',
  unverify: 'unverify'
};

const TagInput = ({
  commands: tagValue,
  setCommands: setTagValue,
  tagSettings, tagProps
}) => {
  const {
    storeReducer: { currentStore },
    observationReducer: { observations, currentObservation, observationsLoaded, verifiedObservations, selectedObservations },
    authReducer: { user },
  } = useSelector((state) => state);
  const dispatch = useDispatch();

  const actionData = { actionBy: user?.id };
  const verify = async (list) => {
    dispatch(verify_multiple_observation({ observationIds: list, userId: user.id, storeId: currentStore.id }));
    const promiseAll = selectedObservations.map(async ({ id, start }) => {
      actionData.text = `Observation verified by ${user.name}`;
      actionData.actionOn = id;
      actionData.action = 'verify operator';
      actionData.actionOnType = 'observation';
      actionData.observationId = id;
      actionData.actionAt = start;
      await api.requestCreateAction(actionData);
    });
    // const response = await Promise.all(promiseAll);
    // alert('Success Verify Multiple');
  };
  const unverify = async (list) => {
    dispatch(unverify_multiple_observation({ observationIds: list, userId: user.id }));
    const promiseAll = selectedObservations.map(async ({ id, start }) => {
      actionData.text = `Observation disapproved by ${user.name}`;
      actionData.actionOn = id;
      actionData.observationId = id;
      actionData.actionAt = start;
      actionData.actionOnType = 'observation';
      actionData.action = 'unverify operator';

      await api.requestCreateAction(actionData);
    });
    // const response = await Promise.all(promiseAll);
    // alert('Success UnVerify Multiple');
  };
  const handleMultiple = (type) => {
    const list = selectedObservations.map(({ id }) => id);
    if (!(list.length > 0)) { return alert('No Observations Slected'); }
    if (type === constants.verify) {
      verify(list);
    } else { unverify(list); }
  };

  const tagifyRef1 = useRef();
  const tagifyRefDragSort = useRef();

  const clearAll = () => {
    tagifyRef1.current && tagifyRef1.current.removeAllTags();
  };
  useEffect(() => {
    if (tagValue.length <= 0 || tagValue.length === undefined) {
      clearAll();
    }
  }, [tagValue]);

  const onTagChange = useCallback((e) => {
    if (e.detail.value) {
      const value = JSON.parse(e.detail.value);
      setTagValue(value);
    } else {
      setTagValue([]);
    }
  }, []);

  useMemo(() => {
    if (tagifyRefDragSort.current) {
      new DragSort(tagifyRefDragSort.current.DOM.scope, {
        selector: '.tagify__tag',
        callbacks: {
          dragEnd: onDragEnd
        }
      });
    }
  }, [tagifyRefDragSort.current]);

  function onDragEnd(elm) {
    tagifyRefDragSort.current.updateValueByDOMTags();
  }

  return (
    <>
      <button className="clearAllBtn" onClick={() => handleMultiple(constants.verify)}>
        Verify
      </button>
      <button className="clearAllBtn" onClick={() => handleMultiple(constants.unverify)}>
        Un Verify
      </button>
      <button className="clearAllBtn" onClick={clearAll}>
        Clear All
      </button>
      <Tags
        tagifyRef={tagifyRef1}
        settings={tagSettings}
        autoFocus
        {...tagProps}
        value={tagValue}
        onChange={onTagChange}
      />

    </>
  );
};

export default TagInput;
