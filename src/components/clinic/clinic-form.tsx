// Shared PatientForm component used for both Create and Edit
import { Box, Collapse, IconButton, Popover, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Security, Delete as DeleteIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, Female, Male, Mail, PhoneAndroid, Error, HowToReg, Close, Search, Clear, PersonOff, South, Add, Check, Remove } from '@mui/icons-material';
import { ColorScheme, Gender, PAGE_SIZE, VmList } from '../../constants/options';
import VmButton from '../shared-button';
import { IsEmptyStr, IsZero, IsNumeric, IsValidEmailAddress } from '../../utilities/field-validation';
import { GetErrorInfo, GetUserProfile, Language } from '../../utilities/general';
import PatientCardLogo from '../../images/prescription/patient-card-logo.svg';
import { AUDateFormat, CNDateFormat } from '../../utilities/date';
import moment from 'moment';
import useStore from "../../hooks/use-stores";
import { FIELD_BG_WHITE } from '../../constants/style';
import VmModal from '../shared-modal';
import { VmFullScreenDialog } from '../shared-dialog';
import VmSpinner from '../shared-spinner';
import { GetFileUrl, ImageSource } from '../../utilities/file';
import AvatarPlaceholder from '../../images/template-uses/avatar-placeholder.png';

const ClinicForm = observer(({ open, title, onClose, onCloseAfterCompleted, defaultClinic, isEdit }: {
	open: boolean, title: string, onClose: () => void; onCloseAfterCompleted: (patient: any) => void; defaultClinic?: any; isEdit?: boolean;
}) => {
	const LabelWrapper = ({ children, isRequired = false }: { children: any, isRequired?: boolean; }) => {
		return (
			<Box className="flex items-center gap-1 mb-1 text-sm">
				{isRequired && <p className="text-red-500 leading-none">*</p>}
				<p>{children}</p>
			</Box>
		);
	};
	const sectionTitleStyle = "text-gray-400 text-sm mb-3";
	const [init, setInit] = useState<boolean>(true);
	const { rootStore, clinicStore, practitionerStore } = useStore();
	const [clinicName, setClinicName] = useState("");
	const [address, setAddress] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [abn, setAbn] = useState("");
	const [isErr, setIsErr] = useState<boolean>(false);
	const [openSubmitConfirm, setOpenSubmitConfirm] = useState<boolean>(false);
	const [searchKey, setSearchKey] = useState<string>("");
	const [openResult, setOpenResult] = useState<boolean>(false);
	const [practitioners, setPractitioners] = useState<any[]>([]);
	const [invitedPractitioners, setInvitedPractitioner] = useState<any[]>([]);
	const [refresh, setRefresh] = useState<any>();
	const bottomRef = useRef<any>(null);
	const userInfo: any = GetUserProfile();

	useEffect(() => {
		if (defaultClinic) {
			setClinicName(defaultClinic.name ?? "");
			setAddress(defaultClinic.address ?? "");
			setPhone(defaultClinic.phone ?? "");
			setEmail(defaultClinic.email ?? "");
			setAbn(defaultClinic.abn ?? "");
		}
	}, [defaultClinic]);

	useEffect(() => {
		if (init) setInit(false);
		else {
			if (!IsEmptyStr(searchKey)) {
				const delayDebouncer = setTimeout(() => {
					practitionerStore.searchPractitioners(0, 5, { searchTerm: searchKey }).then((res: any) => setPractitioners(res.items))
						.catch((e) => rootStore.notify(GetErrorInfo(e), 'error'));
				}, 500);
				return () => clearTimeout(delayDebouncer);
			}
		}
	}, [searchKey]);


	const handleSubmit = () => {
		setIsErr(false);
		if (IsEmptyStr(clinicName) || IsEmptyStr(address) || IsEmptyStr(phone) || IsEmptyStr(email) || IsEmptyStr(abn) || !IsValidEmailAddress(email)) {
			setIsErr(true);
			rootStore.notify(t('PLEASE_FILL_IN_ALL_REQUIRED_FIELDS'), 'warning');
			return;
		}
		const req = {
			address, phone, email, abn,
			id: defaultClinic?.id || 0,
			name: clinicName,
			lat: -33.87088,
			lng: 151.20506
		};
		setOpenSubmitConfirm(false);
		// const action = isEdit ? clinicStore. : patientStore.addPatient;
		clinicStore.addClinic(req).then((res: any) => {
			rootStore.notify(t(isEdit ? 'CLINIC_EDITED' : 'CLINIC_CREATE_REQUEST_SENT'), 'success');
			onCloseAfterCompleted(res);
		}).catch((e) => rootStore.notify(GetErrorInfo(e), 'error'));
	};

	const isErrValidName = isErr && IsEmptyStr(clinicName);
	const isErrValidAddress = isErr && IsEmptyStr(address);
	const isErrValidPhone = isErr && IsEmptyStr(phone);
	const isErrValidEmail = isErr && (IsEmptyStr(email) || !IsValidEmailAddress(email));
	const isErrValidAbn = isErr && IsEmptyStr(abn);

	const getHelperText = (err: boolean, text: string) => {
		if (err) return text;
		return "";
	};

	const highlightMatch = (text: string, query: string) => {
		if (!query) return text; // If no query, return the full text
		const parts = text.split(new RegExp(`(${query})`, "gi")); // Split text by the query (case insensitive)
		return parts.map((part, index) =>
			part.toLowerCase() === query.toLowerCase() ? (
				<span key={index} className="font-bold">
					{part}
				</span>
			) : (<span className="">{part}</span>)
		);
	};

	return (
		<VmModal minWidth="40%" open={open} onClose={onClose} title={title} enableBgOnClose={false} removeContentPadding>
			<Box className="px-4 max-h-[70vh] overflow-auto">
				<Box className="grid grid-cols-5 gap-4">
					{/* Left Column */}
					<Box className="col-span-3">
						<p className={sectionTitleStyle}>{t('CLINIC_INFO')}</p>
						<Box className="flex flex-col gap-4 mb-8">
							{/* Phone */}
							<Box>
								<LabelWrapper isRequired>{t('CLINIC_NAME')}</LabelWrapper>
								<TextField fullWidth size="small" value={clinicName} onChange={(e) => setClinicName(e.target.value)} error={isErrValidName} helperText={getHelperText(isErrValidName, t('CLINIC_NAME_IS_REQUIRED'))} />
							</Box>
							{/* Name */}
							<Box>
								<LabelWrapper isRequired>{t('ADDRESS')}</LabelWrapper>
								<TextField fullWidth size="small" value={address} onChange={(e) => setAddress(e.target.value)} error={isErrValidAddress} helperText={getHelperText(isErrValidAddress, t('ADDRESS_IS_REQUIRED'))}
									placeholder="eg. 123 Main St, Sydney, NSW 2000" />
							</Box>

							<Box>
								<LabelWrapper isRequired>{t('PHONE')}</LabelWrapper>
								<TextField fullWidth size="small" value={phone} onChange={(e) => setPhone(e.target.value)} error={isErrValidPhone} helperText={getHelperText(isErrValidPhone, t('PHONE_IS_REQUIRED'))} />
							</Box>

							<Box>
								<LabelWrapper isRequired>{t('EMAIL')}</LabelWrapper>
								<TextField fullWidth size="small" value={email} onChange={(e) => setEmail(e.target.value)} error={isErrValidEmail} helperText={getHelperText(isErrValidEmail, !IsValidEmailAddress(email) ? t('INVALID_EMAIL') : t('EMAIL_IS_REQUIRED'))} />
							</Box>

							<Box>
								<LabelWrapper isRequired>ABN</LabelWrapper>
								<TextField fullWidth size="small" value={abn} onChange={(e) => setAbn(e.target.value)} error={isErrValidAbn} helperText={getHelperText(isErrValidAbn, t('ABN_IS_REQUIRED'))} />
							</Box>
						</Box>
					</Box>
					{/* End Left Column */}
					{/* Right Column */}
					<Box className="col-span-2 flex flex-col gap-4">
						<Box>
							<LabelWrapper isRequired>{t('OWNER')}</LabelWrapper>
							<Box className="p-2 rounded-lg bg-gray-100 border">
								<Box className="flex items-center gap-1">
									<p className="font-semibold">{userInfo.firstName} {userInfo.lastName}</p>
									<span className="bg-sky-400 text-xs text-white rounded-3xl px-2">{t('ME')}</span>
								</Box>
								{/* <Box className="flex items-center gap-1 mt-1">
								<Mail fontSize="small" />
								<p className="text-sm">{IsEmptyStr(userInfo.email) ? "N/A" : userInfo.email}</p>
							</Box>
							<Box className="flex items-center gap-1 mt-1">
								<PhoneAndroid fontSize="small" />
								<p className="text-sm -mb-[1px]">{IsEmptyStr(userInfo.phone) ? "N/A" : userInfo.phone}</p>
							</Box> */}
							</Box>
						</Box>
						<Box>
							<LabelWrapper>{t('INVITE_PRACTITIONERS')}</LabelWrapper>
							<Box className="border rounded-lg">
								<Box className="px-2 pt-1">
									<TextField variant="standard" fullWidth size="small" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} onClick={() => setOpenResult(true)}
										InputProps={{
											startAdornment: (<Search sx={{ mr: .3, color: 'gray' }} />),
											endAdornment: (<IconButton sx={{ ml: .3, mr: -1.3 }} onClick={() => setSearchKey("")}><Clear /></IconButton>)
										}} />
								</Box>
								<Collapse in={openResult} unmountOnExit>
									{practitionerStore.loading ? <Box className="text-center"><VmSpinner /></Box>
										: practitioners.length == 0 ? <Box className="text-center text-gray-500 text-xsm my-4">
											<PersonOff fontSize="large" />
											<p>{t('NO_PRACTITIONER_FOUND')}</p>
										</Box> : <Box className="max-h-60 overflow-auto">
											{practitioners.map((pract: any, i: number) => (
												<button className={`flex items-center gap-2 ${pract.id == userInfo.id || invitedPractitioners.find((p: any) => p.id == pract.id) ? "" : "hover:bg-emerald-50"} w-full p-2`} disabled={pract.id == userInfo.id || invitedPractitioners.find((p: any) => p.id == pract.id)}
													onClick={() => setInvitedPractitioner([...invitedPractitioners, pract])}>
													<img src={pract.profileImageSavedName ? GetFileUrl(ImageSource.PRACTITIONER_AVATAR, pract.profileImageSavedName) : AvatarPlaceholder} className="w-8 h-8 rounded-full object-cover" />
													<Box className="text-left flex-1 flex justify-between">
														<Box>
															<p className="text-sm">{highlightMatch(`${pract.firstName} ${pract.lastName}`, searchKey)}</p>
															<Box className="flex items-center -ml-1 -mt-1">
																{pract.gender == Gender.Male ? <span className="text-sky-500"><Male fontSize="small" /></span> : <span className="text-pink-400"><Female fontSize="small" /></span>}
																<p className="text-gray-500 text-xsm -mb-1">{IsEmptyStr(pract.phone) ? "N/A" : pract.phone}</p>
															</Box>
														</Box>
													</Box>
													<Box className="text-center text-themeEmerald">
														{pract.id == userInfo.id ? <span className="bg-sky-400 px-2 text-xs text-white rounded-lg">{t('ME')}</span>
															: invitedPractitioners.find((p: any) => p.id == pract.id) ? <Tooltip title={t('INVITED')} arrow><Check fontSize="small" /></Tooltip>
																: <Tooltip title={t('INVITE')} arrow><Add fontSize="small" /></Tooltip>}
													</Box>
												</button>))}
										</Box>}
								</Collapse>
							</Box>
						</Box>
						<Box className="text-center text-gray-500 -mb-4">
							<South fontSize="small" />
						</Box>
						<Box>
							<LabelWrapper>{t('INVITED')} ({invitedPractitioners.length})</LabelWrapper>
							<Box className="border rounded-lg">
								{invitedPractitioners.length == 0 ? <Box className="text-center bg-gray-100 text-gray-500 text-xsm p-2">
									<PersonOff fontSize="large" />
									<p>{t('NO_PRACTITIONER_FOUND')}</p>
								</Box> : <Box className="flex flex-col gap-2 max-h-72 overflow-auto">
									{invitedPractitioners.map((pract: any, i: number) => (
										<button className={`flex items-center gap-2 hover:bg-red-50 w-full p-2`} onClick={() => setInvitedPractitioner(invitedPractitioners.filter((p: any) => p.id != pract.id))}>
											<img src={pract.profileImageSavedName ? GetFileUrl(ImageSource.PRACTITIONER_AVATAR, pract.profileImageSavedName) : AvatarPlaceholder} className="w-8 h-8 rounded-full object-cover" />
											<Box className="text-left flex-1 flex justify-between">
												<Box>
													<p className="text-gray-500 text-sm">{pract.firstName} {pract.lastName}</p>
													<Box className="flex items-center -ml-1 -mt-1">
														{pract.gender == Gender.Male ? <span className="text-sky-500"><Male fontSize="small" /></span> : <span className="text-pink-400"><Female fontSize="small" /></span>}
														<p className="text-xsm -mb-1">{IsEmptyStr(pract.phone) ? "N/A" : pract.phone}</p>
													</Box>
												</Box>
											</Box>
											<Box className="text-center text-red-500">
												<Tooltip title={t('REMOVE')} arrow><Remove fontSize="small" /></Tooltip>
											</Box>
										</button>
									))}
								</Box>}
							</Box>
						</Box>
					</Box>
					{/* End Right Column */}
				</Box>

			</Box>
			{/* Action buttons */}
			<Box className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 px-4">
				<VmButton variant="outlined" colorScheme={ColorScheme.DARK} onClick={onClose} className="px-8 rounded-lg">{t('CANCEL')}</VmButton>
				<VmButton colorScheme={ColorScheme.DARK} className="px-8 rounded-lg" onClick={() => setOpenSubmitConfirm(true)} loading={clinicStore.creating || clinicStore.updating}>{t('SUBMIT_CLINIC_INFO')}</VmButton>
			</Box>

			<VmModal open={openSubmitConfirm} onClose={() => setOpenSubmitConfirm(false)} title={t('SUBMIT_CONFIRM')} removeContentPadding>
				<Box className="p-4 pt-0 text-center">
					<Box className="text-5xl"><HowToReg fontSize="inherit" /></Box>
					<p>{t('ARE_YOU_SURE_TO_SUBMIT_YOUR_CLINIC_INFO')}?</p>
					<p>{t('PLS_NOTE_THIS_CLINIC_INFO_WILL_BE_SUBMITTED_FOR_APPROVAL')}</p>
					<p className="mt-2 text-xsm text-red-500">{t('YOU_WILL_BE_NOTIFIED_WHEN_APPROVAL_IS_DONE')}</p>
				</Box>
				<Box className="flex justify-end gap-2 pt-4 border-t border-gray-200 px-4">
					<VmButton variant="outlined" colorScheme={ColorScheme.DARK} onClick={() => setOpenSubmitConfirm(false)} className="px-8 rounded-lg">{t('CANCEL')}</VmButton>
					<VmButton colorScheme={ColorScheme.DARK} className="px-8 rounded-lg" onClick={handleSubmit}>{t('CONFIRM')}</VmButton>
				</Box>
			</VmModal>
		</VmModal>
	);
});

export default ClinicForm;
