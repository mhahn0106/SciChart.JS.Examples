import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {RubberBandXyZoomModifier} from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {PinchZoomModifier} from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import {EExecuteOn} from "scichart/types/ExecuteOn";
import {easing} from "scichart/Core/Animations/EasingFunctions";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {XAxisDragModifier} from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import {EDragMode} from "scichart/types/DragMode";
import {YAxisDragModifier} from "scichart/Charting/ChartModifiers/YAxisDragModifier";

const divElementId = "chart";

const drawExample = async () => {
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
    const lineSeries0 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues, dataSeriesName: "First Line Series" }),
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: appTheme.VividSkyBlue })
    });
    sciChartSurface.renderableSeries.add(lineSeries0);

    const data2 = ExampleDataProvider.getFourierSeriesZoomed(0.5, 0.12, 5.0, 5.15);
    const lineSeries1  =new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data2.xValues, yValues: data2.yValues, dataSeriesName: "Second Line Series" }),
        strokeThickness: 3,
        stroke: appTheme.VividOrange,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: appTheme.VividOrange })
    });
    sciChartSurface.renderableSeries.add(lineSeries1);

    const data3 = ExampleDataProvider.getFourierSeriesZoomed(0.4, 0.11, 5.0, 5.15);
    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues: data3.xValues, yValues: data3.yValues, dataSeriesName: "Third Line Series" }),
        strokeThickness: 3,
        stroke: appTheme.MutedPink,
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, strokeThickness: 0, fill: appTheme.MutedPink }),
    });
    sciChartSurface.renderableSeries.add(lineSeries2);

    // Here is where we add the zoom, pan behaviour
    sciChartSurface.chartModifiers.add(
        // use RubberBandXyZoomModifier with Right Mouse Button
        // use easingFunction to animate zoom
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton, easingFunction: easing.elastic }),
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        // use PinchZoomModifier to allow zooming with pinch gesture on touch devices
        new PinchZoomModifier(),
        // Zoom extents on double click
        new ZoomExtentsModifier( { easingFunction: easing.elastic })
    );

    // Add annotations to tell the user what to do
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Zoom Pan Modifiers Demo",
        x1: 0.5, y1: 0.5,
        yCoordShift: -50,
        xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center,
        opacity: 0.33,
        fontSize: 48,
        fontWeight: "Bold"
    }));
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Multiple zoom, pan behaviours enabled on a single chart",
        x1: 0.5, y1: 0.5,
        yCoordShift: 0,
        xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center,
        opacity: 0.38,
        fontSize: 28,
    }));
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "Try mouse-wheel, left/right mouse drag, mousewheel on axis, pinch zoom, double-click to zoom to fit etc...",
        x1: 0.5, y1: 0.5,
        yCoordShift: 50,
        xCoordinateMode: ECoordinateMode.Relative, yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center, verticalAnchorPoint: EVerticalAnchorPoint.Center,
        opacity: 0.45,
        fontSize: 17,
    }));
    return { wasmContext, sciChartSurface };
};

let scs: SciChartSurface;

export default function ZoomPanUsage() {
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => scs?.delete();
    }, []);

    /*
     * In order to prevent conflicts of touch actions on the chart with the default browser gestures behavior,
     * touch-actions css property can be used. https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action
     *
     * Suggestions:
     * - if a chart uses some Zoom/Pan modifiers or draggable elements:
     *   touch-actions property should be set to 'none' to prevent default browser touch behavior
     *   (or the value can be set to allow only specific type of default touch actions);
     *
     * - if a chart doesn't allow zooming/panning:
     *   prefer leaving the default 'touch-actions: auto' to allow default browser gestures upon the chart element.
     */

    // make sure default browser touch behavior doesn't conflict with the chart modifiers functionality
    return <div id={divElementId} style={{ touchAction: "none" }} className={classes.ChartWrapper} />;
}
