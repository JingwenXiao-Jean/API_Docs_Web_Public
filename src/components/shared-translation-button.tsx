import { observer } from "mobx-react";
import React, {  } from "react";
import { Box } from "@mui/material";
import { IsAuthed, GetLangKey, GetLangLabel, Language } from "../utilities/general";
import { useTranslation } from 'react-i18next';
import Translate from '../images/nav/translate.svg';
import { isWeb } from "../utilities/platform";


const TranslationButton = observer(({}) => {

	const { t, i18n }: any = useTranslation();
	const onToggleLanguage = (lang: Language = GetLangKey() == Language.ENGLISH ? Language.ZH_CN : Language.ENGLISH) => {
		i18n.changeLanguage(lang);
		localStorage.LANG = lang;
		if (isWeb && IsAuthed()) window.location.reload();
	};

	return (
		<Box>
			<button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100" onClick={() => onToggleLanguage()}>
				<img src={Translate} className="h-5 object-contain" />
				<p>{GetLangKey() == Language.ENGLISH ? "中文版" : "English Ver"}</p>
			</button>
		</Box>
	);
});
export default TranslationButton;