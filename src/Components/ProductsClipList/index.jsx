/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable eqeqeq */
/* eslint-disable max-len */
import { TextInput } from 'Components';
import React, { useEffect, useState } from 'react';
import './styles.scss';
import { ReactComponent as RightArrow } from 'Assets/icons/RightArrow.svg';
import { ReactComponent as LeftArrow } from 'Assets/icons/LeftArrow.svg';

import { paginator } from 'Helpers';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreProducts } from 'Store/actions/store.action';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import NoData from 'Components/NoData/NoData';

const Product = (props) => {
  const { refs, setCurrentIndex, item: { imageUrl, name, id, key, fetchingProducts } } = props;
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <>
      <div className="product-clip" ref={refs[key]} onMouseOver={() => setCurrentIndex(key)}>
        <div className="product-clip-image">
          {!imageLoaded && <Skeleton className="img" />}
          <img src={imageUrl} alt={name} onLoad={() => setImageLoaded(true)} className={`${!imageLoaded ? 'hide' : ''}`} />
        </div>
        <div className="product-clip-label">
          <span>
            {`${name}`}
            {' '}
            {`(itemId: ${id})`}
          </span>
        </div>
      </div>
    </>
  );
};

export default function ProductsClipList() {
  const [searchText, setSearchText] = useState('');
  const { currentStore, items: storeItems } = useSelector((state) => state.storeReducer);
  const [searched, setSearched] = useState(storeItems);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const refs = searched.reduce((acc, value) => {
    acc[value.key] = React.createRef();
    return acc;
  }, {});

  const dispatch = useDispatch();
  const { isDemoMode } = useSelector((state) => state.demoReducer);
  useEffect(() => {
    if (isDemoMode) return;
    if (currentStore?.id) {
      const data = { storeId: currentStore.id };
      dispatch(getStoreProducts(data, undefined, () => {
      }));
    }
  }, [currentStore]);
  useEffect(() => {
    if (searched[0] && refs !== null) {
      refs[searched[0].key].current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCurrentIndex(0);
    }
  }, [storeItems]);
  useEffect(() => {
    const searchedClips = storeItems.filter(({ name }) => name.toLowerCase().search(searchText.toLowerCase()) != -1);
    if (searchText === '') {
      setSearched(storeItems);
    } else {
      setSearched(searchedClips);
    }
  }, [searchText, storeItems]);

  const [firstBack, setFirstBack] = React.useState(true);
  const handleRight = () => {
    // console.clear();
    console.log(refs, currentIndex);
    setFirstBack(true);
    let newIndex = currentIndex < 14 ? 14 : currentIndex + 1;
    newIndex = newIndex <= searched.length ? newIndex : 1;
    setCurrentIndex(newIndex);
    if (refs[newIndex]?.current) {
      refs[newIndex].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      refs[searched[0].key].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCurrentIndex(newIndex);
    }
  };
  const handleLeft = () => {
    let newIndex = (currentIndex < 0 && !currentIndex) ? 0 : currentIndex - 1;
    if (firstBack) {
      newIndex -= 13;
      setFirstBack(false);
    }
    newIndex = newIndex <= searched.length ? newIndex : 1;
    setCurrentIndex(newIndex);
    if (refs[newIndex]?.current) {
      refs[newIndex].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      refs[searched[0].key].current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setCurrentIndex(0);
    }
  };
  return (
    <div className="main-product-container">
      <div className="heading">
        Products (Ranked by top matching) [
        {storeItems.length}
        {' '}
        Items
        ]
      </div>
      <div className="filter-options">
        <div className="search-input">
          <TextInput placeholder="Search by name, category, color, tag etc." onChange={(evt) => setSearchText(evt.target.value)} />
        </div>
        <div className="slider-options">
          <button onClick={() => handleLeft()}><LeftArrow /></button>
          {' '}
          <button onClick={() => handleRight()}><RightArrow /></button>
        </div>
      </div>
      <div className="scroll-menu">
        {searched.map((props, idx) => (
          <>
            <Product item={props} setCurrentIndex={setCurrentIndex} refs={refs} />
          </>
        ))}
        {searched.length >= 1 ? '' : (<NoData name="Items" />)}

      </div>

    </div>
  );
}
