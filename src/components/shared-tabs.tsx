import { Box } from "@mui/material";
import { observer } from "mobx-react";
import * as React from "react";
import { VmTab } from "../constants/options";

const VmTabs = observer(({ tabList, activeTab, onChangeTab }: { tabList: VmTab[], activeTab: any, onChangeTab: (tab: any) => any; }) => {

  return (
    <Box className="flex gap-6">
      {tabList.map((t: any, i: number) => (
        <button key={`tab_${i}`}
          disabled={activeTab == t.key}
          onClick={(e: any) => onChangeTab(t.key)}
          className={`${activeTab === t.key ? ' text-white' : ' text-white/50 hover:text-white'} text-2xl 2xl:text-xsm transition-all duration-300`}>
          {t.label}
        </button>
      ))}
    </Box>
  );
});

export default VmTabs;
