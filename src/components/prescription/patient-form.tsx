// Shared PatientForm component used for both Create and Edit
import { Box, Collapse, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { t } from 'i18next';
import { observer } from 'mobx-react';
import { Security, Delete as DeleteIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, Female, Male } from '@mui/icons-material';
import { ColorScheme, Gender, VmList } from '../../constants/options';
import VmButton from '../../components/shared-button';
import { IsEmptyStr, IsZero, IsNumeric, IsValidEmailAddress } from '../../utilities/field-validation';
import { GetErrorInfo, GetUserProfile, Language } from '../../utilities/general';
import PatientCardLogo from '../../images/prescription/patient-card-logo.svg';
import { AUDateFormat, CNDateFormat } from '../../utilities/date';
import moment from 'moment';
import useStore from "../../hooks/use-stores";
import { FIELD_BG_WHITE } from '../../constants/style';

const PatientForm = observer(({ onClose, onCloseAfterCompleted, defaultPatient, isEdit }: {
	onClose: () => void; onCloseAfterCompleted: (patient: any) => void; defaultPatient?: any; isEdit?: boolean;
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

	const { rootStore, patientStore } = useStore();
	const [firstNameEn, setFirstNameEn] = useState("");
	const [lastNameEn, setLastNameEn] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [dob, setDob] = useState<string>("");
	const [address, setAddress] = useState("");
	const [gender, setGender] = useState(0);
	const [insuranceGroups, setInsuranceGroups] = useState([{ insuranceNo: "", companyName: "", expiryDate: moment().add(6, 'months').format(CNDateFormat) }]);
	const [emergencyContacts, setEmergencyContacts] = useState([{ firstName: "", lastName: "", phone: "", relationship: "" }]);
	const [guardianName, setGuardianName] = useState<string>("");
	const [guardianMobile, setGuardianMobile] = useState<string>("");
	const [referredBy, setReferredBy] = useState<string>("");
	const [validationErrors, setValidationErrors] = useState<{ [key: string]: string; }>({});
	const anchorRef = useRef<any>(null);
	const bottomRef = useRef<any>(null);
	const [refresh, setRefresh] = useState<any>();
	const [showMoreDetails, setShowMoreDetails] = useState(false);


	useEffect(() => {
		if (defaultPatient) {
			setFirstNameEn(defaultPatient.firstName ?? defaultPatient.firstNameEn ?? "");
			setLastNameEn(defaultPatient.lastName ?? defaultPatient.lastNameEn ?? "");
			setEmail(defaultPatient.email || "");
			setPhone(defaultPatient.phone || "");
			setDob(defaultPatient.dob ? moment(defaultPatient.dob).format(CNDateFormat) : "");
			setAddress(defaultPatient.address || "");
			setGender(defaultPatient.gender || 0);
			setInsuranceGroups(defaultPatient.insurances?.map((ins: any) => ({
				insuranceNo: ins.insuranceNo,
				companyName: ins.companyName,
				expiryDate: moment(ins.expiredDate).format(CNDateFormat),
			})) || [{ insuranceNo: "", companyName: "", expiryDate: moment().format(CNDateFormat) }]);
			// setEmergencyContacts(defaultPatient.emergencyContacts?.map((contact: any) => ({
			// 	firstName: contact.firstName,
			// 	lastName: contact.lastName,
			// 	phone: contact.phone,
			// 	relationship: contact.relationship,
			// })) || [{ firstName: "", lastName: "", phone: "", relationship: "" }]);
			setEmergencyContacts(defaultPatient.emergencyContacts?.length > 0
				? defaultPatient.emergencyContacts?.map((contact: any) => ({
					firstName: contact.firstName,
					lastName: contact.lastName,
					phone: contact.phone,
					relationship: contact.relationship,
				}))
				: [{ firstName: "", lastName: "", phone: "", relationship: "" }]
			);
			setGuardianMobile(defaultPatient.guardianMobile);
			setReferredBy(defaultPatient.referredBy);
			setGuardianName(defaultPatient.guardianName);
			if (defaultPatient.emergencyContacts?.length > 0 ||
				!IsEmptyStr(defaultPatient.guardianMobile) ||
				!IsEmptyStr(defaultPatient.referredBy) ||
				!IsEmptyStr(defaultPatient.guardianName)) setShowMoreDetails(true);
			else setShowMoreDetails(false);
		}
	}, [defaultPatient]);

	const handleEmergencyContactChange = (field: "firstName" | "lastName" | "relationship" | "phone", value: string) => {
		emergencyContacts[0][field] = value;
		setRefresh([]);
	};

	const onChangeInsuranceInfo = (field: "insuranceNo" | "companyName" | "expiryDate", value: string, index: number) => {
		if (field === "insuranceNo") {
			insuranceGroups[index].insuranceNo = value;
			setValidationErrors((prev) => ({
				...prev,
				[`insurance_insuranceNo_${index}`]: getErrorText(value, 'INSURANCE_NUMBER')
			}));

		} else if (field === "companyName") {
			insuranceGroups[index].companyName = value;
			setValidationErrors((prev) => ({
				...prev,
				[`insurance_companyName_${index}`]: getErrorText(value, 'COMPANY_NAME')
			}));
		}
		else if (field === "expiryDate") {
			insuranceGroups[index].expiryDate = value;
			setValidationErrors((prev) => ({
				...prev,
				[`insurance_expiryDate_${index}`]: getErrorText(value, 'EXPIRY_DATE')
			}));
		}

	};

	const onChangeInsuranceList = (action: "add" | "remove", index: number = 0) => {
		if (action == "add") {
			setInsuranceGroups([...insuranceGroups, { insuranceNo: "", companyName: "", expiryDate: moment().add(6, 'months').format(CNDateFormat) }]);
			setTimeout(() => {
				bottomRef.current.scrollIntoView({ behavior: "smooth" });
			}, 200);
		} else setInsuranceGroups(insuranceGroups.filter((item: any, i: number) => i != index));
	};

	const toggleShowMoreDetails = () => {
		// if (!showMoreDetails) setShowMoreDetails(!showMoreDetails);
		// setTimeout(() => {
		// 	anchorRef.current.scrollIntoView({ behavior: "smooth" });
		// }, 200);
		if (!showMoreDetails) {
			setTimeout(() => {
				anchorRef.current.scrollIntoView({ behavior: "smooth" });
			}, 200);
		}
		setShowMoreDetails(!showMoreDetails);
	};

	// Check input errors
	const getErrorText = (value: string | undefined, label: string) => {
		return !value?.trim() ? t(`${label}_IS_REQUIRED`) : '';
	};

	// Update and validate at the same time
	const handleFieldChange = (field: string, value: string) => {
		if (field === 'firstNameEn') {
			setFirstNameEn(value);
			setValidationErrors((prev) => ({
				...prev,
				[field]: !value?.trim() ? t(`${field.toUpperCase()}_IS_REQUIRED`) : "",
			}));
		}

		if (field === 'lastNameEn') {
			setLastNameEn(value);
			setValidationErrors((prev) => ({
				...prev,
				[field]: !value?.trim() ? t(`${field.toUpperCase()}_IS_REQUIRED`) : "",
			}));
		}

		if (field === 'dob') {
			setDob(value);
			setValidationErrors((prev) => ({
				...prev,
				[field]: !value?.trim() ? t(`${field.toUpperCase()}_IS_REQUIRED`) : "",
			}));
		}

		if (field === 'address') {
			setAddress(value);
			setValidationErrors((prev) => ({
				...prev,
				[field]: !value?.trim() ? t(`${field.toUpperCase()}_IS_REQUIRED`) : "",
			}));
		}

		if (field === 'phone') {
			setPhone(value);
			const cleanedValue = value.replace(/\s/g, '');
			setValidationErrors((prev) => ({
				...prev,
				phone: !cleanedValue
					? t('PHONE_IS_REQUIRED')
					: !IsNumeric(cleanedValue)
						? t('INVALID_PHONE_NUMBER')
						: "",
			}));
		}

		if (field === 'email') {
			setEmail(value);
			setValidationErrors((prev) => ({
				...prev,
				email: !value?.trim()
					? t('EMAIL_IS_REQUIRED')
					: !IsValidEmailAddress(value)
						? t('INVALID_EMAIL')
						: "",
			}));
		}
	};

	const validateForm = () => {
		const errors: any = {};
		if (!firstNameEn?.trim()) errors.firstNameEn = t('FIRST_NAME_IS_REQUIRED');
		if (!lastNameEn?.trim()) errors.lastNameEn = t('LAST_NAME_IS_REQUIRED');
		if (!phone?.trim()) errors.phone = t('PHONE_IS_REQUIRED');
		else if (!IsNumeric(phone)) errors.phone = t('INVALID_PHONE_NUMBER');
		if (!email?.trim()) errors.email = t('EMAIL_IS_REQUIRED');
		else if (!IsValidEmailAddress(email)) errors.email = t('INVALID_EMAIL');
		if (!dob) errors.dob = t('DATE_OF_BIRTH_IS_REQUIRED');
		if (!address?.trim()) errors.address = t('ADDRESS_IS_REQUIRED');
		insuranceGroups.map((ins, index) => {
			if (!ins.companyName?.trim()) errors[`insurance_companyName_${index}`] = t('COMPANY_NAME_IS_REQUIRED');
			if (!ins.insuranceNo?.trim()) errors[`insurance_insuranceNo_${index}`] = t('INSURANCE_NUMBER_IS_REQUIRED');
			// else if (!IsNumeric(ins.insuranceNo)) errors[`insurance_insuranceNo_${index}`] = t('INVALID_INSURANCE_NUMBER');
			if (!ins.expiryDate?.trim()) errors[`insurance_expiryDate_${index}`] = t('EXPIRY_DATE_IS_REQUIRED');
		});
		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = () => {
		if (!validateForm()) {
			rootStore.notify(t('PLEASE_FIX_ERRORS'), 'error');
			return;
		}
		const req = {
			id: defaultPatient?.id || 0,
			firstNameEn, lastNameEn, email, phone, dob, address, gender,
			guardianName, guardianMobile, referredBy,
			clinicId: GetUserProfile().currentClinicId,
			insurances: insuranceGroups,
			emergencyContacts,
		};
		const action = isEdit ? patientStore.updatePatient : patientStore.addPatient;
		action(req).then((res: any) => {
			rootStore.notify(t(isEdit ? 'PATIENT_EDITED' : 'PATIENT_CREATED'), 'success');
			onCloseAfterCompleted(res);
		}).catch((e) => rootStore.notify(GetErrorInfo(e), 'error'));
	};

	return (
		<>
			<Box className="p-4 pt-0 max-h-[70vh] overflow-auto">
				<Box className="grid grid-cols-5 gap-4">
					{/* Left Column */}
					<Box className="col-span-3">
						<p className={sectionTitleStyle}>{t('BASIC_INFO')}</p>
						<Box className="flex flex-col gap-4 mb-8">
							{/* Title */}
							{/* <Box>
              <LabelWrapper isRequired>{t('TITLE')}</LabelWrapper>
              <TextField
                select
                fullWidth
                onChange={(e) => setSelectedTitle(e.target.value)}
                size="small"
                value={selectedTitle}
              >
                {titles.map((title: string) => (
                  <MenuItem key={`${title}_select`} value={title}>{title}</MenuItem>
                ))}
              </TextField>
            </Box> */}

							{/* Name */}
							<Box className="grid grid-cols-2 gap-2">
								<Box>
									<LabelWrapper isRequired>{t('FIRST_NAME')}</LabelWrapper>
									<TextField fullWidth size="small" value={firstNameEn} onChange={(e) => handleFieldChange("firstNameEn", e.target.value)} error={!!validationErrors.firstNameEn} helperText={validationErrors.firstNameEn} />
								</Box>

								<Box>
									<LabelWrapper isRequired>{t('LAST_NAME')}</LabelWrapper>
									<TextField fullWidth size="small" value={lastNameEn} onChange={(e) => handleFieldChange("lastNameEn", e.target.value)} error={!!validationErrors.lastNameEn} helperText={validationErrors.lastNameEn} />
								</Box>
							</Box>

							{/* Date of Birth */}
							<Box>
								<LabelWrapper isRequired>{t('DATE_OF_BIRTH')}</LabelWrapper>
								<TextField fullWidth size="small" type="date" value={dob} onChange={(e) => handleFieldChange("dob", e.target.value)} InputLabelProps={{ shrink: true }}
									inputProps={{ max: moment().format(CNDateFormat) }} error={!!validationErrors.dob} helperText={validationErrors.dob} />
							</Box>

							{/* Gender */}
							<Box>
								<LabelWrapper isRequired>{t('GENDER')}</LabelWrapper>
								<Box className="grid grid-cols-2 gap-2">
									<button className={`flex items-center justify-center gap-2 border w-full py-2 rounded-lg ${gender == Gender.Male ? "bg-gray-800 border-gray-800 text-white" : "border-gray-300"} transition`}
										onClick={() => setGender(Gender.Male)}>
										<Male />
										<p>{t('MALE')}</p>
									</button>
									<button className={`flex items-center justify-center gap-2 border w-full py-2 rounded-lg ${gender == Gender.Female ? "bg-gray-800 border-gray-800 text-white" : "border-gray-300"} transition`}
										onClick={() => setGender(Gender.Female)}>
										<Female />
										<p>{t('FEMALE')}</p>
									</button>
								</Box>
							</Box>
						</Box>

						<p className={sectionTitleStyle}>{t('CONTACT_DETAIL')}</p>
						<Box className="flex flex-col gap-3">
							{/* Phone */}
							<Box>
								<LabelWrapper isRequired>{t('PHONE')}</LabelWrapper>
								<TextField fullWidth size="small" value={phone} onChange={(e) => handleFieldChange("phone", e.target.value)} error={!!validationErrors.phone} helperText={validationErrors.phone} />
							</Box>

							<Box>
								<LabelWrapper isRequired>{t('EMAIL')}</LabelWrapper>
								<TextField fullWidth size="small" value={email} onChange={(e) => handleFieldChange("email", e.target.value)} error={!!validationErrors.email} helperText={validationErrors.email} />
							</Box>

							<Box>
								<LabelWrapper isRequired>{t('RESIDENTIAL_ADDRESS')}</LabelWrapper>
								<TextField fullWidth size="small" value={address} onChange={(e) => handleFieldChange("address", e.target.value)} error={!!validationErrors.address} helperText={validationErrors.address} />
							</Box>
						</Box>
						<Box className="flex items-center justify-end mt-2 mb-6">
							<button
								className="text-sm text-themeEmerald cursor-pointer flex items-center gap-1 hover:underline"
								onClick={toggleShowMoreDetails}
							>
								{showMoreDetails ? t('LESS_DETAILS') : t('MORE_DETAILS')}
								{showMoreDetails ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
							</button>
						</Box>
						<Collapse in={showMoreDetails}>
							<Box className="border-t border-t-gray-200 pt-4">
								<p ref={anchorRef} className={sectionTitleStyle}>{t('EMERGENCY_CONTACT_DETAIL')}</p>
								<Box className="flex flex-col gap-4 mb-6">
									{/* Emergency Contact */}
									<Box className="grid grid-cols-2 gap-4">
										<Box>
											<LabelWrapper>{t('FIRST_NAME')}</LabelWrapper>
											<TextField fullWidth size="small" value={emergencyContacts[0]?.firstName || ""} onChange={(e) => handleEmergencyContactChange('firstName', e.target.value)} />
										</Box>
										<Box>
											<LabelWrapper>{t('LAST_NAME')}</LabelWrapper>
											<TextField fullWidth size="small" value={emergencyContacts[0]?.lastName || ""} onChange={(e) => handleEmergencyContactChange("lastName", e.target.value)} />
										</Box>
									</Box>

									<Box>
										<LabelWrapper>{t('RELATIONSHIP')}</LabelWrapper>
										<TextField fullWidth size="small" value={emergencyContacts[0]?.relationship || ""} onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)} />
									</Box>

									<Box>
										<LabelWrapper>{t('PHONE')}</LabelWrapper>
										<TextField fullWidth size="small" value={emergencyContacts[0]?.phone || ""} onChange={(e) => handleEmergencyContactChange("phone", e.target.value)} />
									</Box>
								</Box>

								<p className={sectionTitleStyle}>{t('PATIENT_DISCLOSE')}</p>
								<Box className="flex flex-col gap-4">
									{/* Patient Disclose */}
									<Box className="grid grid-cols-2 gap-4">
										<Box>
											<LabelWrapper>{t('GUARDIAN_NAME')}</LabelWrapper>
											<TextField fullWidth size="small" value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
										</Box>
										<Box>
											<LabelWrapper>{t('GUARDIAN_MOBILE')}</LabelWrapper>
											<TextField fullWidth size="small" value={guardianMobile} onChange={(e) => setGuardianMobile(e.target.value)}
											/>
										</Box>
									</Box>
									<Box>
										<LabelWrapper> {t('REFERRED_BY')}</LabelWrapper>
										<TextField fullWidth size="small" value={referredBy} onChange={(e) => setReferredBy(e.target.value)} />
									</Box>
								</Box>
							</Box>
						</Collapse>
					</Box>
					{/* End Left Column */}
					{/* Right Column */}
					<Box className="col-span-2">
						<p className={sectionTitleStyle}>{t('INSURANCE_INFO')}</p>
						<Box className="flex flex-col gap-4">
							{insuranceGroups.map((insurance: any, index: number) => (
								<Box key={`insurance_${index}`} className="p-4 rounded-md" sx={{ background: "linear-gradient(180deg, rgba(250,213,95,1) 0%, rgba(247,183,79,1) 45%)" }}>
									<Box className="flex items-center justify-between mb-4">
										<Box className="flex items-center font-semibold">
											<Security />
											<p className="text-sm ml-2">{t('INSURANCE_X', { X: index + 1 })}</p>
											{index === 0 && <span className="text-red-500 ml-1">*</span>}
										</Box>
										{insuranceGroups.length > 1 && <Box>
											<button className="pl-3 pr-4 py-1 rounded text-red-400 border-2 border-red-400 transition-all flex items-center"
												onClick={() => onChangeInsuranceList("remove", index)}>
												<DeleteIcon fontSize="small" />
												<p className="text-xsm ml-1">{t('REMOVE')}</p>
											</button>
										</Box>}
									</Box>
									<Box className="flex flex-col gap-4">
										<Box>
											<LabelWrapper>{t('COMPANY_NAME')}</LabelWrapper>
											<TextField fullWidth size="small" value={insurance.companyName} onChange={(e) => onChangeInsuranceInfo("companyName", e.target.value, index)} sx={FIELD_BG_WHITE} error={!!validationErrors[`insurance_companyName_${index}`]} helperText={validationErrors[`insurance_companyName_${index}`]} />
										</Box>

										<Box>
											<LabelWrapper>{t('INSURANCE_NO')}</LabelWrapper>
											<TextField fullWidth size="small" value={insurance.insuranceNo} onChange={(e) => onChangeInsuranceInfo("insuranceNo", e.target.value, index)} sx={FIELD_BG_WHITE} error={!!validationErrors[`insurance_insuranceNo_${index}`]} helperText={validationErrors[`insurance_insuranceNo_${index}`]} />
										</Box>

										<Box>
											<LabelWrapper>{t('EXPIRY_DATE')}</LabelWrapper>
											<TextField fullWidth size="small" type="date" value={insurance.expiryDate}
												onChange={(e) => onChangeInsuranceInfo("expiryDate", e.target.value, index)}
												inputProps={{ min: moment().add(6, 'months').format(CNDateFormat) }}
												InputLabelProps={{ shrink: true }} sx={FIELD_BG_WHITE}
												error={!!validationErrors[`insurance_expiryDate_${index}`]} helperText={validationErrors[`insurance_expiryDate_${index}`]} />
										</Box>

									</Box>

								</Box>
							))}
						</Box>

						<Box className="flex justify-between items-center mt-2">
							<button
								className="flex items-center gap-2 text-sm text-green-600 cursor-pointer hover:underline"
								onClick={() => onChangeInsuranceList("add")}
							>
								+ {t('ADD_INSURANCE')}
							</button>
						</Box>
					</Box>
					{/* End Right Column */}
				</Box>
				<Box ref={bottomRef} />
			</Box>
			{/* Action buttons */}
			<Box className="flex justify-end gap-2 pt-4 mt-4 border-t border-gray-200 px-4">
				<VmButton variant="outlined" colorScheme={ColorScheme.DARK} onClick={onClose} className="px-8 rounded-lg">{t('CANCEL')}</VmButton>
				<VmButton colorScheme={ColorScheme.DARK} className="px-8 rounded-lg" onClick={handleSubmit} loading={patientStore.creating || patientStore.updating}>{t('CONFIRM')}</VmButton>
			</Box>
		</>
	);
});

export default PatientForm;
