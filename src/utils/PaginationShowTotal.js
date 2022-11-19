/**
 * 显示简单的总数
 * @param total
 * @returns {string}
 */
const SHOW_TOTAL_SIMPLE = (total=0) => {
  return `共${total}条`;
}
/**
 * 显示总数,和本页开始和结束条数
 * @param total
 * @param pages
 * @returns {string}
 */
const SHOW_TOTAL = (total=0,pages=[0,0] ) => {
  return `显示${pages[0]}到${pages[1]}条,共${total}条`;
}

export { SHOW_TOTAL_SIMPLE, SHOW_TOTAL };
