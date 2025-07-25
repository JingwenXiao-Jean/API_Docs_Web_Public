import React, { useState } from 'react';
import { Collapse, Fade, ListItemIcon, MenuItem, Popover, Tooltip, useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import { navigate } from 'gatsby';
import Menu from '@mui/material/Menu';
import useStores from '../hooks/use-stores';
import { observer } from 'mobx-react';
import { useEffect } from 'react';
import { isWeb } from '../utilities/platform';
import { IsEmptyStr, IsZero } from '../utilities/field-validation';
import { GetUserProfile, IsLocked, ProtectedUrls } from '../utilities/general';
import RouteGuard from './root/route-guard';
import LogoutIcon from '@mui/icons-material/Logout';
import { CheckCircle, ChevronRight, EastOutlined, Error, KeyboardArrowRight, LocalHospital, Lock, LockPerson, NorthOutlined, WestOutlined, EventNote, EventNoteOutlined } from '@mui/icons-material';
import Logo from '../images/logo.svg';
import Profile from '../images/nav/profile.svg';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import PatientActived from '../images/nav/patient-actived.svg';
import Appointment from '../images/nav/appointment.svg';
import AppointmentActived from '../images/nav/appointment-actived.svg';
import Account from '../images/nav/account.svg';
import Setting from '../images/nav/setting.svg';
import SettingActived from '../images/nav/setting-actived.svg';
import Clinic from '../images/nav/clinic.svg';
import ClinicActived from '../images/nav/clinic-actived.svg';
import Bell from '../images/nav/bell.svg';
import { SetLocalStorage } from '../utilities/cryptography';
import { USER_INFO } from '../constants/storage-keys';
import TranslationButton from './shared-translation-button';
import { useTranslation } from 'react-i18next';
import { VmFullScreenDialog } from './shared-dialog';
import VmModal from './shared-modal';
import { t } from 'i18next';


const Layout = observer(({ children, onSearch, hideAdminUI = false, breadCrumb, bg = "bg-gray-100" }: { children: any, hideAdminUI?: boolean, onSearch?: (key: string) => void, breadCrumb?: { url: string, label: string; }[], bg?: string; }) => {
	const { userStore, rootStore } = useStores();
	const [searchTerm, setSearchTerm] = useState<string>("");
	const [init, setInit] = useState<boolean>(true);
	const [openNavDrawer, setOpenNavDrawer] = useState<boolean>(isWeb && localStorage.DRAWER ? JSON.parse(localStorage.DRAWER) : true);
	// lang menu
	const [langMenuAnchorEl, setLangMenuAnchorEl] = useState<null | HTMLElement>(null);
	const [openLangMenu, setOpenLangMenu] = useState<boolean>(false);
	// go top button
	const [isReachedTop, setIsReachedTop] = useState<boolean>(isWeb ? window.pageYOffset == 0 : false);
	// when user signed in
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [openAuthedUserMenu, setAuthedUserMenu] = useState<boolean>(false);
	const [clinicAnchor, setClinicAnchor] = useState<any>();
	const [userAnchor, setUserAnchor] = useState<any>();
	const [showGoTopButton, setShowGoTopButton] = useState<boolean>(isWeb ? window.pageYOffset !== 0 : false);
	const [openProtectedWarning, setOpenProtectedWarning] = useState<boolean>(false);
	const { t, i18n } = useTranslation();
	const userInfo: any = GetUserProfile();

	if (!isWeb) return <></>;

	useEffect(() => {
		if (init) {
			// if (IsLocked() && !localStorage.LOCKED_WARNING) {
			// 	setTimeout(() => setOpenProtectedWarning(true), 500);
			// 	localStorage.LOCKED_WARNING = true;
			// }
			// // userStore.getVersion();
			// if (IsLocked() && ProtectedUrls.find((url: string) => location.pathname.includes(url))) {
			// 	navigate("/clinic");
			// 	rootStore.notify(t('PROTECTED_PAGE_WARNING'), 'warning');
			// }
			setInit(false);
		} else {

			const refreshToken = setInterval(() => {
				// userStore.refreshToken();
			}, 1000 * 60 * 3);
			return () => {
			};
		}
		// if (isWeb && localStorage.DRAWER) onChangeDrawer(JSON.parse(localStorage.DRAWER));
	}, [init]);

	// Page scroll listener
	useEffect(() => {
		window.onscroll = () => {
			setIsReachedTop(window.pageYOffset == 0);
		};
	});

	useEffect(() => {
		window.onscroll = () => setShowGoTopButton(window.pageYOffset !== 0);
	});

	const theme = useTheme();

	const onCloseUserMenu = () => {
		setAuthedUserMenu(false);
		setMenuAnchor(null);
	};

	const onChangeDrawer = (expand: boolean) => {
		setOpenNavDrawer(expand);
		localStorage.DRAWER = JSON.stringify(expand);
	};

	const isActivedLink = (path: string) => {
		return isWeb && (location.pathname.includes(path) || location.href.includes(path));
	};

	const onClickSearch = () => {
		if (onSearch) onSearch(searchTerm);
	};

	const onToggleClinic = (clinicId: number) => {
		let info = { ...GetUserProfile(), currentClinicId: clinicId };
		SetLocalStorage(USER_INFO, info);
		let target = GetUserProfile().availableClinics.find((c: any) => c.id == clinicId);
		rootStore.notify(t('CLINIC_SWITCHED_TO_X', { X: target?.name }), 'success');
		setClinicAnchor(null);
		navigate("/prescription");
		setTimeout(() => window.location.reload(), 100);
	};

	const navigateToProtectedPage = (path: string) => {
		if (IsLocked()) setOpenProtectedWarning(true);
		else navigate(path);
	};


	return (
		<RouteGuard>
			<Box className={bg ?? "bg-gray-100"}>
				<Collapse in={hideAdminUI} unmountOnExit>{children}</Collapse>
				<Collapse in={!hideAdminUI} unmountOnExit>
					<Box className="flex">
						<Box className={`${openNavDrawer ? "w-72" : "w-20"} bg-white border-r sticky top-0 h-screen transition-all duration-300 ease-in-out flex flex-col justify-between z-50`} sx={{ boxShadow: "1px 0px 3px 0px #e4e4e4" }}>
							<Box>
								<Box className={`pt-4 flex items-center gap-2 ${openNavDrawer ? " px-6" : "justify-center px-4"}`}>
									<img src={Logo} className={`${openNavDrawer ? "h-10" : "h-12"} transition-all duration-300 ease-in-out object-contain`} />
									{openNavDrawer && <Box className="-mb-1">
										<p className="text-xl font-semibold -mb-1 whitespace-nowrap">V·AI</p>
										<p className="text-xsm text-gray-400 whitespace-nowrap">Clinic Member Portal</p>
									</Box>}
								</Box>
								<Box className={`p-2 mt-4 flex flex-col gap-2`}>
									{/* <NavItem actived={isActivedLink("/clinic")} onClick={() => navigate("/clinic")} openNav={openNavDrawer} activedIcon={ClinicActived} nonActivedIcon={Clinic} isAlert={IsZero(userInfo?.availableClinics?.length ?? 0)}
									>{t('CLINIC_MANAGEMENT')}</NavItem> */}
									<NavItem
										actived={isActivedLink("/profile")}
										onClick={() => userInfo.isPublished == true ? navigate(`/profile/select-template?templateId=${GetUserProfile().templateId}&isPreview=true`) : navigate("/profile")}
										openNav={openNavDrawer}
										activedIcon={AssignmentIndIcon}
										nonActivedIcon={AssignmentIndOutlinedIcon}>
										{t('PATIENT_PROFILE')}
									</NavItem>
									<NavItem
										actived={isActivedLink("/appointment")}
										onClick={() => navigate("/appointment")}
										openNav={openNavDrawer}
										activedIcon={EventNote}
										nonActivedIcon={EventNoteOutlined}>
										{t('APPOINTMENT_HISTORY')}
									</NavItem>
									{/* {!IsLocked() && <>
										<NavItem actived={isActivedLink("/prescription")} onClick={() => navigateToProtectedPage("/prescription")} openNav={openNavDrawer} activedIcon={PatientActived} nonActivedIcon={Patient}>{t('PRESCRIPTION')}</NavItem>
										<NavItem actived={isActivedLink("/appointment")} onClick={() => navigateToProtectedPage("/appointment")} openNav={openNavDrawer} activedIcon={AppointmentActived} nonActivedIcon={Appointment}>{t('APPOINTMENT')}</NavItem>
									</>} */}
								</Box>
							</Box>
							<Box className={`p-2 flex flex-col gap-6 ${openNavDrawer ? "" : "text-center"}`}>
								{/* {!IsLocked() && <>
									<NavItem
										actived={isActivedLink("/configuration")}
										onClick={() => navigate("/configuration")}
										openNav={openNavDrawer}
										activedIcon={SettingActived}
										nonActivedIcon={Setting}>
										{t('CONFIGURATION')}
									</NavItem>
								</>} */}
								<button className="w-fit bg-gray-100 px-4 py-2 rounded-full" onClick={() => onChangeDrawer(!openNavDrawer)}>
									{!openNavDrawer ? <EastOutlined /> : <WestOutlined />}
								</button>
							</Box>
						</Box>
						<Box className="flex-1">
							<Box className="w-full flex items-center justify-between border-b px-4 py-2 sticky top-0 left-0 z-[100] bg-white" sx={{ boxShadow: "0px 1px 3px #e4e4e4" }}>
								<Box>
									{userInfo.username ? (
										<p className="font-bold text-xl text-gray-600">{t('WELCOME_BACK')}! {userInfo.username}</p>
									) : (
										<p className="font-bold text-xl text-gray-600">{t('WELCOME')}!</p>
									)}
									{/* <button className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100" onClick={(e) => setUserAnchor(e.currentTarget)}>
										<img src={Bell} className="h-6 object-contain" />
										<p className="bg-red-500 text-white rounded-full text-xs px-2">8</p>
									</button> */}
									{/* <button className={`pl-2 pr-4 py-2 rounded-lg ${!IsZero(userInfo.currentClinicId) ? "hover:bg-gray-100" : ""} flex items-center gap-1 -mr-4 text-left`} disabled={IsZero(userInfo.currentClinicId)} onClick={(e) => setClinicAnchor(e.currentTarget)}>
										<span className="text-themeEmerald"><LocalHospital fontSize="large" /></span>
										<Box>
											<p className="text-xs text-gray-400">{t('CLINIC')}</p>
											<p className="text-sm font-semibold text-gray-700 text-left">{!IsZero(userInfo.currentClinicId) ? userInfo.availableClinics?.find((c: any) => c.id == userInfo.currentClinicId)?.name : t('NO_CLINIC_SELECTED')}</p>
										</Box>
									</button> */}
								</Box>
								<Box className="flex items-center gap-2">
									<button className="flex items-center gap-1 p-2 rounded-lg hover:bg-gray-100" onClick={(e) => setUserAnchor(e.currentTarget)}>
										<img src={Bell} className="h-6 object-contain" />
										<p className="bg-red-500 text-white rounded-full text-xs px-2">8</p>
									</button>
									<Box className="w-[1px] h-6 bg-gray-200" />
									<TranslationButton />
									<Box className="w-[1px] h-6 bg-gray-200" />
									<button className="flex items-center gap-2 pl-4 pr-2 py-2 rounded-lg hover:bg-gray-100" onClick={(e) => setUserAnchor(e.currentTarget)}>
										<img src={Account} className="h-6 object-contain" />
										{/* <p className="text-[.9rem]">{userInfo.firstNameEn} {userInfo.lastNameEn}</p> */}
										<p className="text-[.9rem]">{userInfo.username}</p>
										<span className="text-gray-300"><KeyboardArrowRight /></span>
									</button>
								</Box>
							</Box>
							{breadCrumb && <Box className="flex items-center gap-2 p-4 pb-0 mb-2 text-gray-500">
								{breadCrumb?.map((bread: any, i: number) => (<>
									{!IsZero(i) && <ChevronRight sx={{ mt: "-2px" }} />}
									<button className={`text-sm text-gray-700 ${i == breadCrumb.length - 1 ? "font-semibold" : ""} ${i == breadCrumb.length - 1 || IsEmptyStr(bread.url) ? "" : "hover:underline"}`}
										disabled={i == breadCrumb.length - 1 || IsEmptyStr(bread.url)} onClick={() => navigate(bread.url)}>
										{bread.label}
									</button>
								</>))}
							</Box>}
							<Box>{children}</Box>
						</Box>
					</Box>
				</Collapse>
			</Box>

			{/* Auth User Menu */}
			<Popover
				anchorEl={clinicAnchor}
				open={Boolean(clinicAnchor)}
				onClose={() => setClinicAnchor(null)}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						borderRadius: 2,
						boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
						border: "1px solid #e0e0e0",
						padding: "5px",
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
			>
				<p className="text-gray-500 p-1 text-sm">{t('SELECT_CLINIC_TO_WORK')}:</p>
				{GetUserProfile().availableClinics?.map((clinic: any, i: number) => (
					<button key={`clinic_select_${i}`} onClick={() => onToggleClinic(clinic.id)} className={`${GetUserProfile().currentClinicId == clinic.id ? "bg-gray-100" : ""} flex items-center justify-between text-gray-700 gap-1 p-1 hover:bg-gray-100 w-full text-left`}
						disabled={GetUserProfile().currentClinicId == clinic.id}>
						<Box className="flex items-center gap-1">
							<LocalHospital />
							<p>{i + 1}. {clinic.name}</p>
						</Box>
						{GetUserProfile().currentClinicId == clinic.id && <span className="text-themeEmerald"><CheckCircle /></span>}
					</button>
				))}
			</Popover>
			{/* End Auth User Menu */}
			{/* Auth User Menu */}
			<Menu
				anchorEl={userAnchor}
				open={Boolean(userAnchor)}
				onClose={() => setUserAnchor(null)}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: 'visible',
						borderRadius: 2,
						boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
						border: "1px solid #e0e0e0",
						padding: "5px",
						mt: 1,
						'& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, },
						'&:before': {
							content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, border: "1px solid #e0e0e0", borderBottomWidth: 0, borderRightWidth: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
			>
				<MenuItem onClick={() => userStore.signOut()}>
					<ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
					{t('SIGN_OUT')}
				</MenuItem>
			</Menu>
			{/* End Auth User Menu */}
			<VmModal open={openProtectedWarning} onClose={() => setOpenProtectedWarning(false)} title={t('PROTECTED_PAGE')}>
				<Box className="text-center">
					<span className="text-5xl"><LockPerson fontSize="inherit" /></span>
					<p className="mt-4 font-semibold">{t('PROTECTED_PAGE_WARNING')}</p>
					<p className="text-sm">{t('U_NEED_TO_BELONG_TO_A_CLINIC_IN_ORDER_TO_USE_THIS_SERVICE')}</p>
				</Box>
			</VmModal>

			<Fade in={showGoTopButton}>
				<Box className="fixed bottom-0 right-0 m-4 text-center z-[9999]">
					<button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
						style={{ boxShadow: "0 0 4px #b2b2b2" }}
						className="p-3 text-gray-600 transition-all rounded-full bg-white justify-between z-50">
						<NorthOutlined />
					</button>
				</Box>
			</Fade>
		</RouteGuard>
	);
});

const NavItem = observer(({ openNav, actived, children, activedIcon: ActivedIcon, nonActivedIcon: NonActivedIcon, onClick, className, isAlert }: { openNav: boolean, actived: boolean, activedIcon?: any, nonActivedIcon?: any, isChild?: boolean, children: any, className?: string, onClick?: (e: any) => any, disableBg?: boolean, isAlert?: boolean; }) => {
	return (
		<button className={`w-full flex items-center p-4 ${actived ? "text-white" : "text-gray-400"} ${openNav ? "rounded-md" : "justify-center rounded-xl"} relative ${className}`} onClick={onClick}
			style={{ background: actived ? "linear-gradient(40deg, rgba(60,160,33,1) 0%, rgba(60,160,33,0.70) 100%)" : "" }}>
			{/* {actived ? <img src={activedIcon} className={`object-contain ${openNav ? "h-6" : "h-7"}`} /> : <img src={nonActivedIcon} className={`object-contain ${openNav ? "h-6" : "h-7"}`} />} */}
			{actived
				? <ActivedIcon className={openNav ? "h-6" : "h-7"} />
				: <NonActivedIcon className={openNav ? "h-6" : "h-7"} />}

			{openNav ? <Box className="flex items-center w-full justify-between gap-1 text-left ml-2 text-[.9rem] mt-[1px] whitespace-nowrap overflow-hidden text-ellipsis transition-all duration-300">
				<p className="">{children}</p>
				{isAlert && <Tooltip title={t('IMPORTANT')} arrow><span className="text-red-400"><Error /></span></Tooltip>}
			</Box> : isAlert && <Box className="absolute top-0 right-0 m-1">
				<Tooltip title={t('IMPORTANT')} arrow>
					<span className="text-red-400"><Error fontSize="small" /></span>
				</Tooltip>
			</Box>}
		</button>
	);
});

export default Layout;