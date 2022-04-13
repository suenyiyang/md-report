/* eslint-disable no-console */
const src = '$111$xxx$222$yyy\n$$\n\frac{1}{2}\n\frac{2}{3}\n$$'

console.log(src.match(/\$\$[^]*\$\$/g).map(item => item.trim().replace(/\$*\n/, '').replace(/\n\$*$/, '').split(/\r?\n/).join('')))
