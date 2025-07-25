import {
	computed, observable, makeObservable,
} from 'mobx';
import { Axios } from '../utilities/network';
import { isWeb } from '../utilities/platform';
import RootStore from './root-store';
import { GetLocalStorage, SetLocalStorage } from '../utilities/cryptography';
import { MODALITY, USER_INFO } from '../constants/storage-keys';
import { navigate } from 'gatsby';
import { CURRENT_PLATFORM } from '../constants/settings';
import { Gender } from '../constants/options';
import { ProfileTemplate } from '../utilities/profile';
import { GetLangKey, GetUserProfile, Language } from '../utilities/general';

/**
 * User base information
 */
export interface UserInfo {
	id: number,
	username: string,
	firstName: string,
	lastName: string,
	email?: string,
	templateId?: ProfileTemplate | number,
	gender: Gender,
	availableClinics: any[],
	currentClinicId: number,
	isPublished: boolean,
}

export default class UserStore {
	get isAuthed() {
		return isWeb && localStorage.USER_TOKEN != null && localStorage.USER_INFO != null;
	}

	set isAuthed(value) {
		console.log('Deleting token...');
		if (!value && isWeb) localStorage.clear();
	}

	loading: boolean = false;

	loadingAccount: boolean = false;

	signingIn: boolean = false;

	userToken: string | null = null;

	versionNumber: string = "";

	translating: boolean = false;

	rootStore: RootStore;

	constructor(rootStore: RootStore) {
		makeObservable(this, {
			loading: observable,
			signingIn: observable,
			translating: observable,
		});
		this.rootStore = rootStore;
	}

	signIn = async (userModel: any) => {
		this.signingIn = true;
		try {
			const res = await Axios.post(`/api/Auth/SignIn?platformId=${CURRENT_PLATFORM}`, userModel);
			const token = `Bearer ${res.data.token}`;
			const user = res.data;
			this.userToken = user.token;
			if (isWeb) {
				localStorage.USER_TOKEN = token;
				// let userInfo: UserInfo = {
				//   id: user.id,
				//   username: user.username,
				//   firstName: user.firstName,
				//   lastName: user.lastName,
				//   email: user.email,
				//   templateId: user.templateId,
				//   gender: user.gender,
				//   availableClinics: user.availableClinics,
				//   currentClinicId: user.availableClinics.length == 1 ? user.availableClinics[0].id : 0,
				//   isPublished: user.isPublished,
				// };
				SetLocalStorage(USER_INFO, user);
			}
			console.log("User Info", res.data);
			return Promise.resolve(res.data);
		} catch (err) {
			this.isAuthed = false;
			return Promise.reject(err);
		} finally {
			this.signingIn = false;
		}
	};

	signOut = () => {
		this.isAuthed = false;
		this.userToken = null;
		// @ts-ignore
		navigate('/');
		this.rootStore.notify('Bye, hope you are well!', "success");
	};

	signUp = async (userModel: any, lang = GetLangKey()) => {
		this.loading = true;
		try {
			const res = await Axios.post(`/api/Auth/SignUp?lang=${lang}&platformId=${CURRENT_PLATFORM}`, userModel);
			return Promise.resolve(res.data);
		} catch (err) {
			return Promise.reject(err);
		} finally {
			this.loading = false;
		}
	};

	translateTo = async (reqModel: { targetLang: "Chinese" | "English", content: string; }) => {
		this.translating = true;
		try {
			const res = await Axios.post(`/api/Translate?platformId=${CURRENT_PLATFORM}`, reqModel);
			return Promise.resolve(res.data);
		} catch (err) {
			return Promise.reject(err);
		} finally {
			this.translating = false;
		}
	};

	//   searchModality = async (reqModel: any = {}) => {
	//     this.loading = true;
	//     try {
	//       const res = await Axios.post(`/api/Modality/Search/0/0?platformId=${CURRENT_PLATFORM}`, reqModel);
	//       SetLocalStorage(MODALITY, res.data.items);
	//       return Promise.resolve(res.data);
	//     } catch (err) {
	//       return Promise.reject(err);
	//     } finally {
	//       this.loading = false;
	//     }
	//   };

	getUserInfo = async (lang = GetLangKey()) => {
		this.loading = true;
		try {
			const res = await Axios.get(`/api/Patient/?lang=${lang}&platformId=${CURRENT_PLATFORM}`);
			return Promise.resolve(res.data);
		} catch (err) {
			return Promise.reject(err);
		} finally {
			this.loading = false;
		}
	};

	updateUserInfo = async (reqModel: any, lang = GetLangKey()) => {
		this.loadingAccount = true;
		try {
			const res = await Axios.put(`/api/Patient?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
			return Promise.resolve(res.data);
		} catch (err) {
			return Promise.reject(err);
		} finally {
			this.loadingAccount = false;
		}
	}

	updateProfileImage = async (reqModel: any, lang = GetLangKey()) => {
		this.loadingAccount = true;
		try {
			const res = await Axios.put(`/api/Patient/ProfileImage?lang=${lang}&platformId=${CURRENT_PLATFORM}`, reqModel);
			return Promise.resolve(res.data);
		} catch (err) {
			return Promise.reject(err);
		} finally {
			this.loadingAccount = false;
		}
	}
}
