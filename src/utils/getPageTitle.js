import { formatMessage } from 'umi/locale';
import pathToRegexp from 'path-to-regexp';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { currentTenant,loginTitle } from '../defaultSettings';

export const matchParamsPath = (pathname, breadcrumbNameMap) => {
  const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
  return breadcrumbNameMap[pathKey];
};

const getPageTitle = (pathname, breadcrumbNameMap) => {
  return loginTitle[currentTenant];
  /* const currRouterData = matchParamsPath(pathname, breadcrumbNameMap);
   if (!currRouterData) {
     return loginTitle[currentTenant];
   }
   const pageName = menu.disableLocal
     ? currRouterData.name
     : formatMessage({
         id: currRouterData.locale || currRouterData.name,
         defaultMessage: currRouterData.name,
       });

   return `${pageName} - ${title}`; */
};

export default memoizeOne(getPageTitle, isEqual);
