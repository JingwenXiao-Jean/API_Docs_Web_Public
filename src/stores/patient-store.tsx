// import {
//   computed, observable, makeObservable,
// } from 'mobx';
// import { Axios } from '../utilities/network';
// import { isWeb } from '../utilities/platform';
// import RootStore from './root-store';
// import { GetLocalStorage, SetLocalStorage } from '../utilities/cryptography';
// import { USER_INFO } from '../constants/storage-keys';
// import { navigate } from 'gatsby';
// import { CURRENT_PLATFORM } from '../constants/settings';
// import { Gender, PAGE_SIZE } from '../constants/options';
// import { ProfileTemplate } from '../utilities/profile';
// import { GetLangKey, GetUserProfile, Language } from '../utilities/general';

// export default class PatientStore {

//   loading: boolean = false;

//   loadingHistory: boolean = false;

//   creating: boolean = false;

//   updating: boolean = false;

//   processingHistory: boolean = false;

//   rootStore: RootStore;

//   constructor(rootStore: RootStore) {
//     makeObservable(this, {
//       loading: observable,
//       loadingHistory: observable,
//       creating: observable,
//       updating: observable,
//       processingHistory: observable,
//     });
//     this.rootStore = rootStore;
//   }


//   searchPatient = async (skip: number, take: number = PAGE_SIZE, searchTerm: string, lang: Language = GetLangKey()) => {
//     this.loading = true;
//     try {
//       const res = await Axios.post(`/api/Patient/Search/${skip}/${take}?lang=${lang}&platformId=${CURRENT_PLATFORM}`, { searchTerm, clinicId: GetUserProfile().currentClinicId });
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   getPatient = async (id: number, lang: Language = Language.ENGLISH) => {
//     this.loading = true;
//     try {
//       const res = await Axios.get(`/api/Patient/${id}?lang=${lang}&platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   addPatient = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.creating = true;
//     try {
//       const res = await Axios.post(`/api/Patient?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.creating = false;
//     }
//   };

//   updatePatient = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Patient?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   searchPatientHistory = async (skip: number, take: number = PAGE_SIZE, reqModel: any, lang: Language = GetLangKey()) => {
//     this.loadingHistory = true;
//     try {
//       const res = await Axios.post(`/api/Patient/History/Search/${skip}/${take}?lang=${lang}&platformId=${CURRENT_PLATFORM}`, { ...reqModel, clinicId: GetUserProfile().currentClinicId });
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loadingHistory = false;
//     }
//   };

//   createPatientHistory = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.processingHistory = true;
//     try {
//       const res = await Axios.post(`/api/Patient/History?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.processingHistory = false;
//     }
//   };

//   updatePatientHistory = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Patient/History?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   getPatientHistory = async (id: number, lang: Language = GetLangKey()) => {
//     this.loading = true;
//     try {
//       const res = await Axios.get(`/api/Patient/History/${id}?lang=${lang}&platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };
// }
