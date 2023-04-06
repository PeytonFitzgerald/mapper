export function formatNumber(num: number, type: 'dollar' | 'ratio' | 'count') {
  if (type === 'dollar') {
    return '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
  } else if (type === 'ratio') {
    return num.toFixed(2)
  } else if (type === 'count') {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } else {
    return num
  }
}
