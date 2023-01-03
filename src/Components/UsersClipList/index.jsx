/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable max-len */
import { getUsers } from 'Api/request';
import ImageDialog from 'Components/Dialog/Dialog';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getObservationVisits, getVisitImages, signOut } from 'Store/actions';
import { GET_OBSERVATION_VISITS } from 'Store/constants/actionTypes';
import './styles.scss';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import NoData from 'Components/NoData/NoData';
import { formatDate } from 'Helpers';

const initialUserData = {
  image: 'https://us.123rf.com/450wm/urfandadashov/urfandadashov1806/urfandadashov180601827/150417827-photo-not-available-vector-icon-isolated-on-transparent-background-photo-not-available-logo-concept.jpg?ver=6',
  name: 'Rahul Soni'
};
const UserBox = ({ user, basket, id, start, end, ref_visit_images: visit_images, idx, handleImageModal, images }) => {
  const dispatch = useDispatch();
  let enterAt = new Date(start);
  enterAt = enterAt.toLocaleDateString();
  let exitAt;
  if (end && end !== null) {
    exitAt = new Date(end);
    exitAt = exitAt.toLocaleDateString();
  }
  useEffect(() => {
    if (images === undefined) {
      const data = { visitId: JSON.stringify(id) }; // will work with string value only
      // console.log('fetchImages,,,,,__init__', data);
      dispatch(getVisitImages(data));
    }
  }, [images]);
  // const { visits } = useSelector((state) => state.observationReducer);
  // useEffect(() => {
  //   console.log('fetchImages,,,,,', visits);
  // }, [visits]);
  // useEffect(() => {
  // console.log('fetchImages,,,,,images-000000', id, images?.length);
  // }, [images]);

  return (
    <>
      <div className="user-clip" key={idx}>
        <div className="user-clip-image">
          {images?.length > 0 ? images.map((image, idx) => (
            <>
              {/* <a href={image}>{idx}</a> */}
              <img
                src={image}
                onClick={() => handleImageModal({ name: user.name, image })}
                alt="Profile "
              />
            </>
          )) : (
            <img
              src={initialUserData.image}
              onClick={() => handleImageModal({ name: initialUserData.name, image: initialUserData.image })}
              alt="Profile "
            />
          )}
        </div>
        <div className="user-clip-details">
          <div className="details-head">
            {user?.name || 'Anonymous Visitor'}

          </div>
          <div className="details-body">
            <div>
              <div>
                visitId:
                {' '}
                {id || 'NaN'}
              </div>
              <div>
                basketId :
                {' '}
                { basket?.id || 'NaN'}
              </div>
              <div>
                Enter :
                {' '}
                {formatDate(start) || 'NaN'}
              </div>
              <div>
                Exit :
                {' '}
                { (end === null ? 'In Store' : formatDate(end) || 'NaN')}
              </div>
            </div>

            <br />
            <div>
              Total Basket Items:
              {' '}
              {basket?.items.length}
            </div>
            <br />
            {basket?.items?.map(({ item: { name }, id, ref_basket_item: { count } }, idx) => (
              <>
                <div>
                  (
                  {idx + 1}
                  )
                  <ul>
                    <li>
                      - Name:
                      {' '}
                      {name}
                    </li>
                    <li>
                      - itemId:
                      {' '}
                      {id}
                    </li>
                    <li>
                      - Count :
                      {' '}
                      {count}
                    </li>
                  </ul>
                </div>
                <br />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const UserSkeleton = () => (
  <>
    <div className="user-clip">
      <div className="user-clip-image">
        <Skeleton
          className="img"
          height="100%"
          containerClassName="avatar-skeleton"
        />

      </div>
      <div className="user-clip-details">
        <Skeleton height={15} width={150} />
        <Skeleton height={50} />
      </div>
    </div>
  </>
);
export default function UsersCipList() {
  const [Snackbar, setSnackbar] = useState();

  const dispatch = useDispatch();
  const { currentObservation, visits: storeVisiters, fetchingVisits, fetchingObservations } = useSelector((state) => state.observationReducer);

  const { isDemoMode } = useSelector((state) => state.demoReducer);
  useEffect(() => {
    if (isDemoMode) return;
    console.log('IsDemoMode Failed To Block--->', isDemoMode);
    if (currentObservation?.id) {
      const data = { observationId: currentObservation.id };
      dispatch(getObservationVisits(data, undefined, () => {
      }));
    } else {
      dispatch({ type: GET_OBSERVATION_VISITS, payload: [] });
    }
  }, [currentObservation]);
  const [open, setOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState({
    name: '',
    image: ''
  });

  const handleImageModal = (data) => {
    setSelectedVisit(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="main-user-container">
      <div className="heading">Current Users</div>
      <div className="users-list-scroll">
        {(fetchingVisits || fetchingObservations) && !(storeVisiters.length >= 1) ? (
          <>
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />

          </>
        )
          : (
            <>
              {storeVisiters?.map((props, idx) => (
                <UserBox {...props} idx={idx} handleImageModal={handleImageModal} />
              ))}
              {storeVisiters.length >= 1 ? '' : (<NoData name="Visitors" />)}
            </>
          )}

        <ImageDialog
          handleImageModal={handleImageModal}
          handleClose={handleClose}
          open={open}
          setOpen={setOpen}
          data={selectedVisit}
        />
      </div>
    </div>

  );
}
