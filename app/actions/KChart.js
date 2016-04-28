import Reflux from 'reflux';
import agent from 'superagent';
import promise from 'promise';
import agentPromise from 'superagent-promise';
import ErrorAction from './Error';
import config from '../config/config';

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
    request
        .get(config.kchartReqUrl)
        .query({label: label, kchart_type: type})
        .end()
        .then(
            (res)=>{
                var result = res.body;

                if(result.status == 200) {
                    this.completed(result.data);
                }
                else {
                    ErrorAction.customError(result.status, result.message);
                    this.failed(result);
                }
            },

            (err)=>{
                console.log(err.message);
                ErrorAction.connectionError('网络连接错误');
            }
        );
});

export default actions;