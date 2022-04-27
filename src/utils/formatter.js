import { utils } from 'near-api-js';

export const yoctoNEARToNear = (yoctoNear) => {
  const normalAmountString = yoctoNear.toLocaleString().split(',').join('');

  return utils.format.formatNearAmount(normalAmountString);
}

export const hashToU8Array = (hash) => {
  return [...Buffer.from(hash.toString(), 'hex')];
}

export const stringToHex = (str) => {
  let result = '';

  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }

  return result;
}
