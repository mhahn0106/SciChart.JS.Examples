import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import classes from "../../../../Examples/Examples.module.scss";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { SplineLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { ELegendOrientation } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import {appTheme} from "../../../theme";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create the X,Y Axis
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.2) });
    sciChartSurface.yAxes.add(yAxis);

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const yValues = [50, 35, 61, 58, 50, 50, 40, 53, 55, 23, 45, 12, 59, 60];

    // Create an XyDataSeries as data source
    const xyDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Original Data ",
        xValues,
        yValues
    });

    const splineXyDataSeries = new XyDataSeries(wasmContext, {
        dataSeriesName: "Spline Data ",
        xValues,
        yValues
    });

    // Create and add a standard line series to the chart.
    // This will be used to compare the spline (smoothed) algorothm
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        dataSeries: xyDataSeries,
        animation: new WaveAnimation({ zeroLine: 10, pointDurationFraction: 0.5, duration: 1000, fadeEffect: true })
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Create and add a Spline line series to the chart
    const splineSeries = new SplineLineRenderableSeries(wasmContext, {
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 5,
        dataSeries: splineXyDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 11, height: 11,
            fill: appTheme.ForegroundColor,
            stroke: appTheme.VividSkyBlue
        }),
        interpolationPoints: 10, // Set interpolation points to decide the amount of smoothing,
        animation: new WaveAnimation({ zeroLine: 10, pointDurationFraction: 0.5, duration: 1000, fadeEffect: true })
    });
    sciChartSurface.renderableSeries.add(splineSeries);

    // OPTIONAL: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new LegendModifier({ orientation: ELegendOrientation.Horizontal }));

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

let scs: SciChartSurface;

export default function SplineLineChart() {
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Deleting sciChartSurface to prevent memory leak
        return () => scs?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
