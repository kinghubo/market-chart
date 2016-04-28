import Reflux from 'reflux';
import KChartAction from '../actions/KChart';

var store = Reflux.createStore({
    listenables: [KChartAction],

    kcharts: null,

    onGetKChartsCompleted: function(data) {
        this.kcharts = data;
        this.trigger(this.kcharts);
    }
});

export default store;