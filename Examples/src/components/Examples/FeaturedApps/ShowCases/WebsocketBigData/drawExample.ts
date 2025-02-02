import * as socketIOClient from "socket.io-client";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { LayoutManager } from "scichart/Charting/LayoutManager/LayoutManager";
import { RightAlignedOuterVerticallyStackedAxisLayoutStrategy } from "scichart/Charting/LayoutManager/RightAlignedOuterVerticallyStackedAxisLayoutStrategy";
import { BaseDataSeries, IBaseDataSeriesOptions } from "scichart/Charting/Model/BaseDataSeries";
import { XyCustomFilter } from "scichart/Charting/Model/Filters/XyCustomFilter";
import { EDataSeriesField } from "scichart/Charting/Model/Filters/XyFilterBase";
import { EDataSeriesType } from "scichart/Charting/Model/IDataSeries";
import { OhlcDataSeries } from "scichart/Charting/Model/OhlcDataSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XyTextDataSeries } from "scichart/Charting/Model/XyTextDataSeries";
import { XyyDataSeries } from "scichart/Charting/Model/XyyDataSeries";
import { XyzDataSeries } from "scichart/Charting/Model/XyzDataSeries";
import { AUTO_COLOR } from "scichart/Charting/Themes/IThemeProvider";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { INumericAxisOptions, NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { BaseRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/BaseRenderableSeries";
import { FastBandRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { FastBubbleRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import { FastCandlestickRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastCandlestickRenderableSeries";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { FastTextRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastTextRenderableSeries";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { StackedColumnCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedColumnCollection";
import { StackedColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries";
import { StackedMountainCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainCollection";
import { StackedMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { ESeriesType } from "scichart/types/SeriesType";
import { SCRTDoubleVector, TSciChart } from "scichart/types/TSciChart";
import { appTheme } from "../../../theme";
import { BoxAnnotation, EXyDirection } from "scichart";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { fail } from "assert";
import { max } from "rxjs";

export type TMessage = {
    title: string;
    detail: string;
};

export type TControls = {
    startStreaming: () => void;
    stopStreaming: () => void;
    updateSettings: (newValues: ISettings) => void;
};

export type TRes = {
    wasmContext: TSciChart;
    sciChartSurface: SciChartSurface;
    controls: TControls;
}

export interface ISettings {
    seriesCount?: number;
    pointsOnChart?: number;
    pointsPerUpdate?: number;
    sendEvery?: number;
    initialPoints?: number;
    modelType?: string;
    productId?: number;
    fMode?: number;
}

export const divElementId = "chart";

let loadCount: number = 0;
let loadTimes: number[];
let avgLoadTime: number = 0;
let avgRenderTime: number = 0;
let gWasmContext_: TSciChart = null;
let gSciChartSurface_: SciChartSurface = null;

// get complementary color for hight contrast
function getCoColor(colorString: string) { // no alpha ex) "#ff00ff"
    const a = parseInt(colorString.slice(1,6), 16);
    const coColorStr = "#" + (0xffffff ^ a).toString(16).padStart(6, '0');
    return coColorStr;
}

function GetRandomData(xValues: number[], positive: boolean) {
    let prevYValue = Math.random();
    const yValues: number[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let j = 0; j < xValues.length; j++) {
        const change = Math.random() * 10 - 5;
        prevYValue = positive ? Math.abs(prevYValue + change) : prevYValue + change;
        yValues.push(prevYValue);
    }
    return yValues;
}

const extendRandom = (val: number, max: number) => val + Math.random() * max;

const generateCandleData = (xValues: number[]) => {
    let open = 10;
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    const closeValues = [];

    for (let i = 0; i < xValues.length; i++) {
        const close = open + Math.random() * 10 - 5;
        const high = Math.max(open, close);
        highValues.push(extendRandom(high, 5));
        const low = Math.min(open, close);
        lowValues.push(extendRandom(low, -5));
        closeValues.push(close);
        openValues.push(open);
        open = close;
    }
    return { openValues, highValues, lowValues, closeValues };
};

const generateCandleDataForAppendRange = (open: number, closeValues: number[]) => {
    const openValues = [];
    const highValues = [];
    const lowValues = [];
    for (const close of closeValues) {
        openValues.push(open);
        const high = Math.max(open, close);
        highValues.push(extendRandom(high, 5));
        const low = Math.min(open, close);
        lowValues.push(extendRandom(low, -5));
        open = close;
    }
    return { openValues, highValues, lowValues, closeValues };
};

const dsOptions: IBaseDataSeriesOptions = {
    isSorted: true,
    containsNaN: false
};

const createRenderableSeries = (
    wasmContext: TSciChart,
    seriesType: ESeriesType,
    dataStreamName: string
): { dataSeries: BaseDataSeries; rendSeries: BaseRenderableSeries } => {
    if (seriesType === ESeriesType.LineSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        const rendSeries: FastLineRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            stroke: AUTO_COLOR,
            strokeThickness: 3,
            opacity: 0.8
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.BandSeries) {
        const dataSeries: XyyDataSeries = new XyyDataSeries(wasmContext, dsOptions);
        const rendSeries: FastBandRenderableSeries = new FastBandRenderableSeries(wasmContext, {
            stroke: AUTO_COLOR,
            strokeY1: AUTO_COLOR,
            fill: AUTO_COLOR,
            fillY1: AUTO_COLOR,
            dataSeries,
            strokeThickness: 2,
            opacity: 0.8
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.ColumnSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        dataSeries.dataSeriesName = dataStreamName;
        const rendSeries: FastColumnRenderableSeries = new FastColumnRenderableSeries(wasmContext, {
            fill: AUTO_COLOR,
            stroke: AUTO_COLOR,
            dataSeries,
            strokeThickness: 1
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.StackedMountainSeries) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext, dsOptions);
        const rendSeries: StackedMountainRenderableSeries = new StackedMountainRenderableSeries(wasmContext, {
            stroke: AUTO_COLOR,
            fill: AUTO_COLOR,
            dataSeries
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.ScatterSeries) {
        const dataSeries: XyyDataSeries = new XyyDataSeries(wasmContext, { containsNaN: false });
        // Use Y and Y1 as X and Y for scatter
        const filteredSeries: XyDataSeries = new XyCustomFilter(dataSeries, {
            xField: EDataSeriesField.Y,
            field: EDataSeriesField.Y1
        });
        const rendSeries: XyScatterRenderableSeries = new XyScatterRenderableSeries(wasmContext, {
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 9,
                height: 9,
                strokeThickness: 2,
                fill: AUTO_COLOR,
                stroke: AUTO_COLOR,
                opacity: 0.8
            }),
            dataSeries: filteredSeries
        });
        // return the unfiltered xyy series as that is the one we want to append to
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.CandlestickSeries) {
        const dataSeries: OhlcDataSeries = new OhlcDataSeries(wasmContext, dsOptions);
        const rendSeries: FastCandlestickRenderableSeries = new FastCandlestickRenderableSeries(wasmContext, {
            strokeThickness: 1,
            dataSeries,
            dataPointWidth: 0.9,
            opacity: 0.75,
            strokeUp: AUTO_COLOR,
            brushUp: AUTO_COLOR,
            strokeDown: AUTO_COLOR,
            brushDown: AUTO_COLOR
        });
        return { dataSeries, rendSeries };
    } else if (seriesType === ESeriesType.TextSeries) {
        const dataSeries: XyTextDataSeries = new XyTextDataSeries(wasmContext, dsOptions);
        const rendSeries: FastTextRenderableSeries = new FastTextRenderableSeries(wasmContext, {
            dataSeries,
            dataLabels: {
                style: {
                    fontFamily: "Arial",
                    fontSize: 6
                },
                color: AUTO_COLOR,
                calculateTextBounds: false
            }
        });
        return { dataSeries, rendSeries };
    }
    return { dataSeries: undefined, rendSeries: undefined };
};

const prePopulateData = (
    dataSeries: BaseDataSeries,
    dataSeriesType: EDataSeriesType,
    xValues: number[],
    positive: boolean
) => {
    const yValues: number[] = GetRandomData(xValues, positive);
    switch (dataSeriesType) {
        case EDataSeriesType.Xy:
            (dataSeries as XyDataSeries).appendRange(xValues, yValues);
            break;
        case EDataSeriesType.Xyy:
            (dataSeries as XyyDataSeries).appendRange(xValues, yValues, GetRandomData(xValues, positive));
            break;
        case EDataSeriesType.Xyz:
            (dataSeries as XyzDataSeries).appendRange(
                xValues,
                yValues,
                GetRandomData(xValues, positive).map(z => Math.abs(z / 5))
            );
            break;
        case EDataSeriesType.Ohlc:
            const { openValues, highValues, lowValues, closeValues } = generateCandleData(xValues);
            (dataSeries as OhlcDataSeries).appendRange(xValues, openValues, highValues, lowValues, closeValues);
            break;
        case EDataSeriesType.XyText:
            (dataSeries as XyTextDataSeries).appendRange(
                xValues,
                yValues,
                yValues.map(textval => textval.toFixed())
            );
            break;
        default:
            break;
    }
};

function rescalingFailureData(dataSeries:BaseDataSeries, failures: number[]){
    if (gWasmContext_ == null)
        return null;

    const minmax = gWasmContext_.NumberUtil.MinMax(dataSeries.getNativeYValues());
    const absMax = Math.max(Math.abs(minmax.maxD), Math.abs(minmax.minD));
    for (let i = 0; i < failures.length; i++) {
        if ( failures[i] == 0 )
            failures[i] = 0;
        else
            failures[i] = absMax;
    }

    return failures;
}

function addAnnotationBar(
    rendSeries: BaseRenderableSeries,
    startX: number,
    endX: number
){
    // console.log("addAnnotionBar(sX: %d, eX: %d)", startX, endX);

    if (startX >= endX) {
        console.log("addAnnotionBar(sX: %d, eX: %d)", startX, endX);
        return;
    }

    // Add box annotiation
    const boxAnnotation = new BoxAnnotation({
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 0,
        fill: appTheme.VividSkyBlue + "33",
        xCoordinateMode: ECoordinateMode.DataValue,
        x1: 0,
        x2: 0,
        yCoordinateMode: ECoordinateMode.Relative,
        y1: 0,
        y2: 1,
    });
    boxAnnotation.x1 = startX;
    boxAnnotation.x2 = endX;
    boxAnnotation.yAxisId = rendSeries.yAxisId;

    boxAnnotation.resizeDirections = EXyDirection.YDirection;
    
    // const useNativeYValues: boolean = false;
    // if (useNativeYValues) {
    //     const yRange = gWasmContext_.NumberUtil.MinMax(rendSeries.dataSeries.getNativeYValues());
    //     boxAnnotation.y1 = yRange.minD;
    //     boxAnnotation.y2 = yRange.maxD;

    // } else {
    //     const yRange = rendSeries.dataSeries.getWindowedYRange(rendSeries.xAxis.visibleRange,false,false);
    //     boxAnnotation.y1 = yRange.min;
    //     boxAnnotation.y2 = yRange.max;
    // }
    // boxAnnotation.yCoordinateMode = ECoordinateMode.DataValue;

    const strokeColor = (rendSeries as FastColumnRenderableSeries).stroke;
    boxAnnotation.fill = getCoColor(strokeColor) + '88';
    boxAnnotation.stroke = boxAnnotation.fill;

    console.log("Added AnnoBox():  -> %d, %d, %d, %d, %s", 
        boxAnnotation.x1, boxAnnotation.x2, 
        boxAnnotation.y1, boxAnnotation.y2,
        boxAnnotation.yAxisId
    );
    if ( gSciChartSurface_ != null && gSciChartSurface_ != undefined)
        gSciChartSurface_.annotations.add(boxAnnotation);

}
function deleteAnnotationBoxOutOfRange() {
    const anns = gSciChartSurface_.annotations;
    const count = anns.size();
    const renderSeries = gSciChartSurface_.renderableSeries.get(0);
    const xRange = renderSeries.dataSeries.getIndicesRange(renderSeries.xAxis.visibleRange);
    const xMin = xRange.min;
    const xMax = xRange.max;
    for (let i = count-1; i >= 0; i--) {
        const ann = anns.get(i);
        if ( ann.x1 < xMin && ann.x2 < xMin) {
            console.log("ab out of range: (%d, %d) -- (%d, %d)", ann.x1, ann.x2, xMin, xMax);
            ann.delete();
            anns.remove(ann);
        }
    }
}

function addAnnotionBars(
    rendSeries: BaseRenderableSeries,
    xValues: number[],
    failures: number[]
    ) {

    // console.log("addAnnotionBars():" + rendSeries);
    let startX: number = -1;
    let endX: number = -1;
    let foundStartX = false;
    let foundEndX = false;
    for (let i = 0; i < failures.length; i++) {
        // seek first non-zero value
        if (foundStartX == false) {
            if (foundEndX == false) {
                if (failures[i] > 0) {
                    // found
                    startX = xValues[i];
                    foundStartX = true;
                } else {
                    // just skip
                }
            } else {
                // impossible
            }
        } else {
            if (foundEndX == false) {
                if (failures[i] > 0) {
                    endX = xValues[i];
                } else {
                    // found interval
                    // console.log("Adding aB in normal mode:");
                    addAnnotationBar(rendSeries, startX, endX);
                    foundStartX = false;
                    foundEndX = false;
                }
            } else {

            }

        }
    }

    // if box is not terminated yet
    if (foundStartX == true && foundEndX == false) {
        console.log("Adding whole ab..");
        if (endX == -1) {
            endX = xValues[failures.length-1];
        }
        addAnnotationBar(rendSeries, startX, endX);
    }

}
const appendData = (
    dataSeries: BaseDataSeries,
    dataSeriesType: EDataSeriesType,
    index: number,
    xValues: number[],
    yArray: number[][],
    pointsOnChart: number,
    pointsPerUpdate: number,
    dataSeriesCompanion?: BaseDataSeries,
    failures?: number[]
) => {
    switch (dataSeriesType) {
        case EDataSeriesType.Xy:
            const xySeries = dataSeries as XyDataSeries;
            xySeries.appendRange(xValues, yArray[index]);
            if (xySeries.count() > pointsOnChart) {
                xySeries.removeRange(0, pointsPerUpdate);
            }

            // failures = rescalingFailureData(dataSeries, failures);
            const xySeriesCompanion = dataSeriesCompanion as XyDataSeries;
            xySeriesCompanion.appendRange(xValues, failures)
            if (xySeriesCompanion.count() > pointsOnChart) {
                xySeriesCompanion.removeRange(0, pointsPerUpdate);
            }
            
            break;
        case EDataSeriesType.Xyy:
            const xyySeries = dataSeries as XyyDataSeries;
            xyySeries.appendRange(xValues, yArray[2 * index], yArray[2 * index + 1]);
            if (xyySeries.count() > pointsOnChart) {
                xyySeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.Xyz:
            const xyzSeries = dataSeries as XyzDataSeries;
            xyzSeries.appendRange(
                xValues,
                yArray[2 * index],
                yArray[2 * index + 1].map(z => Math.abs(z / 5))
            );
            if (xyzSeries.count() > pointsOnChart) {
                xyzSeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.Ohlc:
            const ohlcSeries = dataSeries as OhlcDataSeries;
            const { openValues, highValues, lowValues, closeValues } = generateCandleDataForAppendRange(
                ohlcSeries.getNativeCloseValues().get(ohlcSeries.count() - 1),
                yArray[index]
            );
            ohlcSeries.appendRange(xValues, openValues, highValues, lowValues, closeValues);
            if (ohlcSeries.count() > pointsOnChart) {
                ohlcSeries.removeRange(0, pointsPerUpdate);
            }
            break;
        case EDataSeriesType.XyText:
            const xytextSeries = dataSeries as XyTextDataSeries;
            xytextSeries.appendRange(
                xValues,
                yArray[index],
                yArray[index].map(obj => obj.toFixed())
            );
            if (xytextSeries.count() > pointsOnChart) {
                xytextSeries.removeRange(0, pointsPerUpdate);
            }
            break;
        default:
            break;
    }
};

const axisOptions: INumericAxisOptions = {
    drawMajorBands: false,
    drawMinorGridLines: false,
    drawMinorTickLines: false,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0
};

export const drawExample = async (updateMessages: (newMessages: TMessage[]) => void, seriesType: ESeriesType) => {
    let seriesCount = 4;
    let pointsOnChart = 1000;
    let pointsPerUpdate = 100;
    let sendEvery = 30;
    let initialPoints: number = 0;
    let modelType = 'gear';
    let productId = 15;
    let fMode = 0;

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });
    gWasmContext_ = wasmContext;
    gSciChartSurface_ = sciChartSurface;
    const xAxis = new NumericAxis(wasmContext, axisOptions);
    sciChartSurface.xAxes.add(xAxis);
    let yAxis = new NumericAxis(wasmContext, { ...axisOptions });
    sciChartSurface.yAxes.add(yAxis);
    let dataSeriesArray: BaseDataSeries[];
    let dataSeriesArrayCompanion: BaseDataSeries[];
    let dataSeriesType = EDataSeriesType.Xy;
    if (seriesType === ESeriesType.BubbleSeries) {
        dataSeriesType = EDataSeriesType.Xyz;
    } else if (seriesType === ESeriesType.BandSeries || seriesType === ESeriesType.ScatterSeries) {
        dataSeriesType = EDataSeriesType.Xyy;
    } else if (seriesType === ESeriesType.CandlestickSeries) {
        dataSeriesType = EDataSeriesType.Ohlc;
    } else if (seriesType === ESeriesType.TextSeries) {
        dataSeriesType = EDataSeriesType.XyText;
    }



    const getGearDataStreamNames = () => {
        const names = [
            "Vibration",
            "Carrier RPM",
            "Sun gear RPM",
            "Fault stage"
        ] as const;

        return names;
    }

    const getPumpDataStreamNames = () => {
        const names = [
            "Pressure",
            "Pump Flowrate",
            "Actuator Input Signal",

            "Swash Plate Angle",
            "Pump Internal Flowrate",
            "Swash Plate Angle",
            "Spring Displacement",
            "Pump Inlet Pressue"
        ] as const;

        return names;
    }

    const getDataStreamNames = () => {
        if (modelType == 'pump')
            return getPumpDataStreamNames();
        return getGearDataStreamNames();
    }

    const changeDataStreamNames = () => {
        if (dataSeriesArray == undefined || dataSeriesArray.length == 0 )
            return;

        const names = getDataStreamNames();

        for (let i = 0; i < seriesCount; i++) {
            if ( i == seriesCount - 1 ) { // fault case
                if (modelType === 'pump') {
                    dataSeriesArray[i].dataSeriesName = names[ i+fMode ];
                }
            } else
                dataSeriesArray[i].dataSeriesName = names[i];


            
        }
        
    }

    const resetChart = () => {
        sciChartSurface.renderableSeries.asArray().forEach(rs => rs.delete());
        sciChartSurface.renderableSeries.clear();
        sciChartSurface.chartModifiers.asArray().forEach(cm => cm.delete());
        sciChartSurface.chartModifiers.clear();
        sciChartSurface.yAxes.asArray().forEach(ya => ya.delete());
        sciChartSurface.yAxes.clear();
        sciChartSurface.annotations.asArray().forEach(ann => ann.delete());
        sciChartSurface.annotations.clear();
    }
    const initChart = () => {
        resetChart();

        sciChartSurface.layoutManager = new LayoutManager();
        yAxis = new NumericAxis(wasmContext, { ...axisOptions });
        sciChartSurface.yAxes.add(yAxis);
        dataSeriesArray = new Array<BaseDataSeries>(seriesCount);
        dataSeriesArrayCompanion = new Array<BaseDataSeries>(seriesCount);
        let stackedCollection: IRenderableSeries;
        let xValues: number[];
        const positive = [ESeriesType.StackedColumnSeries, ESeriesType.StackedMountainSeries].includes(seriesType);
        let dataStreamName = getDataStreamNames();
        for (let i = 0; i < seriesCount; i++) {
            const { dataSeries, rendSeries } = createRenderableSeries(wasmContext, seriesType, dataStreamName[i]);
            const companionData = createRenderableSeries(wasmContext, seriesType, "");
            const dataSeriesCompanion = companionData.dataSeries;
            const rendSeriesCompanion = companionData.rendSeries;
            let strokeColor : string = (rendSeriesCompanion as FastColumnRenderableSeries).stroke.slice(3,9);
            strokeColor = "#" + "55" + strokeColor;
            (rendSeriesCompanion as FastColumnRenderableSeries).stroke = strokeColor;
            dataSeriesArray[i] = dataSeries;
            dataSeriesArrayCompanion[i] = dataSeriesCompanion;
            if (seriesType === ESeriesType.StackedColumnSeries) {
                if (i === 0) { 
                    stackedCollection = new StackedColumnCollection(wasmContext, { dataPointWidth: 1 });
                    sciChartSurface.renderableSeries.add(stackedCollection);
                }
                (rendSeries as StackedColumnRenderableSeries).stackedGroupId = i.toString();
                (stackedCollection as StackedColumnCollection).add(rendSeries as StackedColumnRenderableSeries);
            } else if (seriesType === ESeriesType.StackedMountainSeries) {
                if (i === 0) {
                    stackedCollection = new StackedMountainCollection(wasmContext);
                    sciChartSurface.renderableSeries.add(stackedCollection);
                }
                (stackedCollection as StackedMountainCollection).add(rendSeries as StackedMountainRenderableSeries);
            } else if (seriesType === ESeriesType.ColumnSeries) {
                // create stacked y axis
                if (i === 0) {
                    // tslint:disable-next-line: max-line-length
                    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
                        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();
                    yAxis.id = "0";
                    yAxis.axisBorder.borderTop = 1;
                    yAxis.axisBorder.borderBottom = 1;
                } else {
                    const yAxis = new NumericAxis(wasmContext, {
                        id: i.toString(),
                        ...axisOptions
                    });
                    sciChartSurface.yAxes.add(yAxis);
                    yAxis.axisBorder.borderTop = 1;
                    yAxis.axisBorder.borderBottom = 1;
                }
                rendSeries.yAxisId = i.toString();
                sciChartSurface.renderableSeries.add(rendSeries);
                // rendSeriesCompanion.yAxisId = i.toString();
                // sciChartSurface.renderableSeries.add(rendSeriesCompanion);

            } else {
                sciChartSurface.renderableSeries.add(rendSeries);
            }

            if (i === 0) {
                xValues = Array.from(Array(initialPoints).keys());
            }
            // Generate points
            prePopulateData(dataSeries, dataSeriesType, xValues, positive);
            sciChartSurface.zoomExtents(0);
        }

    

        // add the legend modifier and show legend in the top left
        const legendModifier = new LegendModifier({
            showLegend: true,
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showCheckboxes: true,
            showSeriesMarkers: true
        });

        sciChartSurface.chartModifiers.add(legendModifier);

        return positive;
    };

    const dataBuffer: { x: number[]; ys: number[][];  sendTime: number; failures: number[]; }[] = [];
    let isRunning: boolean = false;
    const newMessages: TMessage[] = [];
    let loadStart = 0;

    const loadData = (data: { x: number[]; ys: number[][]; sendTime: number; failures: number[] }) => {
        // dropping sendTime.
        loadStart = new Date().getTime();
        for (let i = 0; i < seriesCount; i++) {
            appendData(dataSeriesArray[i], dataSeriesType, i, data.x, data.ys, pointsOnChart, pointsPerUpdate, dataSeriesArrayCompanion[i], data.failures);
            // console.log("Adding annotion bars on channel: %d", 2*i);
        }
        addAnnotionBars((gSciChartSurface_.renderableSeries.get(0) as BaseRenderableSeries), data.x, data.failures);
        // deleteAnnotationBoxOutOfRange();
        sciChartSurface.zoomExtents(0);
    };

    sciChartSurface.preRender.subscribe(() => {
        // console.log("on preRender: ");
        // // Adjust box height
        // if( sciChartSurface.annotations.size() > 0) {
        //     for (let i=0; i < sciChartSurface.annotations.size(); i++) {
        //         const boxAnnotation = sciChartSurface.annotations.get(i) as BoxAnnotation;
        //         const yRange = dataSeriesArray[i].getWindowedYRange(xAxis.visibleRange,false);
        //         boxAnnotation.y1 = yRange.min;
        //         boxAnnotation.y2 = yRange.max;
        //         // FIXME: read fMode and adjust box width
        //         boxAnnotation.x1 = 4000 + 1000*(i+2);
        //         boxAnnotation.x2 = boxAnnotation.x1 + 100;

        //         const strokeColor = (sciChartSurface.renderableSeries.get(i) as FastColumnRenderableSeries).stroke;
        //         boxAnnotation.fill = getCoColor(strokeColor) + '88';
        //     }
        //     // console.log("on preRender: moving annotation");
        // }

    });

    sciChartSurface.rendered.subscribe(() => {
        if (!isRunning || loadStart === 0) return;
        let date = new Date();
        const reDrawTime = date.getTime() - loadStart;
        date = null;
        avgRenderTime = (avgRenderTime * loadCount + reDrawTime) / (loadCount + 1);
        newMessages.push({
            title: `Average Render Time `,
            detail: `${avgRenderTime.toFixed(2)} ms`
        });
        newMessages.push({
            title: `Max FPS `,
            detail: `${Math.min(60, 1000 / avgRenderTime).toFixed(1)}`
        });
        updateMessages(newMessages);
        newMessages.length = 0;
    });

    const loadFromBuffer = () => {
        if (dataBuffer.length > 0) {
            const x: number[] = dataBuffer[0].x;
            const ys: number[][] = dataBuffer[0].ys;
            const sendTime = dataBuffer[0].sendTime;
            const failures: number[] = dataBuffer[0].failures;
            for (let i = 1; i < dataBuffer.length; i++) {
                const el = dataBuffer[i];
                x.push(...el.x);
                for (let y = 0; y < el.ys.length; y++) {
                    ys[y].push(...el.ys[y]);
                }
                failures.push(...el.failures);
            }
            loadData({ x, ys, sendTime, failures });
            dataBuffer.length = 0;
        }
        if (isRunning) {
            setTimeout(loadFromBuffer, 1);
        }
    };

    let socket: socketIOClient.Socket;

    const initWebSocket = (positive: boolean) => {
        if (socket) {
            socket.disconnect();
            socket.connect();
        } else {
            if (window.location.hostname === "localhost" && parseInt(window.location.port) > 8000) {
                socket = socketIOClient.io("http://localhost:3000");
                console.log("3000");
            } else {
                socket = socketIOClient.io();
                console.log("local");
            }
            socket.on("data", (message: any) => {
                // console.log("socket.on() :data : " + message);
                dataBuffer.push(message);
            });
            socket.on("finished", () => {
                socket.disconnect();
            });
        }
        
        // If initial data has been generated, this should be an array of the last y values of each series
        const index = dataSeriesArray[0].count() - 1;
        let series: number[];
        if (
            dataSeriesType === EDataSeriesType.Xy ||
            dataSeriesType === EDataSeriesType.Ohlc ||
            dataSeriesType === EDataSeriesType.XyText
        ) {
            if (index >= 0) {
                series = dataSeriesArray.map(d => d.getNativeYValues().get(index));
            } else {
                series = Array.from(Array(seriesCount)).fill(0);
            }
        } else if (dataSeriesType === EDataSeriesType.Xyy) {
            if (index >= 0) {
                series = [];
                for (const dataSeries of dataSeriesArray) {
                    const xyy = dataSeries as XyyDataSeries;
                    series.push(xyy.getNativeYValues().get(index));
                    series.push(xyy.getNativeY1Values().get(index));
                }
            } else {
                series = Array.from(Array(seriesCount * 2)).fill(0);
            }
        } else if (dataSeriesType === EDataSeriesType.Xyz) {
            if (index >= 0) {
                series = [];
                for (const dataSeries of dataSeriesArray) {
                    const xyy = dataSeries as XyzDataSeries;
                    series.push(xyy.getNativeYValues().get(index));
                    series.push(xyy.getNativeZValues().get(index));
                }
            } else {
                series = Array.from(Array(seriesCount * 2)).fill(0);
            }
        }
        console.log("socket.emit>getData(): startX = %d", (index+1) );
        socket.emit("getData", { series, startX: index + 1, pointsPerUpdate, sendEvery, positive, scale: 10, modelType, productId, fMode });
        console.log("drawExample.getData(__, %d, %d, %d, %d, %d, %s, %d, %d)", 
            (index + 1), pointsPerUpdate, sendEvery, positive, 10, modelType, productId, fMode );
        isRunning = true;
        loadFromBuffer();
    };

    const settings = {
        seriesCount: 4,
        pointsOnChart: 5000,
        pointsPerUpdate: 10,
        sendEvery: 100,
        initialPoints: 5000,
        modelType: "gear",
        productId: 15,
        fMode: 0
    };

    const updateSettings = (newValues: ISettings) => {
        Object.assign(settings, newValues);
        changeDataStreamNames();
    };

    // Buttons for chart
    const startStreaming = () => {
        console.log("start streaming");
        loadCount = 0;
        avgLoadTime = 0;
        avgRenderTime = 0;
        loadTimes = [];
        loadStart = 0;
        seriesCount = settings.seriesCount;
        initialPoints = settings.initialPoints;
        pointsOnChart = settings.pointsOnChart;
        pointsPerUpdate = settings.pointsPerUpdate;
        sendEvery = settings.sendEvery;
        modelType = settings.modelType;
        productId = settings.productId;
        fMode = settings.fMode;
        const positive = initChart();
        initWebSocket(positive);
    };

    const stopStreaming = () => {
        console.log("stop streaming");
        socket?.disconnect();
        isRunning = false;
        if (sciChartSurface.chartModifiers.size() === 0) {
            sciChartSurface.chartModifiers.add(
                new MouseWheelZoomModifier(),
                new ZoomPanModifier(),
                new ZoomExtentsModifier()
            );
        }
    };
    return { wasmContext, sciChartSurface, controls: { startStreaming, stopStreaming, updateSettings } };
};
