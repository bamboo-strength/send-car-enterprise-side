import { getCurrentUser } from '../../../../utils/authority';
import {columns_default} from "./DeviceListConf/columns_default";
import AddForm_default from "./DeviceAddConf/AddForm_default";
import EditForm_default from "./DeviceEditConf/EditForm_default";
import SearchForm_default from './DeviceListConf/SearchForm_default';

/**
 * 根据租户获取查询页显示列表
 * @returns {columns_default|columns_948728}
 */
export function getListConf () {
  const user = getCurrentUser();
  return columns_default;
};


/**
 * 根据租户获取查询表单
 * @returns {SearchForm_default|SearchForm_948728}
 */
export function getSearchForm() {
  const user = getCurrentUser();
  return SearchForm_default;
}


/**
 * 根据租户获取添加页面
 * @returns {AddForm_default|AddForm_948728}
 */
export function getAddConf() {
  return AddForm_default;
}


/**
 * 根据租户获取修改页面
 * @returns {EditForm_default|EditForm_948728}
 */
export function getEditConf() {
  return EditForm_default;
}

