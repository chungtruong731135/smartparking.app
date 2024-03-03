const getNameFile = (str) => {
    var _strArr = str.split('/')
    if (_strArr && _strArr.length > 0) return _strArr[_strArr.length - 1]
    return str
}

export { getNameFile }