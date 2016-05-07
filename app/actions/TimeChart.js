import Reflux from 'reflux';
import agent from 'superagent';
import promise from 'promise';
import agentPromise from 'superagent-promise';

import timeCharts from '../data/timechart';

var request = agentPromise(agent, promise);

var actions = Reflux.createActions({
    getTimeCharts: {children: ["completed", "failed"]}
});

/**
 * 获取分时线数据
 * @param label string
 */
actions.getTimeCharts.listen(function(label) {
    this.completed(timeCharts);
});

export default actions;