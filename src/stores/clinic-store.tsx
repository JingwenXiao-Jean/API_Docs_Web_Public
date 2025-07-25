// import {
// 	computed, observable, makeObservable,
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

// export default class ClinicStore {

// 	loading: boolean = false;

// 	//   loadingHistory: boolean = false;

// 	creating: boolean = false;

// 	updating: boolean = false;

// 	//   processingHistory: boolean = false;

// 	rootStore: RootStore;

// 	constructor(rootStore: RootStore) {
// 		makeObservable(this, {
// 			loading: observable,
// 			//   loadingHistory: observable,
// 			creating: observable,
// 			updating: observable,
// 			//   processingHistory: observable,
// 		});
// 		this.rootStore = rootStore;
// 	}

// 	searchClinics = async (skip: number, take: number = PAGE_SIZE, reqModel: any = {}, lang: Language = GetLangKey()) => {
// 		this.loading = true;
// 		try {
// 			const res = await Axios.post(`/api/Clinic/Search/${skip}/${take}?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
// 			return Promise.resolve(res.data);
// 		} catch (err) {
// 			return Promise.reject(err);
// 		} finally {
// 			this.loading = false;
// 		}
// 	};

// 	addClinic = async (reqModel: any, lang: Language = GetLangKey()) => {
// 		this.creating = true;
// 		try {
// 			const res = await Axios.post(`/api/Clinic?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
// 			return Promise.resolve(res.data);
// 		} catch (err) {
// 			return Promise.reject(err);
// 		} finally {
// 			this.creating = false;
// 		}
// 	};

// 	getClinicById = async (id: number, lang: Language = GetLangKey()) => {
// 		this.loading = true;
// 		try {
// 			const res = await Axios.get(`/api/Clinic/${id}?lang=${lang}&platformId=${CURRENT_PLATFORM}`);
// 			return Promise.resolve(res.data);
// 		} catch (err) {
// 			return Promise.reject(err);
// 		} finally {
// 			this.loading = false;
// 		}
// 	};

// 	updateClinic = async (reqModel: any, lang: Language = GetLangKey()) => {
// 		this.updating = true;
// 		try {
// 			const res = await Axios.put(`/api/Clinic?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
// 			return Promise.resolve(res.data);
// 		} catch (err) {
// 			return Promise.reject(err);
// 		} finally {
// 			this.updating = false;
// 		}
// 	};

// 	getGeneralTimeSlots = async (reqModel: any, lang: Language = GetLangKey()) => {
// 		this.loading = true;
// 		try {
// 			const res = await Axios.post(`/api/Clinic/Practitioner/GeneralTimeSlots?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
// 			return Promise.resolve(res.data);
// 		} catch (err) {
// 			return Promise.reject(err);
// 		} finally {
// 			this.loading = false;
// 		}
// 	};

// 	updateClinicMemberSettings = async (reqModel: any, lang: Language = GetLangKey()) => {
// 		this.updating = true;
// 		try {
// 			const res = await Axios.put(`/api/Clinic/Practitioner/WorkingSetting?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
// 			return Promise.resolve(res.data);
// 		} catch (err) {
// 			return Promise.reject(err);
// 		} finally {
// 			this.updating = false;
// 		}
// 	}

// 	searchClinicPractitioners = async (skip: number, take: number = PAGE_SIZE, reqModel: any = {}, lang: Language = GetLangKey()) => {
// 		this.loading = true;
// 		try {
// 			const res = await Axios.post(`/api/Clinic/Practitioner/Search/${skip}/${take}?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
// 			return Promise.resolve(res.data);
// 		} catch (err) {
// 			return Promise.reject(err);
// 		} finally {
// 			this.loading = false;
// 		}
// 	};

// }
