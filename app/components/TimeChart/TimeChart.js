import React from 'react';
import echarts from 'echarts';

import './styles/timechart.less';

const seriesLineColor = ['#fda729', '#a5a5a5', '#38b6fc'];
const borderColor = '#eee';

export default class TimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    componentDidMount() {
        this.tchart = echarts.init(this.refs.tchart);

        window.onresize = function() {
            this.tchart.resize();
        }.bind(this);

        this.drawTimeChart();
    }

    componentWillReceiveProps(props) {
        if(this.state.data !== props.data) {
            this.setState({data: props.data});
            this.tchart.clear();
            this.drawTimeChart();
        }
    }

    drawTimeChart() {
        let data = this.state.data;

        //分时线数据系列
        let series  = {
            type: 'line',
            label: {
                normal: {
                    show: true,
                    position: 'inside'
                }
            },
            lineStyle: {
                normal: {
                    width: 1,
                    color: seriesLineColor[0]
                }
            },
            symbolSize: 2
        };
        console.log(data);
        series.data = data.prices.map((price)=>{
            return {
                value: price,
                label: {
                    normal: {show: false},
                    emphasis: {show: false}
                }
            };
        });

        //分时图配置
        var tchartOptions = {
            tooltip : {
                show: true,
                trigger: 'axis',
                axisPointer : {
                    type : 'line'
                },
                formatter: function(params) {
                    var time  = params[0].name;
                    var val   = params[0].value;

                    var html  = time + '<br/>' +
                        '价格: ' + val + '<br/>';
                    return html;
                }
            },
            grid: {
                left: '5px',
                right: '5px',
                top: '10px',
                bottom: '10px',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    axisTick : {show: false},
                    scale: true,
                    boundaryGap : true,
                    axisLabel: {
                        show: false,
                        margin: 8
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show:false,
                        onZero: true,
                        lineStyle: {
                            color: borderColor,
                            width: 1
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: borderColor
                        }
                    },
                    splitNumber: 2,
                    data : data.time
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    scale: true,
                    splitArea: {
                        show: false
                    },
                    axisLabel: {
                        inside: true,
                        margin: 4
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: borderColor
                        }
                    },
                    splitNumber: 2,
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: borderColor
                        }
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    y: '90%',
                    startValue: data.time.length > 500 ?  data.time.length - 500 : 0,
                    endValue: data.time.length
                }
            ],
            series : series
        };
        this.tchart.setOption(tchartOptions, true);
    }


    render() {
        return (
            <div className="time-chart">
                <div className="t-chart" ref="tchart"></div>
            </div>
        );
    }
}

