import { Config } from 'Configs';
import moment from 'moment';

const initialObservationList = [
  `${Config.bucketUrl}/21.mp4`,
  `${Config.bucketUrl}/20.mp4`,
];
const addExtraObservationList = [
  `${Config.bucketUrl}/1.mp4`,
  `${Config.bucketUrl}/2.mp4`,
  `${Config.bucketUrl}/3.mp4`,
  `${Config.bucketUrl}/4.mp4`,
  `${Config.bucketUrl}/5.mp4`,
  `${Config.bucketUrl}/6.mp4`,
  `${Config.bucketUrl}/7.mp4`,
  `${Config.bucketUrl}/8.mp4`,
  `${Config.bucketUrl}/9.mp4`,
  `${Config.bucketUrl}/10.mp4`,
  `${Config.bucketUrl}/11.mp4`,
  `${Config.bucketUrl}/12.mp4`,
  `${Config.bucketUrl}/13.mp4`,
  `${Config.bucketUrl}/14.mp4`,
  `${Config.bucketUrl}/15.mp4`,
  `${Config.bucketUrl}/16.mp4`,
  `${Config.bucketUrl}/17.mp4`,
  `${Config.bucketUrl}/18.mp4`,
  `${Config.bucketUrl}/19.mp4`,
].reverse();
const verifiedObservations = [
];
export const generateObservation = ({ id, videoUrl }) => {
  const time = moment();
  const start = time.format();
  const end = time.add(15, 'seconds').format();
  const createdAt = end;
  const payload = {
    id,
    start,
    end,
    createdAt,
    updatedAt: createdAt,
    videoUrl,

    'available': false,
    'verified': false,
    'loaded': false,
    'cameraId': 1,
    'storeId': 1,
    'assignedTo': 1,
  };
  return payload;
};
export const generateVerifiedObservation = ({ id, videoUrl }) => {
  const time = moment();
  const start = time.subtract(15 * id, 'minutes').format();
  const end = time.subtract((15 * id) - 1, 'minutes').format();
  const createdAt = end;
  const payload = {
    id,
    start,
    end,
    createdAt,
    updatedAt: createdAt,
    videoUrl,

    'available': false,
    'verified': true,
    'loaded': true,
    'cameraId': 1,
    'storeId': 1,
    'assignedTo': 1,
  };
  return payload;
};

export const generateMultipleObservations = (list) => list.map((videoUrl, idx) => generateObservation({ videoUrl, id: idx + 1 }));
export const generateMultipleVerifiedObservations = (list) => list.map((videoUrl, idx) => generateVerifiedObservation({ videoUrl, id: idx + 1 }));

export default {
  videoPlaying: true,

  fetchingObservations: false,
  observationsLoaded: true,
  observations: generateMultipleObservations(initialObservationList),
  extraObservations: [],

  fetchingVerifiedObservations: false,
  verifiedObservationsLoaded: true,
  verifiedObservations: generateMultipleVerifiedObservations(verifiedObservations).reverse(),

  fetchingActions: false,
  actions: [],

  visits: [],
  fetchingVisits: false,
  addExtraObservationList,
  // allDemoActions: [
  //   {
  //     text: 'Rahul entered into store',
  //     createdAt: '2022-03-06T18:59:44.238Z',
  //     actionOn: 1,
  //     actionOnType: 'observation'
  //   }
  // ],
  // allDemoVisits: [
  //   {
  //     id: 1,
  //     observationId: 1,
  //     start: '2022-03-07T00:29:20+05:30',
  //     end: null,
  //     storeId: 1,
  //     user: {
  //       id: 1,
  //       name: 'Rahul'
  //     },
  //     ref_visit_images: [],
  //     basket: {
  //       id: 1,
  //       isPaid: false,
  //       createdAt: '2022-03-06T18:59:44.238Z',
  //       updatedAt: '2022-03-06T18:59:44.238Z',
  //       items: [],
  //       visitId: 1
  //     }
  //   }
  // ]
  allDemoActions: [],
  allDemoVisits: []

};
