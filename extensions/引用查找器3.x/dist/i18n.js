"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.I18n = void 0;
const { translate } = require('./lib/eazax/i18n');
var I18n;
(function (I18n) {
    function t(key) {
        return translate(Editor.I18n.getLanguage(), key);
    }
    I18n.t = t;
})(I18n || (exports.I18n = I18n = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9pMThuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUVsRCxJQUFpQixJQUFJLENBS3BCO0FBTEQsV0FBaUIsSUFBSTtJQUVqQixTQUFnQixDQUFDLENBQUMsR0FBVztRQUN6QixPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFGZSxNQUFDLElBRWhCLENBQUE7QUFDTCxDQUFDLEVBTGdCLElBQUksb0JBQUosSUFBSSxRQUtwQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHsgdHJhbnNsYXRlIH0gPSByZXF1aXJlKCcuL2xpYi9lYXpheC9pMThuJyk7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIEkxOG4ge1xyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB0KGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRyYW5zbGF0ZShFZGl0b3IuSTE4bi5nZXRMYW5ndWFnZSgpLCBrZXkpO1xyXG4gICAgfVxyXG59Il19