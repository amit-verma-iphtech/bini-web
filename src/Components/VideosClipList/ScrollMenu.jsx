import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import NoData from 'Components/NoData/NoData';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { findObjectByIdFromList } from 'Store/helper';
import { dispatchChangeObservation as dispatchObservation } from 'Helpers/ActionMultipleObservation';
import ObservationClip from './ObservationClip';

const scrollSelected = async ({ selected, refs, list }) => {
  const scroll = selected?.id && refs[selected.id] && (refs[selected.id].current !== null);
  console.log('scrollChange3', scroll);
  if (!scroll) return;
  console.log('scrollChange4');

  const idx = findObjectByIdFromList(list, selected.id);
  if ((idx === -1)) return;
  console.log('scrolled', refs[selected.id].current.offsetLeft);
  await refs[selected.id].current.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
};

export const ScrollMenuUnverified = ({ list, handleSelect, type, showVerified }) => {
  const handleScroll = (e) => {
    const end = e.target.scrollWidth - e.target.scrollLeft === e.target.clientWidth;
    // console.log('scrolle..', e.target.scrollWidth, e.target.clientWidth, e.target.scrollLeft, end);
    if (end) {
      // alert('Scroll End');
    }
  };
  const refs = list.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});
  const {
    observationReducer: { currentObservation },
  } = useSelector((state) => state);
  useEffect(() => {
    scrollSelected({ selected: currentObservation, refs, list });
  }, [currentObservation, showVerified]);

  return (
    <>
      <div className="scroll-menu" onScroll={handleScroll}>
        {list.map((props, idx) => (
          <ObservationClip {...props} scrollMenuProps={{ refs, handleSelect: (id, event) => handleSelect(type, id, event), }} />
        ))}
        {list.length >= 1 ? '' : (<NoData name="Observations" />)}
      </div>
    </>
  );
};

export const ScrollMenuVerified = ({ list: observations, handleSelect, type, setCurrenQueue, showVerified }) => {
  const dispatch = useDispatch();
  const dispatchChangeObservation = (props) => dispatchObservation(props, dispatch);

  const {
    observationReducer: { currentObservation },
  } = useSelector((state) => state);

  const [list, setList] = useState([]);

  const refs = list.reduce((acc, value) => {
    acc[value.id] = React.createRef();
    return acc;
  }, {});

  const [currentPage, setCurrentPage] = useState(1);

  const size = 8;
  const totalPage = Math.ceil(observations.length / size);
  const paginateArray = ({ array, size, page }) => array.slice((page - 1) * size, page * size);

  const loadMore = (number) => {
    const reversedObservations = observations.map((obj) => obj).reverse();
    const nextList = paginateArray({ array: reversedObservations, size: number || size, page: currentPage }).reverse();
    if (!(nextList.length > 0)) return;
    setList(nextList.concat(list));
    setCurrentPage(currentPage + 1);
    // if (number > size) {
    //   setCurrentPage(Math.ceil(number / size) + 1);
    // } else {
    //   setCurrentPage(currentPage + 1);
    // }
  };
  // useEffect(() => {
  //   console.log('loadingmore-->', currentPage, observations, list);
  // }, [list]);
  useEffect(() => {
    const selected = observations[observations.length - 1];
    console.log('setting observation.... scrollChange0.1-->loadMore()', selected);
    dispatchChangeObservation(selected);
    loadMore();
  }, [observations]);
  const [enableScroll, setEnableScroll] = useState(true);
  useEffect(() => {
    console.log('scrollChange1-->', list.length, observations.length, totalPage, currentPage);
    console.log('scrollChange1.1-->', list, observations);
    setCurrenQueue(list.length);

    // scrollSelected({ selected: list[size], refs, list }).then(() => setEnableScroll(true));
  }, [list, showVerified]);

  useEffect(() => {
    if (list.length !== size) return;
    scrollSelected({ selected: list[list.length - 1], refs, list }).then(() => setEnableScroll(true));
  }, [list]);
  const handleScroll = (e) => {
    if (!enableScroll) return;
    console.log('scrollChange0.01-->loadMore()', e.target.scrollLeft);
    if (e.target.scrollLeft === 0) {
      console.log('scrollChange0.01-->loadMore()', e.target.scrollLeft);
      // setEnableScroll(false);
      loadMore();
    }
  };
  return (
    <>
      <div className="scroll-menu" onScroll={handleScroll}>
        {list.map((props, idx) => (
          <ObservationClip {...props} scrollMenuProps={{ refs, handleSelect: (id, event) => handleSelect(type, id, event), list }} />
        ))}
        {list.length >= 1 ? '' : (<NoData name="Observations" />)}
      </div>
    </>
  );
};
