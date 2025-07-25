import {
	observable,
	action,
	makeObservable,
	runInAction,
} from 'mobx';
import RootStore from './root-store';
import { Axios } from '../utilities/network'; // 和 ClinicStore 一致
import { navigate } from 'gatsby';

const API_BASE = '/api/APIDoc'; // 走 Axios 配置的 baseURL

export default class DocumentStore {
	loading: boolean = false;
	creating: boolean = false;
	updating: boolean = false;
	deleting: boolean = false;

	tree: any[] = [];       // API 树结构
	endpoints: any[] = [];  // 所有 Endpoint 列表
	isAuthed: boolean = false;
	userToken: string | null = null;

	rootStore: RootStore;

	constructor(rootStore: RootStore) {
		makeObservable(this, {
			loading: observable,
			creating: observable,
			updating: observable,
			deleting: observable,
			tree: observable,
			endpoints: observable,
			isAuthed: observable,
			userToken: observable,

			setAuth: action,
			signOut: action,
			// fetchTree: action,
			fetchEndpoints: action,
			// saveTreeNode: action,
			// deleteTreeNode: action,
			// saveEndpoint: action,
			// deleteEndpoint: action,
		});

		this.rootStore = rootStore;
	}

	/**
	 * 设置认证
	 */
	setAuth = (token: string) => {
		this.isAuthed = true;
		this.userToken = token;
	};

	/**
	 * 退出登录
	 */
	signOut = () => {
		this.isAuthed = false;
		this.userToken = null;
		navigate('/');
		this.rootStore.notify('Bye, hope you are well!', 'success');
	};

	/**
	 * 获取 API 树
	 */
	// fetchTree = async () => {
	// 	this.loading = true;
	// 	try {
	// 		const res = await Axios.post(`${API_BASE}/Tree/≽^•༚• ྀི≼ﾐ🎀・◦・ﾐ♡𝓗𝓮𝓵𝓵𝓸 𝓴𝓲𝓽𝓽𝔂`, {});
	// 		runInAction(() => {
	// 			this.tree = res.data || [];
	// 		});
	// 		return Promise.resolve(res.data);
	// 	} catch (err) {
	// 		this.rootStore.notify('Failed to load API tree', 'error');
	// 		return Promise.reject(err);
	// 	} finally {
	// 		this.loading = false;
	// 	}
	// };

	/**
	 * 获取所有 Endpoints
	 */
	fetchEndpoints = async () => {
		this.loading = true;
		try {
			const res = await Axios.get(`${API_BASE}/Search/`);
			runInAction(() => {
				this.tree = res.data.tree || [];
				this.endpoints = res.data.endpoints || [];
			});
			return Promise.resolve(res.data);
		} catch (err) {
			this.rootStore.notify('Failed to load endpoints', 'error');
			return Promise.reject(err);
		} finally {
			this.loading = false;
		}
	};

	/**
	 * 保存 Tree 节点（新增/更新）
	 */
	// saveTreeNode = async (node: any) => {
	// 	this.updating = true;
	// 	try {
	// 		const res = await Axios.put(`${API_BASE}/Tree/≽^•༚• ྀི≼ﾐ🎀・◦・ﾐ♡𝓗𝓮𝓵𝓵𝓸 𝓴𝓲𝓽𝓽𝔂`, node);
	// 		this.rootStore.notify('Tree node saved successfully', 'success');
	// 		await this.fetchTree();
	// 		return Promise.resolve(res.data);
	// 	} catch (err) {
	// 		this.rootStore.notify('Error saving Tree node', 'error');
	// 		return Promise.reject(err);
	// 	} finally {
	// 		this.updating = false;
	// 	}
	// };

	/**
	 * 删除 Tree 节点
	 */
	// deleteTreeNode = async (id: string) => {
	// 	this.deleting = true;
	// 	try {
	// 		await Axios.delete(`${API_BASE}/Tree/${id}/≽^•༚• ྀི≼ﾐ🎀・◦・ﾐ♡𝓗𝓮𝓵𝓵𝓸 𝓴𝓲𝓽𝓽𝔂`);
	// 		this.rootStore.notify('Tree node deleted successfully', 'success');
	// 		await this.fetchTree();
	// 		return Promise.resolve(true);
	// 	} catch (err) {
	// 		this.rootStore.notify('Error deleting Tree node', 'error');
	// 		return Promise.reject(err);
	// 	} finally {
	// 		this.deleting = false;
	// 	}
	// };

	/**
	 * 保存 Endpoint
	 */
	// saveEndpoint = async (endpoint: any) => {
	// 	this.creating = true;
	// 	try {
	// 		const res = await Axios.post(`${API_BASE}/EndPoint/≽^•༚• ྀི≼ﾐ🎀・◦・ﾐ♡𝓗𝓮𝓵𝓵𝓸 𝓴𝓲𝓽𝓽𝔂`, endpoint);
	// 		this.rootStore.notify('Endpoint saved successfully', 'success');
	// 		await this.fetchEndpoints();
	// 		return Promise.resolve(res.data);
	// 	} catch (err) {
	// 		this.rootStore.notify('Error saving Endpoint', 'error');
	// 		return Promise.reject(err);
	// 	} finally {
	// 		this.creating = false;
	// 	}
	// };

	/**
	 * 删除 Endpoint
	 */
	// deleteEndpoint = async (id: string) => {
	// 	this.deleting = true;
	// 	try {
	// 		await Axios.delete(`${API_BASE}/EndPoint/${id}/≽^•༚• ྀི≼ﾐ🎀・◦・ﾐ♡𝓗𝓮𝓵𝓵𝓸 𝓴𝓲𝓽𝓽𝔂`);
	// 		this.rootStore.notify('Endpoint deleted successfully', 'success');
	// 		await this.fetchEndpoints();
	// 		return Promise.resolve(true);
	// 	} catch (err) {
	// 		this.rootStore.notify('Error deleting Endpoint', 'error');
	// 		return Promise.reject(err);
	// 	} finally {
	// 		this.deleting = false;
	// 	}
	// };
}
