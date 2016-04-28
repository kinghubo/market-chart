import React from 'react';
import echarts from 'echarts';

import './styles/kchart.less';

const seriesLineColor = ['#0d6d11', '#c50a0a', '#166dc0'];            //系列线颜色
const seriesBarColor  = ['rgb(192, 231, 140)', 'rgb(246, 100, 70)'];  //系列柱颜色
const stickColor      = ['rgb(80, 174, 85)', 'rgb(252, 97, 100)'];    //阴阳线颜色
const borderColor     = '#eee';                                       //边线颜色

export default class KChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            indicator: 'macd',
            selectedIndex: props.data.time.length - 1
        };
    }

    componentDidMount() {
        this.kchart = echarts.init(this.refs.kchart);
        this.ichart = echarts.init(this.refs.ichart);

        echarts.connect([this.kchart, this.ichart]);

        window.onresize = function() {
            this.kchart.resize();
            this.ichart.resize();
        }.bind(this);
        this.drawKChart();
        this.drawIChart();
    }

    componentWillReceiveProps(props) {
        if(this.state.data !== props.data) {
            this.setState({data: props.data, selectedIndex: props.data.time.length - 1});
            this.kchart.clear();
            this.ichart.clear();
            this.drawKChart();
            this.drawIChart();
        }
    }

    drawIChart() {
        let data = this.state.data;

        //指标线数据系列
        let iSeries = data[this.state.indicator].map((item, index)=>{
            let type   = this.state.indicator == 'macd' && index == 2 ? 'bar' : 'line';

            let series = {
                type: type,
                label: {
                    normal: {
                        show: true,
                        position: 'inside'
                    }
                },
                symbolSize: 2
            };

            if(type == 'line') {
                series.lineStyle = {
                    normal: {
                        width: 1,
                        color: seriesLineColor[index]
                    }
                };

                series.data = item.map((v) => {
                    return {
                        value: v,
                        label: {
                            normal: {show: false},
                            emphasis: {show: false}
                        }
                    };
                })
            }
            else {
                series.data = item.map((v) => {
                    return {
                        value: v,
                        label: {
                            normal: {show: false},
                            emphasis: {show: false}
                        },
                        itemStyle: {
                            normal: {
                                color: v > 0 ? seriesBarColor[0] : seriesBarColor[1]
                            }
                        }
                    };
                })
            }
            return series;
        });

        //指标图配置
        var ichartOptions = {
            tooltip : {
                show: false,
                trigger: 'axis',
                axisPointer : {
                    type : 'line'
                },
                backgroundColor: 'transparent',
                textStyle: {
                    color: 'transparent'
                },
                formatter: function(params) {
                    this.setState({selectedIndex: params[0].dataIndex});
                }.bind(this)
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
                    startValue: data.time.length > 50 ?  data.time.length - 50 : 0,
                    endValue: data.time.length
                }
            ],
            series : iSeries
        };
        this.ichart.setOption(ichartOptions, true);
    }

    drawKChart() {
        let data = this.state.data;

        //K线数据系列
        let kSeries = [
            {
                name: 'kchart',
                type: 'candlestick',
                itemStyle: {
                    normal: {
                        color: stickColor[1],
                        color0: stickColor[0],
                        borderColor: stickColor[1],
                        borderColor0: stickColor[0],
                    }
                },
                data: data.k.map(function(item) { return [item[0], item[3], item[2], item[1]]; })
            }
        ];

        //sma数据系列
        let smaSeries = data.sma.map((item, index)=>{
            return {
                type: 'line',
                data: item,
                lineStyle: {
                    normal: {
                        width: 1,
                        color: seriesLineColor[index]
                    }
                },
                symbolSize: 2
            };
        });


        //K线图配置
        let kchartOptions = {
            tooltip: {
                trigger: 'axis',
                triggerOn: 'click',
                axisPointer: {
                    type: 'line'
                },

                formatter: function(params) {
                    var time  = params[0].name;
                    var kd    = params[0].data;

                    this.setState({selectedIndex: params[0].dataIndex});

                    var html  = time + '<br/>' +
                        '开盘: ' + kd[0] + '<br/>' +
                        '最高: ' + kd[3] + '<br/>' +
                        '最低: ' + kd[2] + '<br/>' +
                        '收盘: ' + kd[1] + '<br/>';
                    return html;
                }.bind(this)
            },
            grid: {
                left: '5px',
                right: '5px',
                top: '10px',
                bottom: '10px',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: data.time,
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
                    onZero: false,
                    lineStyle: {
                        color: borderColor,
                        width: 1
                    }
                },
                splitLine: {
                    show: true,
                    interval: 10,
                    lineStyle: {
                        color: borderColor
                    }
                },
                splitNumber: 5,
            },
            yAxis: {
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
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: borderColor
                    }
                }
            },
            dataZoom: [
                {
                    type: 'inside',
                    y: '90%',
                    startValue: data.time.length > 50 ?  data.time.length - 50 : 0,
                    endValue: data.time.length
                }
            ],
            series: kSeries.concat(smaSeries)
        };

        this.kchart.setOption(kchartOptions, true);
    }

    /**
     * 监听指标变化
     * @param indicator
     */
    onIndicatorChange(indicator) {
        this.setState({indicator: indicator}, function() {
            this.drawIChart();
        });
    }

    render() {


        const data = this.state.data;
        const sma  = data.sma.map((item) => {
            return item[this.state.selectedIndex];
        });

        let indicatorVals = [];
        switch(this.state.indicator) {
            case 'macd':
                indicatorVals[0] = 'MACD(12,26,9)=' + data[this.state.indicator][0][this.state.selectedIndex];
                indicatorVals[1] = 'DIFF=' + data[this.state.indicator][1][this.state.selectedIndex];
                indicatorVals[2] = 'DEA=' + data[this.state.indicator][2][this.state.selectedIndex];
                break;
            case 'boll':
                indicatorVals[0] = 'MA=' + data[this.state.indicator][0][this.state.selectedIndex];
                indicatorVals[1] = 'UP=' + data[this.state.indicator][1][this.state.selectedIndex];
                indicatorVals[2] = 'DN=' + data[this.state.indicator][2][this.state.selectedIndex];
                break;
            case 'kdj':
                indicatorVals[0] = 'K=' + data[this.state.indicator][0][this.state.selectedIndex];
                indicatorVals[1] = 'D=' + data[this.state.indicator][1][this.state.selectedIndex];
                indicatorVals[2] = 'J=' + data[this.state.indicator][2][this.state.selectedIndex];
                break;
            case 'rsi':
                indicatorVals[0] = 'RSI6=' + data[this.state.indicator][0][this.state.selectedIndex];
                indicatorVals[1] = 'RSI12=' + data[this.state.indicator][1][this.state.selectedIndex];
                break;
        }

        indicatorVals = indicatorVals.map((v, i)=>{
            return <span key={i}>{v}</span>;
        });

        return (
            <div className="kchart">
                <div className="indicator-vals">
                    <span>SMA5={sma[0]}</span>
                    <span>SMA10={sma[1]}</span>
                    <span>SMA20={sma[2]}</span>
                </div>

                <div className="k-chart" ref="kchart"></div>

                <ul className="indicators">
                    <li
                        className={this.state.indicator == 'macd' ? "active" : ""}
                        onClick={this.onIndicatorChange.bind(this, 'macd')}>
                        MACD
                    </li>
                    <li
                        className={this.state.indicator == 'boll' ? "active" : ""}
                        onClick={this.onIndicatorChange.bind(this, 'boll')}>
                        BOLL
                    </li>
                    <li
                        className={this.state.indicator == 'kdj' ? "active" : ""}
                        onClick={this.onIndicatorChange.bind(this, 'kdj')}>
                        KDJ
                    </li>
                    <li className={this.state.indicator == 'rsi' ? "active" : ""}
                        onClick={this.onIndicatorChange.bind(this, 'rsi')}>
                        RSI
                    </li>
                </ul>

                <div className="indicator-vals">
                    {indicatorVals}
                </div>

                <div className="indicator-chart" ref="ichart"></div>
            </div>
        );
    }
}

