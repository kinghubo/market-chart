import Reflux from 'reflux';
import TimeChartAction from '../actions/TimeChart';

var store = Reflux.createStore({
    listenables: [TimeChartAction],

    timeCharts: null,

    onGetTimeChartsCompleted: function(data) {
        this.timeCharts = data;
        this.trigger(this.timeCharts);
    }
});

export default store;