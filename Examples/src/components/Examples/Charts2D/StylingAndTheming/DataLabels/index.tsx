import * as React from "react";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {FastColumnRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {SciChartSurface} from "scichart";
import {NumberRange} from "scichart/Core/NumberRange";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {EVerticalTextPosition} from "scichart/types/TextPosition";
import {Thickness} from "scichart/Core/Thickness";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { EXyDirection } from "scichart/types/XyDirection";
import { IPointMetadata } from "scichart/Charting/Model/IPointMetadata";
import { DataLabelProvider } from "scichart/Charting/Visuals/RenderableSeries/DataLabels/DataLabelProvider";
import { formatNumber } from "scichart/utils/number";
import { EWrapTo, NativeTextAnnotation } from "scichart/Charting/Visuals/Annotations/NativeTextAnnotation";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import {SplineLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementId, {theme: appTheme.SciChartJsTheme});

    // Add an X, Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRangeLimit: new NumberRange(0, 20)}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05)}));

    // normal labels
    const data1 = ExampleDataProvider.getSpectrumData(0, 20, 5, 1, 0.01);
    const colSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, data1),
        fill: appTheme.VividOrange + "33",
        stroke: appTheme.VividOrange,
        dataPointWidth: 0.7,
        strokeThickness: 1,
        dataLabels: {
            // To enable datalabels, set fontFamily and size
            style: { fontFamily: "Arial", fontSize: 16, padding: new Thickness(5,0,5,0) },
            color: appTheme.VividOrange,
            // Normal label format and precision options are supported
            precision: 2
        },
    });
    const highCol = parseColorToUIntArgb(appTheme.VividGreen);
    const lowCol = parseColorToUIntArgb(appTheme.VividOrange);
    (colSeries.dataLabelProvider as DataLabelProvider).getColor = (state, text) => {
        if (state.yVal() > 0)
            return highCol;
        else
            return lowCol;
    }
    sciChartSurface.renderableSeries.add(colSeries);

    const labels = ["Data", "Labels", "can", "come", "from", "values", "in", "metadata"]
    sciChartSurface.renderableSeries.add(new SplineLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues.map(y => y * 0.8 + 4),
            metadata: data1.xValues.map((x, i) => ({ isSelected: false, text: labels[(i-1)/2] } as IPointMetadata))}),
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: appTheme.ForegroundColor, strokeThickness: 0}),
        dataLabels: {
            style: { fontFamily: "Arial", fontSize: 16 },
            color: appTheme.ForegroundColor,
            // @ts-ignore
            metaDataSelector: (md) => md.text
        },
    }));

    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 1,
        y1: 10,
        text: "Series with 1000 points, using custom getText function to only show labels for peaks, with x and y",
        textColor: appTheme.VividGreen,
        wrapTo: EWrapTo.ViewRect
    }));

    // Custom getText
    const data2 = ExampleDataProvider.getSpectrumData(10, 1000, 10, 100, 0.02);
    const series = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data2.xValues.map(x=> x/50), yValues: data2.yValues.map(y=>y*0.3 + 8) }),
        stroke: appTheme.VividGreen,
        strokeThickness: 3,
        dataLabels: {
            style: { fontFamily: "Arial", fontSize: 14, padding: new Thickness(0,0,3,0) },
            color: appTheme.ForegroundColor,
            aboveBelow: false,
            verticalTextPosition: EVerticalTextPosition.Above,
        },
    });
    (series.dataLabelProvider as DataLabelProvider).getText = (state) => {
        const i = state.index;
        if (i > state.indexStart && i < state.indexEnd
            && state.yVal() > state.yVal(i-1) && state.yVal() > state.yVal(i+1)) {
                return `X: ${formatNumber(state.xVal(), ENumericFormat.Decimal, 2)}\nY: ${formatNumber(state.yVal(), ENumericFormat.Decimal, 3)}`;
            }
        return undefined;
    };
    sciChartSurface.renderableSeries.add(series);

    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 1,
        y1: 14,
        text: "Series with 200 points. Using pointGapThreshold = 1 to show labels when zoomed in enough for there to be space for them",
        textColor: appTheme.VividPink,
        wrapTo: EWrapTo.ViewRect
    }));
    // Show labels when zoomed in
    const data3 = ExampleDataProvider.getSpectrumData(0, 200, 10, 20, 0.02);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data3.xValues.map(x=> x/10), yValues: data3.yValues.map(y=>y*0.3 + 12) } ),
        stroke: appTheme.VividPink,
        strokeThickness: 3,
        dataLabels: {
            style: { fontFamily: "Arial", fontSize: 12 },
            color: appTheme.ForegroundColor,
            pointGapThreshold: 1
        },
    }));


    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection}));

    sciChartSurface.zoomExtents();

    return {sciChartSurface, wasmContext};
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function DataLabelsExample() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper}/>;
}
