import { utils } from 'near-api-js';

export const yoctoNEARToNear = (yoctoNear) => {
  const normalAmountString = yoctoNear.toLocaleString().split(',').join('');

  return utils.format.formatNearAmount(normalAmountString);
}

export const hexToU8Array = (hash) => {
  return [...Buffer.from(hash, 'hex')];
}

export const fromHexToU8Array = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

export const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

export const stringToHex = (str) => {
  let result = '';

  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }

  return result;
}
