import React from 'react';
import Icon from 'react-fa';

import KChart from '../components/KChart';
import TimeChart from '../components/TimeChart';

import KChartAction from '../actions/KChart';
import TimeChartAction from '../actions/TimeChart';

import KChartStore from '../stores/KChart';
import TimeChartStore from '../stores/TimeChart';
import ErrorStore from '../stores/Error';

import './styles/index.less';

export default class index extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            chartType: '5m',
            kcharts: null,
            timeCharts: null,
            error: null
        };
    }

    componentDidMount() {
        this.unsubscribeKChartStore    = KChartStore.listen(this.onKChartStoreChange.bind(this));
        this.unsubscribeTimeChartStore = TimeChartStore.listen(this.onTimeChartStoreChange.bind(this));
        this.unsubscribeErrorStore     = ErrorStore.listen(this.onErrorStoreChange.bind(this));

        KChartAction.getKCharts(this.props.params.label, this.state.chartType);
    }

    componentWillUnmount() {
        this.unsubscribeKChartStore();
        this.unsubscribeTimeChartStore();
        this.unsubscribeErrorStore();
    }

    /**
     * 监听K线数据变化
     * @param data
     */
    onKChartStoreChange(data) {
        this.setState({kcharts: data, loading: false});
    }

    /**
     * 监听分时线数据变化
     * @param data
     */
    onTimeChartStoreChange(data) {
        this.setState({timeCharts: data, loading: false});
    }

    onErrorStoreChange(error) {
        this.setState({error: error, loading: false});
    }

    /**
     * 监听K线类型变化
     * @param type
     */
    onKChartTypeChange(type) {
        this.setState({chartType: type, loading: true}, function() {
            if(this.state.chartType == 'time') {
                TimeChartAction.getTimeCharts(this.props.params.label);
            }
            else {
                KChartAction.getKCharts(this.props.params.label, this.state.chartType);
            }
        });
    }

    render() {

        if(this.state.loading) {
            var content = <div className="loading"><Icon spin name="refresh"/></div>;
        }
        else if(this.state.error) {
            var content = <span className="error-msg">{this.state.error.message}</span>;
        }
        else if(this.state.chartType == 'time') {
            var content = <TimeChart data={this.state.timeCharts} />;
        }
        else {
            var content = <KChart data={this.state.kcharts} />;
        }

        return (
            <div className="k-chart-page">
                <nav id="nav">
                    <ul>
                        <li
                            className={this.state.chartType == 'time' ? "active" : ""}
                            onClick={this.onKChartTypeChange.bind(this, 'time')}>
                            分时
                        </li>
                        <li
                            className={this.state.chartType == '5m' ? "active" : ""}
                            onClick={this.onKChartTypeChange.bind(this, '5m')}>
                            5分
                        </li>
                        <li
                            className={this.state.chartType == '15m' ? "active" : ""}
                            onClick={this.onKChartTypeChange.bind(this, '15m')}>
                            15分
                        </li>
                        <li
                            className={this.state.chartType == '30m' ? "active" : ""}
                            onClick={this.onKChartTypeChange.bind(this, '30m')}>
                            30分
                        </li>
                        <li
                            className={this.state.chartType == '1h' ? "active" : ""}
                            onClick={this.onKChartTypeChange.bind(this, '1h')}>
                            1小时
                        </li>
                        <li
                            className={this.state.chartType == '1d' ? "active" : ""}
                            onClick={this.onKChartTypeChange.bind(this, '1d')}>
                            日线
                        </li>
                        <li
                            className={this.state.chartType == '1w' ? "active" : ""}
                            onClick={this.onKChartTypeChange.bind(this, '1w')}>
                            周线
                        </li>
                    </ul>
                </nav>


                {content}
            </div>
        );
    }
}