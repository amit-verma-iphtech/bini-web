import { dataFetcher } from '.';
import ep from './endpoints';

const methods = {
  post: 'POST',
  get: 'GET',
  put: 'PUT',
  patch: 'PATCH',
  delete: 'DELETE'

};
const getQuery = (formData) => {
  const query = new URLSearchParams(formData).toString();
  return `?${query}`;
};

export const endpoints = ep;
// auth & user apis...
export const requestSignIn = (formData) => dataFetcher({ url: endpoints.signIn, method: methods.post, data: formData });
export const requestSignUp = (formData) => dataFetcher({ url: endpoints.signUp, method: methods.post, data: formData });
export const requestGetUsers = (formData) => dataFetcher({ url: endpoints.users, method: methods.get, data: formData });

// common items apis...
export const requestGetItems = (query) => dataFetcher({ url: `${endpoints.items}${getQuery(query)}`, method: methods.get, });

// store=product apis...

export const requestGetStoreProducts = (query) => dataFetcher({ url: `${endpoints.getStoreProducts}${getQuery(query)}`, method: methods.get, });
export const requestCreateStoreProduct = (formData) => dataFetcher({ url: endpoints.createStoreProduct, method: methods.post, data: formData, });
export const requestUpdateStoreProduct = (formData) => dataFetcher({ url: endpoints.updateStoreProduct, method: methods.put, data: formData });

// categories apis...
export const requestGetAllCategories = (query) => dataFetcher({ url: `${endpoints.getAllCategories}${getQuery(query)}`, method: methods.get, });

// stores apis...
export const requestGetStores = (formData) => dataFetcher({ url: endpoints.stores, method: methods.get, data: formData });
export const requestCreateStore = (formData) => dataFetcher({ url: endpoints.stores, method: methods.post, data: formData });

// observations apis...
export const requestCreateObservation = (formData) => dataFetcher({ url: endpoints.observations, method: methods.post, data: formData });
export const requestGetObservations = (query) => dataFetcher({ url: `${endpoints.observations}${getQuery(query)}`, method: methods.get, });
export const requestViewAllObservations = (query) => dataFetcher({ url: `${endpoints.viewAllObservations}${getQuery(query)}`, method: methods.get, });
export const requestGetVerifiedObservations = (formData) => dataFetcher({
  url: endpoints.verifiedObservations, method: methods.post, data: formData });
export const requestGetExtraObservation = (query) => dataFetcher({ url: `${endpoints.extraObservation}${getQuery(query)}`, method: methods.get, });
export const requestUpdateObservation = (formData) => dataFetcher({
  url: `${endpoints.updateObservation(formData.id)}`,
  method: methods.put,
  data: { ...formData, id: undefined }
});
export const requestVerify_multiple_observation = (formData) => dataFetcher({
  url: endpoints.verify_multiple_observation,
  method: methods.post,
  data: formData
});
export const requestUnverify_multiple_observation = (formData) => dataFetcher({
  url: endpoints.unverify_multiple_observations,
  method: methods.post,
  data: formData
});

// camera apis...
export const requestGetCameras = (query) => dataFetcher({ url: `${endpoints.getCameras}${getQuery(query)}`, method: methods.get, });

// visits apis...
export const requestAddVisit = (formData) => dataFetcher({ url: endpoints.visits, method: methods.post, data: formData });
export const requestGetVisits = (query) => dataFetcher({ url: `${endpoints.visits}${getQuery(query)}`, method: methods.get, });
export const requestCreateVisit = (formData) => dataFetcher({ url: endpoints.visits, method: methods.post, data: formData });
export const requestGetVisitImages = (formData) => dataFetcher({ url: endpoints.getVisitImages, method: methods.post, data: formData });
export const requestUpdateVisit = (formData) => dataFetcher({
  url: `${endpoints.visits}/${formData.id}`, method: methods.put, data: { ...formData, id: undefined } });

// actions apis...
export const requestGetActions = (query) => dataFetcher({ url: `${endpoints.actions}${getQuery(query)}`, method: methods.get });
export const requestCreateAction = (formData) => dataFetcher({ url: endpoints.actions, method: methods.post, data: formData });
// shelf apis...
export const requestGetShelf = (query) => dataFetcher({ url: `${endpoints.getShelf}${getQuery(query)}`, method: methods.get });

// user basket apis...
export const requestAddRemoveItem = (formData) => dataFetcher({ url: endpoints.addRemoveItem, method: methods.post, data: formData });

export const requestBackendVersion = (formData) => dataFetcher({ url: endpoints.backendVersion, method: methods.get });

// organization store access...
export const requestOrganizationAddStoreAccess = (formData) => dataFetcher({
  url: endpoints.organizationStoreAccess, method: methods.post, data: formData });
export const requestOrganizationUpdateStoreAccess = (formData) => dataFetcher({
  url: endpoints.organizationStoreAccess, method: methods.put, data: formData });
export const requestOrganizationRemoveStoreAccess = (formData) => dataFetcher({
  url: endpoints.organizationStoreAccess, method: methods.delete, data: formData });

// organization user access...
export const requestOrganizationAddUserAccess = (formData) => dataFetcher({
  url: endpoints.organizationUserAccess, method: methods.post, data: formData });
export const requestOrganizationUpdateUserAccess = (formData) => dataFetcher({
  url: endpoints.organizationUserAccess, method: methods.put, data: formData });
export const requestOrganizationRemoveUserAccess = (formData) => dataFetcher({
  url: endpoints.organizationUserAccess, method: methods.delete, data: formData });

// organization ...
export const requestGetOrganizations = (query) => dataFetcher({ url: `${endpoints.organizations}${getQuery(query)}`, method: methods.get, });
export const requestCreateOrganization = (formData) => dataFetcher({ url: endpoints.organizations, method: methods.post, data: formData });
export const requestUpdateOrganization = (formData) => dataFetcher({ url: endpoints.organizations, method: methods.put, data: formData });
export const requestDeleteOrganization = (formData) => dataFetcher({ url: endpoints.organizations, method: methods.delete, data: formData });
