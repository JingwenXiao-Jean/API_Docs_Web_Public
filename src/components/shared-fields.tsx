import React, { useEffect, useState } from "react";
import { observer } from "mobx-react";
// import { useTranslation } from "react-i18next";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { FIELD_BG_WHITE, HEADING, SECT_HEADING, SECT_SUBHEADING, SELECT_BG_WHITE, THEME_YELLOW } from "../constants/style";
import { FieldType, VmDynamicField } from "../constants/options";
import { IsEmptyStr, IsNumeric } from "../utilities/field-validation";
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

const VmFields = observer(({ name, gridCols, gap, disabled, onChange, fields, size = "small", isGridFive }: {
  name?: string, gridCols?: number, gap?: number, disabled?: boolean, onChange: (fieldData: any) => any, size?: any | "small" | "medium" | "large", fields: VmDynamicField[], isGridFive?: boolean;
}) => {
  // const { t }: any = useTranslation();
  const [fieldList, setFieldList] = useState<VmDynamicField[]>([]);
  const [tempField, setTempField] = useState<any>();
  const [refresh, setRefresh] = useState<any>([]);
  const toolBar = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ align: [] }],
      // ['link', 'image', 'video'],
      ['link'],
      ['clean'],
    ],
  };

  const module = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'blockquote', 'code-block',
    'list', 'bullet',
    'script', 'indent', 'direction', 'align',
    'link',
    // 'image', 'video',
  ];

  useEffect(() => {
    setFieldList(fields.map((f: any, i: number) => ({ ...f, id: i + 1 })));
  }, [fields]);

  // useEffect(() => {
  //   const delayDebouncer = setTimeout(() => {
  //     if (fieldList.length > 0)
  //       onChange(fieldList);
  //   }, 2000);
  //   return () => clearTimeout(delayDebouncer);
  // }, [tempField]);


  const onChangeFields = (id: number, value: string, multiCheckboxOption?: any) => {
    if (value === "<p><br></p>") return;
    if (fieldList.length > 0) {
      let targetField = fieldList.find((f: any) => f.id == id);
      if (targetField) {
        if (IsEmptyStr(multiCheckboxOption)) targetField.value = value;
        else {
          if (targetField.selections) {
            // @ts-ignore
            targetField.selections.find((s: any) => `${s.id} ${s.label}` === multiCheckboxOption).value = value;
          }
        }
        // setTempField(targetField);
        onChange(fieldList);

        setRefresh([]);
      }
    }
  };

  return (
    <Box>
      {name && <p className={SECT_SUBHEADING}>{name}</p>}
      {/* <Box className={`grid ${isGridFive ? 'grid-cols-5' : gridCols ? `grid-cols-${gridCols}` : `grid-cols-3`} gap-${gap ? gap : 4} mt-4`}> */}
      <Box className={`grid ${gridCols ? `grid-cols-${gridCols}` : `grid-cols-3`} gap-${gap ? gap : 4} mt-4`}>
        {fieldList.map((vField: VmDynamicField | any, i: number) => (
          <Box key={`dynamic_${i}`} className={`col-span-${vField.colSpan != null ? vField.colSpan : 1}`}>
            {vField.fieldType === FieldType.TEXT || vField.fieldType === FieldType.TEXT_AREA
              || vField.fieldType === FieldType.NUMBER || vField.fieldType === FieldType.DATE
              || vField.fieldType === FieldType.DATE_TIME || vField.fieldType === FieldType.TIME ? <>
              <TextField
                value={vField.value}
                sx={{ width: vField.autoWidth ? 'auto' : "100%", ...FIELD_BG_WHITE }}
                label={vField.name}
                type={vField.fieldType === FieldType.NUMBER ? "number" :
                  vField.fieldType === FieldType.DATE ? "date" : vField.fieldType === FieldType.DATE_TIME ? "datetime-local" :
                    vField.fieldType === FieldType.TIME ? "time" : "text"}
                multiline={vField.fieldType === FieldType.TEXT_AREA}
                minRows={vField.fieldType === FieldType.TEXT_AREA ? (
                  vField.minRows ? vField.minRows : 4
                ) : 1}
                placeholder={vField.placeHolder}
                InputLabelProps={{ shrink: !IsEmptyStr(vField.name) }}
                onChange={(event: any) => onChangeFields(vField.id, event.target.value)}
                inputProps={{ startAdornment: vField.startAdornment }}
                error={vField.error}
                disabled={disabled == true || vField.disabled == true}
                size={size ? size : "medium"}
              />
            </> : vField.fieldType === FieldType.SELECT ? <>
              <FormControl size={size ? size : "medium"} sx={{ width: vField.autoWidth ? 'auto' : "100%", ...SELECT_BG_WHITE }} error={vField.error}>
                <InputLabel>{vField.name}</InputLabel>
                <Select
                  label={vField.name}
                  sx={{ width: vField.autoWidth ? 'auto' : "100%" }}
                  // @ts-ignore
                  value={IsNumeric(vField.value) ? +vField.value : `${vField.value}`}
                  placeholder={vField.placeHolder}
                  onChange={(event: any) => onChangeFields(vField.id, event.target.value)}
                  error={vField.error}
                  disabled={disabled == true || vField.disabled == true}
                >
                  {vField.selections && vField.selections.map((option: any, idx: number) => (
                    <MenuItem key={`option_${idx}`} value={option.id ? option.id : option}>{option.label ? option.label : option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </> : vField.fieldType === FieldType.CHECKBOX ? <>
              {vField.selections && vField.selections.length > 0 ? <>
                <FormControl sx={{ width: vField.autoWidth ? 'auto' : "100%" }} error={vField.error}>
                  <FormLabel>{vField.name}</FormLabel>
                  <Box className={`grid grid-cols-${vField.selectionsCols ? vField.selectionsCols : 5} gap-1`}>
                    {vField.selections.map((select: any, idx: number) => (
                      <Box className="col-span-1">
                        <FormControlLabel
                          key={`multi_checkbox_${idx}`}
                          label={select.label}
                          control={
                            <Checkbox
                              value={select.label}
                              checked={select.value && select.value === "true" ? true : false}
                              onChange={(event: any) => onChangeFields(vField.id, `${event.target.checked}`, `${select.id} ${select.label}`)}
                              sx={{ color: "gray", '&.Mui-checked': { color: THEME_YELLOW } }}
                              disabled={disabled == true || vField.disabled == true}
                            />}
                        />
                      </Box>
                    ))}
                  </Box>
                </FormControl>
              </> : <FormControlLabel
                label={vField.name}
                control={
                  <Checkbox
                    value={true}
                    checked={vField.value && vField.value === "true" ? true : false}
                    onChange={(event: any) => onChangeFields(vField.id, `${event.target.checked}`)}
                    sx={{ color: "gray", '&.Mui-checked': { color: THEME_YELLOW } }}
                    disabled={disabled == true || vField.disabled == true}
                  />}
              />}
            </> : vField.fieldType === FieldType.RADIO ? <>
              <FormControl error={vField.error}>
                <FormLabel>{vField.name}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  // @ts-ignore
                  value={IsNumeric(vField.value) ? +vField.value : `${vField.value}`}
                  onChange={(event: any) => onChangeFields(vField.id, event.target.value)}
                >
                  {vField.selections && vField.selections.map((option: any, idx: number) => (
                    <FormControlLabel
                      key={`radio_${idx}`}
                      control={<Radio value={option.id ? option.id : option} sx={{ color: "gray", '&.Mui-checked': { color: THEME_YELLOW } }} />}
                      label={option.label ? option.label : option}
                      disabled={disabled == true || vField.disabled == true}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </> : vField.fieldType === FieldType.RICH_TEXT ? <>
              {/* <ReactQuill placeholder={vField.placeHolder} value={vField.value} onChange={(event: any) => onChangeFields(vField.id, event)} modules={toolBar} formats={module} readOnly={disabled} /> */}
            </> : <Box className={SECT_HEADING}>{!IsEmptyStr(vField.name) && vField.name}</Box>}
          </Box>
        ))}
      </Box>
    </Box>
  );
});


export default VmFields;