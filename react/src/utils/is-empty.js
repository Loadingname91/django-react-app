
const isEmpty = (value) =>      //fuction will return true in following cases
    value === undefined ||
    value == null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);
   


export default isEmpty;