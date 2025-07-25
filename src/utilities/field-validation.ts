export const IsEmptyStr = (str: any) => {
  return !str || str === "";
}

export const IsValidEmailAddress = (address: any) => {
  return address && /\S+@\S+\.\S+/.test(address);
}

export const IsZero = (str: any) => {
  return !str || +str == 0;
}

export const IsNumeric = (str: any) => {
  return str && /^\d+(\.\d+)?$/.test(str);
}

export const RemoveSpecialCharacters = (string: string) => string.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');

export const RemoveHtmlTag = (string: string) => string?.replace(/<\/?[^>]+(>|$)/g, '');

export const isValidAustralianPhoneNumber = (phoneNumber: string) => {
  const pattern = /^(?:\+61|0)[2-478](?:[ -]?[0-9]){8}$/;
  return pattern.test(phoneNumber);
}