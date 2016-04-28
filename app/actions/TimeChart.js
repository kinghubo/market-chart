import Reflux from 'reflux';
import agent from 'superagent';
import promise from 'promise';
import agentPromise from 'superagent-promise';
import ErrorAction from './Error';
import config from '../config/config';

var request = agentPromise(agent, promise);

var actions = Reflux.createActions({
    getTimeCharts: {children: ["completed", "failed"]}
});

/**
 * 获取分时线数据
 * @param label string
 */
actions.getTimeCharts.listen(function(label) {
    request
        .get(config.timeChartReqUrl)
        .query({label: label})
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