"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectUtil = void 0;
var ObjectUtil;
(function (ObjectUtil) {
    /**
     * 判断指定值是否是一个对象
     * @param {any} arg 参数
     */
    function isObject(arg) {
        return Object.prototype.toString.call(arg) === '[object Object]';
    }
    ObjectUtil.isObject = isObject;
    /**
     * 对象中是否包含指定的属性
     * @param {object} object 对象
     * @param {string} name 属性名
     */
    function containsProperty(object, name) {
        let result = false;
        const search = (_object) => {
            if (ObjectUtil.isObject(_object)) {
                for (const key in _object) {
                    if (key === name) {
                        result = true;
                        return;
                    }
                    search(_object[key]);
                }
            }
            else if (Array.isArray(_object)) {
                for (let i = 0, l = _object.length; i < l; i++) {
                    search(_object[i]);
                }
            }
        };
        search(object);
        return result;
    }
    ObjectUtil.containsProperty = containsProperty;
    /**
     * 对象中是否包含指定的值
     * @param {object} object 对象
     * @param {any} value 值
     */
    function containsValue(object, value) {
        let result = false;
        const search = (_object) => {
            if (ObjectUtil.isObject(_object)) {
                for (const key in _object) {
                    if (_object[key] === value) {
                        result = true;
                        return;
                    }
                    search(_object[key]);
                }
            }
            else if (Array.isArray(_object)) {
                for (let i = 0, l = _object.length; i < l; i++) {
                    search(_object[i]);
                }
            }
        };
        search(object);
        return result;
    }
    ObjectUtil.containsValue = containsValue;
})(ObjectUtil || (exports.ObjectUtil = ObjectUtil = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LXV0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zb3VyY2Uvb2JqZWN0LXV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsSUFBaUIsVUFBVSxDQTREMUI7QUE1REQsV0FBaUIsVUFBVTtJQUN2Qjs7O09BR0c7SUFDSCxTQUFnQixRQUFRLENBQUMsR0FBUTtRQUM3QixPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxpQkFBaUIsQ0FBQztJQUNyRSxDQUFDO0lBRmUsbUJBQVEsV0FFdkIsQ0FBQTtJQUVEOzs7O09BSUc7SUFDSCxTQUFnQixnQkFBZ0IsQ0FBQyxNQUFXLEVBQUUsSUFBWTtRQUN0RCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUM1QixJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDeEIsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFLENBQUM7d0JBQ2YsTUFBTSxHQUFHLElBQUksQ0FBQzt3QkFDZCxPQUFPO29CQUNYLENBQUM7b0JBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixDQUFDO1lBQ0wsQ0FBQztpQkFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2YsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQW5CZSwyQkFBZ0IsbUJBbUIvQixDQUFBO0lBRUQ7Ozs7T0FJRztJQUNILFNBQWdCLGFBQWEsQ0FBQyxNQUFXLEVBQUUsS0FBVTtRQUNqRCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDbkIsTUFBTSxNQUFNLEdBQUcsQ0FBQyxPQUFZLEVBQUUsRUFBRTtZQUM1QixJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztnQkFDL0IsS0FBSyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztvQkFDeEIsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxFQUFFLENBQUM7d0JBQ3pCLE1BQU0sR0FBRyxJQUFJLENBQUM7d0JBQ2QsT0FBTztvQkFDWCxDQUFDO29CQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDekIsQ0FBQztZQUNMLENBQUM7aUJBQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7Z0JBQ2hDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNmLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFuQmUsd0JBQWEsZ0JBbUI1QixDQUFBO0FBQ0wsQ0FBQyxFQTVEZ0IsVUFBVSwwQkFBVixVQUFVLFFBNEQxQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBuYW1lc3BhY2UgT2JqZWN0VXRpbCB7XHJcbiAgICAvKipcclxuICAgICAqIOWIpOaWreaMh+WumuWAvOaYr+WQpuaYr+S4gOS4quWvueixoVxyXG4gICAgICogQHBhcmFtIHthbnl9IGFyZyDlj4LmlbBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KGFyZzogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmcpID09PSAnW29iamVjdCBPYmplY3RdJztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWvueixoeS4reaYr+WQpuWMheWQq+aMh+WumueahOWxnuaAp1xyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCDlr7nosaFcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOWxnuaAp+WQjVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY29udGFpbnNQcm9wZXJ0eShvYmplY3Q6IGFueSwgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHNlYXJjaCA9IChfb2JqZWN0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgaWYgKE9iamVjdFV0aWwuaXNPYmplY3QoX29iamVjdCkpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3Qga2V5IGluIF9vYmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoKF9vYmplY3Rba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShfb2JqZWN0KSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBfb2JqZWN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaChfb2JqZWN0W2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2VhcmNoKG9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWvueixoeS4reaYr+WQpuWMheWQq+aMh+WumueahOWAvFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iamVjdCDlr7nosaFcclxuICAgICAqIEBwYXJhbSB7YW55fSB2YWx1ZSDlgLxcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNvbnRhaW5zVmFsdWUob2JqZWN0OiBhbnksIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgY29uc3Qgc2VhcmNoID0gKF9vYmplY3Q6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoT2JqZWN0VXRpbC5pc09iamVjdChfb2JqZWN0KSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gX29iamVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfb2JqZWN0W2tleV0gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoKF9vYmplY3Rba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShfb2JqZWN0KSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSBfb2JqZWN0Lmxlbmd0aDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaChfb2JqZWN0W2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2VhcmNoKG9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxufSJdfQ==