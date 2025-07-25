
import React from 'react';
import { enableStaticRendering } from 'mobx-react';
import RootStore from './root-store';
import UserStore from './user-store';
// import PractitionerStore from './practitioner-store';
// import PatientStore from './patient-store';
// import ClinicStore from './clinic-store';

type CompositeStore = {
  rootStore: RootStore,
  userStore: UserStore,
//   practitionerStore: PractitionerStore,
//   patientStore: PatientStore,
//   clinicStore: ClinicStore,
};

const isServer = typeof window === "undefined";
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(isServer);

// let _stores: null | CompositeStore = null;

const initStores = () => {
  const rootStore = new RootStore();
  const initializedStores: CompositeStore = {
    rootStore,
    userStore: rootStore.userStore,
    // practitionerStore: rootStore.practitionerStore,
    // patientStore: rootStore.patientStore,
    // clinicStore: rootStore.clinicStore,
  };
  return initializedStores;
};

export const stores = initStores(); // _stores || initStores();

export const StoreContext = React.createContext(stores);
// @ts-ignore
export const StoreProvider = ({ children }) => <StoreContext.Provider value={stores}>{children}</StoreContext.Provider>;
