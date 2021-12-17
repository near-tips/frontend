import { utils } from 'near-api-js';

export const yoctoNEARToNear = (yoctoNear) => {
  const normalAmountString = yoctoNear.toLocaleString().split(',').join('');

  return utils.format.formatNearAmount(normalAmountString);
}
