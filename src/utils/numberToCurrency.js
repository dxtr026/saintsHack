export default function numberToCurrency (val, kPrec = 0, lPrec = 0, cPrec = 0) {
  const cr  = 10000000;
  const lac = 100000;
  const k   = 1000;

  // # an easy way to get rounded value, value * multipier

  let unit       = '';
  let newVal            = parseInt(val, 10);
  let fVal      = '';
  if (val >= cr) {
    unit       = 'Cr';
    if (val - cr < cr) {
      newVal = parseFloat( val / cr ).toFixed( cPrec );
    } else {
      newVal = parseFloat( val / cr ).toFixed( cPrec );
    }
    if (parseInt( newVal, 10 ) === 1) {
      unit = 'Cr';
    }
  } else if (val >= lac) {
    unit       = 'Lacs';
    if (val - lac < lac) {
      newVal = parseFloat( val / lac ).toFixed( lPrec );
    } else {
      newVal = parseFloat( val / lac ).toFixed( lPrec );
    }
    if (parseInt( newVal, 10 ) === 1) {
      unit = 'Lac';
    }
  } else if (val >= k) {
    unit       = 'K';
    newVal    = parseFloat( val / k ).toFixed( kPrec );
  }

  fVal = `${newVal} ${unit}`;

  return fVal;
}
