import Reflux from 'reflux';
import agent from 'superagent';
import promise from 'promise';
import agentPromise from 'superagent-promise';

import kcharts from '../data/kchart';

var request = agentPromise(agent, promise);

var actions = Reflux.createActions({
    getKCharts: {children: ["completed", "failed"]}
});

/**
 * 获取K线数据
 * @param label string
 * @param type enum 5m|15m|30m|1h|1d|1w
 */
actions.getKCharts.listen(function(label, type) {
    //此处应从后端API获取实时数据
    this.completed(kcharts);
});

export default actions;