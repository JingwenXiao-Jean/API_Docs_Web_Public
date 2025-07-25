import { useEffect, useState } from "react";
import { observer } from "mobx-react";
import { ColorScheme, GetStatusCodeText, VmTBody, VmTBodyType, VmTableButton, VmTableSearch } from "../constants/options";
import { IsEmptyStr, IsZero } from "../utilities/field-validation";
import { AUDDateFormat, AUDMonthYearFormat, AUDTimeFormat, AUDateTimeFormat, Priority } from "../utilities/general";
import { Box, Chip, TextField, Tooltip } from "@mui/material";
import React from "react";
import { BG_TABLE_HEAD, BG_TABLE_HEAD_GRAY, ERROR, ITEM_PERFECT_INLINED, REQUIRED_ACTION, SUCCESS, THEME_GREEN } from "../constants/style";
import VmSpinner from "./shared-spinner";
import VmButton from "./shared-button";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import moment from 'moment';
import SearchIcon from '@mui/icons-material/Search';
import VmIconButton from "./shared-icon-button";
import ImageIcon from '@mui/icons-material/Image';
// import { GetStatusDescription, OutgoingStage, Priority, RequestStageStatus, Responsibility } from "../utilities/maintenance";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import TextsmsOutlinedIcon from '@mui/icons-material/TextsmsOutlined';
import SmsFailedOutlinedIcon from '@mui/icons-material/SmsFailedOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { GetStatusCodeIcon } from "./statusful-textfield";
import { OpenInNew } from "@mui/icons-material";
import { t } from 'i18next';

// import { TicketStage } from "../utilities/enquiry-ticket";

export const VmSmartTable = observer(({
  loading, thead, source, tbody, enableLoadMore, actualCount, onLoadMore, onClickRow, sortByDefault = true, highlightRow, hardRefresh, headerColour = THEME_GREEN, defaultSortBy = "Last Updated Time", defaultSortByAscend = false, onSortCallback }:
  {
    loading?: boolean,
    thead: string[],
    source: any[],
    tbody: VmTBody[],
    actualCount?: number, // actual number of records return from the API
    enableLoadMore: boolean,
    onLoadMore?: () => any,
    onClickRow?: (req: any) => any,
    sortByDefault?: boolean;
    highlightRow?: { field: string, value: any; },
    hardRefresh?: boolean;
    defaultSortBy?: string;
    defaultSortByAscend?: boolean;
    headerColour?: string;
    onSortCallback?: (thIndex: number, ascending: boolean) => any;
  }) => {
  const tbodyFirstColStyle = "px-2 py-3";
  const tbodyColStyle = "px-2 py-3";
  const [sortBy, setSortBy] = useState<number>(-1);
  const [isAscending, setIsAscending] = useState<boolean>(true);
  const [searchKey, setSearchKey] = useState<string>("");
  const [filteredList, setFilteredList] = useState<any[]>(source);
  const [refresh, setRefresh] = useState<any>([]);
  const fontSize = 14.5;

  useEffect(() => {
    if (thead[0]) {
      setSearchKey("");
      let idx = thead.includes(defaultSortBy) ? thead.indexOf(defaultSortBy) : thead.indexOf("Issue Time");
      onSortList(idx > - 1 ? idx : 0, defaultSortByAscend, sortByDefault);
    }
  }, [source]);

  // Process complex data
  const processComplexField = (fields: string[], tableRow: any) => {
    let strResult = "";
    fields.map((field: string) => {
      if (field.includes(".")) {
        let rowData = tableRow;
        for (var f of field.split(".")) {
          if (rowData[f]) rowData = rowData[f];
          else {
            rowData = "-";
            break;
          }
        }
        strResult = !IsEmptyStr(strResult) ? `${strResult} ${rowData}` : rowData;
      } else strResult = !IsEmptyStr(strResult) ? `${strResult} ${tableRow[field]}` : `${tableRow[field]}`;
    });
    return IsEmptyStr(strResult) ? "-" : strResult;
  };

  // translate tBody string inputs from outside of the component to readable table data
  const translateInputsToTableBody = (fieldData: VmTBody, index: number) => {
    let tableRow = filteredList[index];
    let fields: string[] | any = fieldData.fields;
    switch (fieldData.type) {
      case VmTBodyType.DESCRIPTION:
        if (tableRow[fields[0]]) return tableRow[fields[0]].substring(0, 40) + `${tableRow[fields[0]].length > 40 ? '...' : ''}`;
        return "-";
      case VmTBodyType.CURRENCY:
        return `$${tableRow[fields[0]] ? (+tableRow[fields[0]]).toFixed(2).toLocaleString() : 0}`;
      case VmTBodyType.DATE:
        if (tableRow[fields[0]]) return moment(tableRow[fields[0]]).format(AUDDateFormat);
        return "-";
      case VmTBodyType.DATE_TIME:
        if (tableRow[fields[0]]) return moment(tableRow[fields[0]]).format(AUDateTimeFormat);
        return "-";
      case VmTBodyType.MONTH_YEAR:
        if (tableRow[fields[0]]) return moment(tableRow[fields[0]]).format(AUDMonthYearFormat);
        return "-";
      case VmTBodyType.CASE_DATE_TIME:
        if (tableRow[fields[0]]) return moment(tableRow[fields[0]]).format(AUDateTimeFormat);
        return "-";
      case VmTBodyType.TIME:
        if (tableRow[fields[0]]) return moment(tableRow[fields[0]]).format(AUDTimeFormat);
        return "-";
      case VmTBodyType.COMPLEX: return processComplexField(fields, tableRow);
      case VmTBodyType.STATUS: return processComplexField(fields, tableRow);
      case VmTBodyType.TEXT_BUTTON:
        // @ts-ignore
        if (tableRow[fieldData.fields[0].field]) return tableRow[fieldData.fields[0].field];
        return;
      default:
        if (tableRow[fields[0]]) return tableRow[fields[0]].toLocaleString();
        return "-";
    }
  };

  // Sort list based on data type
  const onSortList = (thIndex: number, ascending: boolean, reverseSort: boolean, isManualSort: boolean = false) => {
    if (isManualSort && onSortCallback) onSortCallback(thIndex, ascending);
    if (tbody.length === 0) return;
    // if (tbody[thIndex].type === VmTBodyType.BUTTON) return;
    let targetCol: VmTBody | any = tbody[thIndex];
    let tempSourceList = source;

    if (targetCol.type === VmTBodyType.TEXT || targetCol.type === VmTBodyType.DESCRIPTION || targetCol.type === VmTBodyType.STATUS) {
      tempSourceList = tempSourceList.sort((a: any, b: any) => `${a[targetCol.fields[0]]}`.localeCompare(`${b[targetCol.fields[0]]}`, 'zh'));
    } else if (targetCol.type === VmTBodyType.PRIORITY) {
      const rewording = (prio: Priority) => {
        return prio == Priority.HIGH ? "D" : prio == Priority.MEDIUM ? "C" : prio == Priority.LOW ? "B" : "A";
      };
      tempSourceList = tempSourceList.sort((a: any, b: any) => `${rewording(a[targetCol.fields[0]])}`.localeCompare(`${rewording(b[targetCol.fields[0]])}`, 'zh'));
    } else if (targetCol.type === VmTBodyType.TEXT_LINK) {
      tempSourceList = tempSourceList.sort((a: any, b: any) => processComplexField(targetCol.fields.fields, a)
        .localeCompare(processComplexField(targetCol.fields.fields, b), 'zh'));
    } else if (targetCol.type === VmTBodyType.DATE || targetCol.type === VmTBodyType.TIME || targetCol.type === VmTBodyType.MONTH_YEAR) {
      // console.log(tempSourceList.sort((a: any, b: any) => moment(a[targetCol.fields[0]]).isBefore(moment(b[targetCol.fields[0]])) ? - 1 : 1));
      // @ts-ignore
      tempSourceList = tempSourceList.sort((a: any, b: any) => moment(a[targetCol.fields[0]]).isBefore(moment(b[targetCol.fields[0]])) ? - 1 : 1);
    } else if (targetCol.type === VmTBodyType.CASE_DATE_TIME) {
      tempSourceList = tempSourceList.sort((a: any, b: any) => moment(a.lastModifiedAt ? a.lastModifiedAt : a.createdAt).isBefore(moment(b.lastModifiedAt ? b.lastModifiedAt : b.createdAt)) ? - 1 : 1);
    } else if (targetCol.type == VmTBodyType.URGENT) {
      tempSourceList = tempSourceList.sort((a: any, b: any) => `${a[targetCol.fields[0]] ? "Urgent" : "Non"}`.localeCompare(`${b[targetCol.fields[0]] ? "Urgent" : "Non"}`, 'zh'));
    } else if (targetCol.type == VmTBodyType.CUSTOM) {
      if (targetCol.fields.sortBy) tempSourceList = tempSourceList.sort((a: any, b: any) => targetCol.fields.sortBy(a) - targetCol.fields.sortBy(b));
    } else {
      tempSourceList = tempSourceList.sort((a: any, b: any) => moment(a[targetCol.fields[0]]).isBefore(moment(b[targetCol.fields[0]])) ? - 1 : 1);
    }

    if (ascending) tempSourceList.reverse();

    // if (onSearch) onSearchList(key, tempSourceList);
    setFilteredList(tempSourceList);
    if (reverseSort == true) setIsAscending(!ascending);
    // console.log(tempSourceList);
    setSortBy(thIndex);
  };

  // const onSearchList = (key: string, inputSourceList: any[]) => {
  //   if (onSearch) {
  //     const isExistedInData = (record: any) => {
  //       for (let field of onSearch.searchFields) {
  //         if (field.includes(".")) {
  //           let data: any = record;
  //           field.split(".").map((f: string) => data = data[f]);
  //           if (data.toLowerCase().includes(key.toLowerCase())) return true;
  //         } else if (record[field].toLowerCase().includes(key.toLowerCase())) return true;
  //       };
  //       return false;
  //     };
  //     let tempSourceList: any[] = inputSourceList;
  //     if (!IsEmptyStr(key)) {
  //       tempSourceList = tempSourceList.filter((s: any) => isExistedInData(s) == true);
  //     }
  //     setFilteredList(tempSourceList);
  //     setSearchKey(key);
  //   }
  // };

  const getCompareCondition = (compareBy: any, operator: string, compareTo: any) => {

    switch (operator) {
      case "||": return compareBy || compareTo;
      case ">": return compareBy > compareTo;
      case ">=": return compareBy >= compareTo;
      case "<": return compareBy < compareTo;
      case "<=": return compareBy <= compareTo;
      case "==": return compareBy == compareTo;
      case "&&": return compareBy && compareTo;
    }
  };

  // Only if the row is clickable
  const onTriggeringButton = (item: any, project: any, event: any) => {
    item.onClick(project, event);
    event.stopPropagation();
  };

  // const onTriggeringImage = (event: any, id: number, source: ImageSource) => {
  //   // window.open(GetImage(id, source), '_blank');
  //   // event.stopPropagation();
  // };

  return (
    <>
      {/* {onSearch && <TextField
        value={searchKey}
        onChange={(e: any) => onSortList(sortBy, !isAscending, e.target.value, "", false)}
        label={onSearch.title}
        size="small"
        variant="outlined"
        sx={{ mb: 1 }}
        placeholder={onSearch.placeHolder ? onSearch.placeHolder : ""}
        InputProps={{
          startAdornment: (<SearchIcon sx={{ mr: 1, color: 'gray' }} />),
        }}
      />} */}
      <table width={"100%"}>
        <thead className={`z-10  text-white rounded-lg `} style={{ background: headerColour }}>
          {thead.map((th: string, i: number) => (
            <td key={`th_${i}`} style={{ fontSize }} className={`font-bold text-left text-sm 2xl:text-md px-3 py-2 cursor-pointer hover:bg-transparent/25 transition-all duration-200 
            ${i == 0 ? 'rounded-l-md' : i == thead.length - 1 && 'rounded-r-md'}`}
              onClick={() => onSortList(i, isAscending, true, true)}>
              <Box sx={ITEM_PERFECT_INLINED}>
                {th} {th !== "No." && (sortBy === i && <>{isAscending ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}</>)}
              </Box>
            </td>
          ))}
        </thead>
        <tbody>{hardRefresh == true || (loading && IsZero(source.length)) || (!enableLoadMore && loading) ? <td colSpan={thead.length}><VmSpinner>{t('LOADING')}</VmSpinner></td> : <>
          {filteredList.map((project: any, i: number) => (
            <>
              <Box my={1} />
              <tr className={`${highlightRow && project[highlightRow.field] == highlightRow.value ? "bg-red-100" : "bg-white"} ${onClickRow ? 'hover:bg-gray-100 cursor-pointer' : ''} transition-all duration-300 rounded-lg`} key={`project_list_${i}`}
                onClick={onClickRow ? () => onClickRow(project) : () => { }}>
                {tbody.map((field: any, idx: number) => (
                  <td key={`tbody_${i}_${idx}`} className={`${idx == 0 ? tbodyFirstColStyle : tbodyColStyle} ${field.type === VmTBodyType.NO ? "w-20" : ""}`}>
                    {/* @ts-ignore */}
                    {field.type === VmTBodyType.BUTTON ? <>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {field.fields.map((f: VmTableButton) => (
                          <button
                            disabled={f.isEnable === false}
                            className={f.colorScheme === ColorScheme.SUCCESS ? "text-green-500" : f.colorScheme === ColorScheme.ERROR ? "text-red-500"
                              : f.colorScheme === ColorScheme.WARNING ? "text-orange-500" : "text-themeGreen"}
                            onClick={(e: any) => onTriggeringButton(f, project, e)}
                            style={{ cursor: f.isEnable !== false ? "pointer" : "not-allowed", color: f.isEnable !== false ? "" : "#ccc" }}
                          >
                            {/* colorScheme={f.colorScheme ? f.colorScheme : ColorScheme.INITIAL}> */}
                            <Tooltip title={f.label}>
                              {f.icon}
                            </Tooltip>
                          </button>
                        ))}
                      </Box>
                    </> : field.type === VmTBodyType.NO ? <Box sx={{ fontSize }}>{i + 1}.</Box>
                      : field.type === VmTBodyType.NUMBER ? <Box sx={{ fontSize }}>{[null, undefined].includes(project[field.fields[0]]) ? "-" : project[field.fields[0]].toLocaleString()}</Box>
                        : field.type === VmTBodyType.CHIP_LIST ? <Box sx={{ ...ITEM_PERFECT_INLINED, maxWidth: 300 }}>
                          {project[field.fields.fields[0]].length > 0 ? <>
                            {project[field.fields.fields[0]].filter((j: any, i: number) => i < 5).map((job: any, i: number) => (
                              <Chip label={job.name} size="small"
                                color={field.fields.onClick ? "warning" : "default"}
                                onClick={field.fields.onClick}
                                sx={{ mr: i < project[field.fields.fields[0]].length - 1 ? 0.5 : 0, my: 0.5 }} />
                            ))}
                            {project[field.fields.fields[0]].length > 5 && <Chip size="small" label={`and ${project[field.fields.fields[0]].length - 5} more...`} />}
                          </> : <p style={{ fontSize }}>Not Provided</p>}
                        </Box> : field.type === VmTBodyType.TEXT_LINK ?
                          <button className="hover:underline text-left hover:text-themeGreen" onClick={(e: any) => { e.stopPropagation(); field.fields.onClick(project, e); }}>
                            <Box sx={{ fontSize }}>
                              {field.fields.fields.length > 1 ? `${project[field.fields.fields[0]]} ${project[field.fields.fields[1]]}` : translateInputsToTableBody(field.fields, i)}
                              <OpenInNew sx={{ fontSize: 12, ml: 0.5, display: "inline-block" }} />
                            </Box>
                          </button> : field.type === VmTBodyType.CUSTOM
                            ? <Box sx={{ fontSize }}>
                              {field.fields.render(project)}
                            </Box>
                            : field.type === VmTBodyType.MULTILINE ? <Box>
                              {project[field.fields[0]].split("\n").map((str: string) => (
                                <p style={{ fontSize }}>{str}</p>
                              ))}
                            </Box> : field.type === VmTBodyType.TEXT_BUTTON ? <>
                              {/* @ts-ignore */}
                              {project[field.fields.fields[0]].map((parent: any, i: number) => (
                                /* @ts-ignore */
                                parent.label ? <VmButton className={`mb-1 text-xs ${i < project[field.fields.fields[0]].length - 1 ? 'mr-2' : ''}`} onClick={(e: any) => field.fields.onClick(parent, e)}
                                  key={`text_button_${i}`}
                                  variant="outlined">
                                  <Tooltip title={`Go to ${parent.label}`}>
                                    {parent.label}
                                  </Tooltip>
                                </VmButton> : <p>-</p>
                              ))}
                            </> : field.type === VmTBodyType.URGENT ? <>
                              <Box className={`${project[field.fields[0]] ? "bg-red-200 text-red-500" : "bg-green-100 text-green-500"} w-fit rounded-md font-bold py-1 px-2 text-xs 2xl:text-sm font-bold`}>
                                {/* {project[field.fields[0]] ? "Urgent" : "No Urgent"} */}
                                {project[field.fields[0]] ? <Tooltip title="Urgent"><SmsFailedOutlinedIcon /></Tooltip> : <Tooltip title="Normal"><TextsmsOutlinedIcon /></Tooltip>}
                              </Box>
                            </> : field.type === VmTBodyType.PRIORITY ? <>
                              <Box className={`${project[field.fields[0]] == Priority.HIGH ? "bg-red-200 text-red-500" : project[field.fields[0]] == Priority.LOW ? SUCCESS :
                                project[field.fields[0]] == Priority.MEDIUM ? REQUIRED_ACTION : "bg-gray-100 text-gray-500"} w-fit rounded-md font-bold py-1 px-2 text-xs 2xl:text-sm font-bold uppercase`}>
                                <Tooltip title={project[field.fields[0]] ? `${project[field.fields[0]]} Priority` : "N/A"}>{project[field.fields[0]] ? project[field.fields[0]] : "N/A"}</Tooltip>
                              </Box>
                            </> : field.type === VmTBodyType.STATUS ?
                              <Box sx={ITEM_PERFECT_INLINED}>
                                {GetStatusCodeIcon(project.approvalStatusId, project.id)}
                                <p className="text-sm">{GetStatusCodeText(project.approvalStatusId)}</p>
                                {/* <Tooltip title={translateInputsToTableBody(field, i)} arrow> */}
                                {/* <p>{GetStatusCodeIcon(project.approvalStatusId, project.id)}</p> */}

                                {/* <p className={`${project.caseStatusId ? (project.isArchived ? ERROR : (GetStatusDescription(project.caseStatusId).color)) : project.statusId ? ERROR : REQUIRED_ACTION} 
                              rounded-md text-sm py-1 px-2 text-black`}>
                                  {project.caseStatusId ? (project.isArchived ? <HighlightOffIcon /> : (GetStatusDescription(project.caseStatusId).scheme == "warning") ? <InfoOutlinedIcon />
                                    : GetStatusDescription(project.caseStatusId).scheme == "success" ? <CheckCircleOutlineOutlinedIcon /> : <InfoOutlinedIcon />)
                                    : project.statusId ? <HighlightOffIcon /> : <InfoOutlinedIcon />}</p> */}
                                {/* </Tooltip> */}
                              </Box>
                              // : field.type === VmTBodyType.IMAGES ?
                              //   <Box sx={ITEM_PERFECT_INLINED}>
                              //     {project[field.fields[0]].length > 0 ? project[field.fields[0]].filter((img: any, i: number) => i < 5).map((img: any, i: number) => (
                              //       <button title="View attachment"
                              //         className={i > 0 ? "ml-2" : ""}
                              //         key={`img_attachement_${i}`}
                              //         data-row-data={`image_${img.id}`}
                              //         onClick={(e) => onTriggeringImage(e, img.id, img.source)}>
                              //         <ImageIcon />

                              //       </button>
                              //     )) : <p style={{ fontSize }}>No Attachment</p>}
                              //   </Box>
                              : field.type == VmTBodyType.CONDITION ? <Box sx={{ fontSize }}>
                                {/* @ts-ignore */}
                                {getCompareCondition(Array.isArray(field.fields.compareBy) ? project[field.fields.compareBy] : field.fields.compareBy,
                                  // @ts-ignore
                                  field.fields.operator, Array.isArray(field.fields.compareTo) ? project[field.fields.compareTo] : field.fields.compareTo)
                                  ? <>
                                    {/* @ts-ignore */}
                                    {typeof field.fields.true[0] === "string" ? processComplexField(field.fields.true, project)
                                      // @ts-ignore
                                      : field.fields.true.operator ? <>
                                        {getCompareCondition(Array.isArray(field.fields.true.compareBy) ? project[field.fields.true.compareBy] : field.fields.true.compareBy,
                                          // @ts-ignore
                                          field.fields.true.operator, Array.isArray(field.fields.true.compareTo) ? project[field.fields.true.compareTo] : field.fields.true.compareTo) ?
                                          <Box sx={ITEM_PERFECT_INLINED}>
                                            {field.fields.true.enableIndicator ? <span className={`h-2 w-2 rounded-full bg-green-500`} /> : <></>}
                                            <p className={`${field.fields.true.enableIndicator && 'ml-1 -mt-1'}`}>{processComplexField(field.fields.true.false, project)}</p>
                                          </Box>
                                          : <Box sx={ITEM_PERFECT_INLINED}>
                                            {field.fields.true.enableIndicator ? <span className={`h-2 w-2 rounded-full bg-red-500`} /> : <></>}
                                            <p className={`${field.fields.true.enableIndicator && 'ml-1 -mt-1'}`}>{processComplexField(field.fields.true.false, project)}</p>
                                          </Box>}
                                      </> : field.fields.true.map((trueItem: any) => (
                                        <VmIconButton
                                          tooltip={trueItem.label}
                                          onClick={(e: any) => trueItem.onClick(project, e)}
                                          colorScheme={trueItem.colorScheme ? trueItem.colorScheme : ColorScheme.INITIAL}>
                                          {trueItem.icon}
                                        </VmIconButton>
                                      ))}
                                  </> : <Box sx={{ fontSize }}>
                                    {/* @ts-ignore */}
                                    {typeof field.fields.false[0] === "string" ? processComplexField(field.fields.false, project)
                                      // @ts-ignore
                                      : field.fields.false.operator ? <>
                                        {getCompareCondition(Array.isArray(field.fields.false.compareBy) ? project[field.fields.false.compareBy] : field.fields.false.compareBy,
                                          // @ts-ignore
                                          field.fields.false.operator, Array.isArray(field.fields.false.compareTo) ? project[field.fields.false.compareTo] : field.fields.false.compareTo) ?
                                          <Box sx={ITEM_PERFECT_INLINED}>
                                            {field.fields.false.enableIndicator ? <span className={`h-2 w-2 rounded-full bg-green-500`} /> : <></>}
                                            <p className={`${field.fields.false.enableIndicator && 'ml-2 -mt-1'}`}>{processComplexField(field.fields.false.false, project)}</p>
                                          </Box>
                                          : <Box sx={ITEM_PERFECT_INLINED}>
                                            {field.fields.false.enableIndicator ? <span className={`h-2 w-2 rounded-full bg-red-500`} /> : <></>}
                                            <p className={`${field.fields.false.enableIndicator && 'ml-2 -mt-1'}`}>{processComplexField(field.fields.false.false, project)}</p>
                                          </Box>}
                                      </>
                                        // @ts-ignore
                                        : field.fields.false.map((trueItem: any) => (
                                          <VmIconButton
                                            tooltip={trueItem.label}
                                            onClick={(e: any) => onTriggeringButton(trueItem, project, e)}
                                            colorScheme={trueItem.colorScheme ? trueItem.colorScheme : ColorScheme.INITIAL}>
                                            {trueItem.icon}
                                          </VmIconButton>
                                        ))}
                                  </Box>}
                              </Box>
                                : field.type == VmTBodyType.MONTH_YEAR ? <Box sx={{ fontSize }} className="max-w-propertySm 2xl:max-w-propertyLg">
                                  {project[field.fields[0]] ? moment(project[field.fields[0]]).format(AUDMonthYearFormat) : "-"}
                                </Box>
                                  : field.type == VmTBodyType.CASE_DATE_TIME ? <Box sx={{ fontSize }} className="max-w-propertySm 2xl:max-w-propertyLg">
                                    {project.lastModifiedAt ? moment(project.lastModifiedAt).format(AUDateTimeFormat) : moment(project.createdAt).format(AUDateTimeFormat)}
                                  </Box> : <Box className="max-w-propertySm 2xl:max-w-propertyLg" sx={{ fontSize }}>
                                    {translateInputsToTableBody(field, i)}
                                  </Box>}
                  </td>
                ))}
              </tr>
            </>
          ))}
        </>}</tbody>
      </table>

      {!hardRefresh && <>
        {/* If load more is enable, that means this table require paginations */}
        {!IsZero(source.length) && enableLoadMore ? <>
          {loading ? <VmSpinner>{t('LOADING_MORE')}</VmSpinner> : <>
            <p className="text-center mt-4 text-sm">Displayed<b className="text-red-500"> {filteredList.length} Record(s)</b>, with total {actualCount} records</p>
            <Box className="flex justify-center">
              <VmButton onClick={onLoadMore ? () => onLoadMore() : () => { }} className="transition-all mt-2 pl-2">
                <Box sx={ITEM_PERFECT_INLINED}>
                  <KeyboardArrowDownIcon />
                  <p className="ml-1 text-sm">{t('LOADING_MORE')}</p>
                </Box>
              </VmButton>
            </Box>
          </>}
        </> : !loading && <p className="text-center mt-4 text-sm text-gray-400">{filteredList.length == 0 ? "No" : actualCount} Result(s) Found</p>}
      </>}
    </>
  );
});

export const VmBasicTable = observer(({
  loading, thead, children, enableLoadMore, onLoadMore, currentCount, actualCount, sortedByCol, sortAscend, onClickToSort, headerColour, className
}:
  {
    loading?: boolean,
    thead: string[],
    children: any,
    enableLoadMore: boolean,
    onLoadMore?: () => any,
    currentCount?: number,
    actualCount?: number,
    sortedByCol?: string,
    sortAscend?: boolean,
    onClickToSort?: (col: string) => any,
    headerColour?: string,
    className?: string
  }) => {

  return (
    <>
      <table width={"100%"} className={className}>
        <thead className={"sticky top-0 z-10 rounded-lg"} style={{ backgroundColor: headerColour ? `${headerColour}` : THEME_GREEN }}>
          {thead.map((th: string, i: number) => (
            <th key={`th_${i}`}
              className={`font-bold text-left text-sm 2xl:text-md px-4 py-2 text-white cursor-pointer hover:bg-transparent/50 transition-all duration-200 
            ${i == 0 ? 'rounded-l-lg' : i == thead.length - 1 && 'rounded-r-lg'}`}
              // @ts-ignore
              onClick={onClickToSort ? () => onClickToSort(th) : () => { }}>
              <Box sx={ITEM_PERFECT_INLINED}>
                {th} {sortedByCol && sortedByCol === th ? sortAscend === true ? <ArrowUpwardIcon /> : <ArrowDownwardIcon /> : ''}
              </Box>
            </th>
          ))}
        </thead>
        <tbody className="text-sm 2xl:text-md">{!enableLoadMore && loading ? <th colSpan={thead.length}><VmSpinner>{t('LOADING')}</VmSpinner></th> : <>{children}</>}
        </tbody>
      </table>

      {/* If load more is enable, that means this table require paginations */}
      {enableLoadMore && <>
        {loading ? <VmSpinner>{t('LOADING_MORE')}</VmSpinner> : <>
          <p className="text-center mt-4 text-sm">Displayed<b className="text-red-500"> {currentCount} Record(s)</b>, with total {actualCount} records</p>
          <Box className="flex justify-center">
            {actualCount !== currentCount && <VmButton onClick={onLoadMore ? () => onLoadMore() : () => { }} className="transition-all mt-2 pl-2">
              <Box sx={ITEM_PERFECT_INLINED}>
                <KeyboardArrowDownIcon />
                <p className="ml-2 text-sm">{t('LOAD_MORE')}</p>
              </Box>
            </VmButton>}
          </Box>
        </>}
      </>}
    </>
  );
});