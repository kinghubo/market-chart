import Reflux from 'reflux';
import ErrorAction from '../actions/Error';

var store = Reflux.createStore({
    listenables: [ErrorAction],

    type: '', //错误类型 CONNECTION-网络连接错误, HTTP-HTTP状态异常, CUSTOM-自定义错误

    code: 0, //HTTP状态码

    status: 0, //自定义状态码

    message: '', //错误信息

    onConnectionError: function(message) {
        this.type = 'CONNECTION';
        this.message = message;
        this.trigger({type: this.type, code: this.code, status: this.status, message: this.message});
    },

    onHTTPError: function(code, message) {
        this.type = 'HTTP';
        this.code = code;
        this.message = message;
        this.trigger({type: this.type, code: this.code, status: this.status, message: this.message});
    },

    onCustomError: function(status, message) {
        this.type = 'CUSTOM';
        this.status = status;
        this.message = message;
        this.trigger({type: this.type, code: this.code, status: this.status, message: this.message});
    }
});

export default store;