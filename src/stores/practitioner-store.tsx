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
// import { GetLangKey, GetLangLabel, GetUserProfile, Language } from '../utilities/general';


// export default class PractitionerStore {

//   loading: boolean = false;

//   loadingArticles: boolean = false;

//   updating: boolean = false;

//   removing: boolean = false;

//   loadingTimeslots: boolean = false;

//   rootStore: RootStore;

//   constructor(rootStore: RootStore) {
//     makeObservable(this, {
//       loading: observable,
//       loadingArticles: observable,
//       updating: observable,
//       removing: observable
//     });
//     this.rootStore = rootStore;
//   }

//   createProfile = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.loading = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   getProfile = async (lang: Language = GetLangKey()) => {
//     this.loading = true;
//     try {
//       const res = await Axios.get(`/api/Practitioner/${GetUserProfile().id}?lang=${lang}&platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   updateProfile = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   createProfileSkillKey = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner/Skill/Key?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   updateProfileSkillKey = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Skill/Key?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   updateProfileSkillKeys = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Skill/Kiss?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   removeProfileSkillKey = async (id: number) => {
//     this.removing = true;
//     try {
//       const res = await Axios.delete(`/api/Practitioner/Skill/Key/${id}?platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.removing = false;
//     }
//   };

//   searchArticles = async (searchTerm: string, lang: Language = GetLangKey()) => {
//     this.loadingArticles = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner/Article/Search/0/0?lang=${lang}&platformId=${CURRENT_PLATFORM}`, { searchTerm, practitionerId: GetUserProfile().id });
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loadingArticles = false;
//     }
//   };

//   getArticle = async (id: number, lang: Language = GetLangKey()) => {
//     this.loading = true;
//     try {
//       const res = await Axios.get(`/api/Practitioner/Article/${id}?lang=${lang}&platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   createArticle = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.loading = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner/Article?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   updateArticle = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Article?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };



//   toggleArticlePublish = async (id: number, isPublish: boolean, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put( `/api/Practitioner/Article/${id}/${isPublish ? "Show" : "Hide"}?lang=${lang}&platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   removeArticle = async (id: number) => {
//     this.removing = true;
//     try {
//       const res = await Axios.delete(`/api/Practitioner/Article/${id}?platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.removing = false;
//     }
//   };

//   updateStrengths = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Strengths?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   updateSpecialities = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Specialises?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   updateReviewBackground = async (reqModel: any) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/ReviewBg?platformId=${CURRENT_PLATFORM}`, { ...reqModel, practitionerId: GetUserProfile().id });
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   removeReviewBackground = async (id: number) => {
//     this.removing = true;
//     try {
//       const res = await Axios.delete(`/api/Practitioner/ReviewBg/${id}?platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.removing = false;
//     }
//   };

//   updateProfileImage = async (reqModel: any) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/ProfileImage?platformId=${CURRENT_PLATFORM}`, { ...reqModel, practitionerId: GetUserProfile().id });
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   updatePatientReview = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Patient/Reviews?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   updateSlug = async (slug: string) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Slug?platformId=${CURRENT_PLATFORM}`, { id: GetUserProfile().id, slug });
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   searchCourses = async (searchTerm: string, lang: Language = GetLangKey()) => {
//     this.loading = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner/Course/Search/0/0?lang=${lang}&platformId=${CURRENT_PLATFORM}`, { searchTerm, practitionerId: GetUserProfile().id });
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   updateCourse = async (reqModel: any, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Course?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   getCourse = async (id: number, lang: Language = GetLangKey()) => {
//     this.updating = true;
//     try {
//       const res = await Axios.get(`/api/Practitioner/Course/${id}?lang=${lang}&platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   updateWorkingTime = async (reqModel: any) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Clinic/Practitioner/WorkingTime?platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   togglePublishProfile = async (id: number, isPublish: boolean) => {
//     this.loading = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/${id}/${isPublish ? "Publish" : "Unpublish"}?platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   searchBooking = async (skip: number, take: number = PAGE_SIZE, reqModel: any) => {
//     this.loading = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner/Booking/Search/${skip}/${take}?platformId=${CURRENT_PLATFORM}`, {...reqModel, clinicId: GetUserProfile().currentClinicId});
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   confirmBooking = async (id: number) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Booking/Confirm/${id}?platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   getTimeslots = async (reqModel: any) => {
//     this.loadingTimeslots = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner/Booking/Timeslots?platformId=${CURRENT_PLATFORM}`, { ...reqModel, practitionerId: GetUserProfile().id, clinicId: GetUserProfile().currentClinicId, isBooked: false });
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loadingTimeslots = false;
//     }
//   };

//   assignPatientToAppointment = async (appointmentId: number, patientId: number) => {
//     this.updating = true;
//     try {
//       const res = await Axios.put(`/api/Practitioner/Booking/Assign?id=${appointmentId}&patientId=${patientId}&platformId=${CURRENT_PLATFORM}`);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.updating = false;
//     }
//   };

//   getRelatedClinics = async (reqModel: any = {}, lang: Language = GetLangKey()) => {
//     this.loading = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner/Clinic/Search/0/0?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

//   searchPractitioners = async (skip: number, take: number = PAGE_SIZE, reqModel: any = {}, lang: Language = GetLangKey()) => {  
//     this.loading = true;
//     try {
//       const res = await Axios.post(`/api/Practitioner/Search/${skip}/${take}?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
//       return Promise.resolve(res.data);
//     } catch (err) {
//       return Promise.reject(err);
//     } finally {
//       this.loading = false;
//     }
//   };

// }
