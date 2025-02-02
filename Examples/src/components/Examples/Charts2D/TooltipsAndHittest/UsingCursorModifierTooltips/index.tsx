import * as React from "react";
import {TWebAssemblyChart} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {SciChartSurface} from "scichart";
import {CursorModifier} from "scichart/Charting/ChartModifiers/CursorModifier";
import {ENumericFormat} from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {SeriesInfo} from "scichart/Charting/Model/ChartData/SeriesInfo";
import {CursorTooltipSvgAnnotation} from "scichart/Charting/Visuals/Annotations/CursorTooltipSvgAnnotation";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";

const divElementId = "chart";


const drawExample = async (): Promise<TWebAssemblyChart> => {

    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.05, 0.05),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 4
    }));

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 4
    }));

    // Add some data
    const data1 = ExampleDataProvider.getFourierSeriesZoomed(0.6, 0.13, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues, dataSeriesName: "First Line Series" }),
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: appTheme.VividSkyBlue })
    }));

    const data2 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data2.xValues, yValues: data2.yValues, dataSeriesName: "Second Line Series" }),
        strokeThickness: 3,
        stroke: appTheme.VividOrange,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: appTheme.VividOrange })
    }));

    const data3 = ExampleDataProvider.getFourierSeriesZoomed(0.4, 0.11, 5.0, 5.15);
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data3.xValues, yValues: data3.yValues, dataSeriesName: "Third Line Series" }),
        strokeThickness: 3,
        stroke: appTheme.MutedPink,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: appTheme.MutedPink })
    }));

    // Here is where we add cursor behaviour
    //
    sciChartSurface.chartModifiers.add(
        // Add the CursorModifier (crosshairs) behaviour
        new CursorModifier({
            // Defines if crosshair is shown
            crosshairStroke: appTheme.VividOrange,
            crosshairStrokeThickness: 1,
            showXLine: true,
            showYLine: true,
            // Shows the default tooltip
            showTooltip: true,
            tooltipContainerBackground: appTheme.VividOrange,
            tooltipTextStroke: appTheme.ForegroundColor,
            // Defines the axis label colours
            axisLabelFill: appTheme.VividOrange,
            axisLabelStroke: appTheme.ForegroundColor,
            // Shows an additional legend in top left of the screen
            tooltipLegendTemplate: getTooltipLegendTemplate
        }),
        // Add further zooming and panning behaviours
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};

// Override the standard tooltip displayed by CursorModifier
const getTooltipLegendTemplate = (seriesInfos: SeriesInfo[], svgAnnotation: CursorTooltipSvgAnnotation) => {
    let outputSvgString = "";

    // Foreach series there will be a seriesInfo supplied by SciChart. This contains info about the series under the house
    seriesInfos.forEach((seriesInfo, index) => {
        const lineHeight = 30;
        const y = 20 + index * lineHeight;
        // Use the series stroke for legend text colour
        const textColor = seriesInfo.stroke;
        // Use the seriesInfo formattedX/YValue for text on the
        outputSvgString += `<text x="8" y="${y}" font-size="16" font-family="Verdana" fill="${textColor}">
            ${seriesInfo.seriesName}: X=${seriesInfo.formattedXValue}, Y=${seriesInfo.formattedYValue}
        </text>`;
    });

    return `<svg width="100%" height="100%">
                ${outputSvgString}
            </svg>`;
};

export default function UsingCursorModifierTooltips() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
