import { colors } from "@material-ui/core";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { XAxisDragModifier } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { YAxisDragModifier } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { EInnerAxisPlacementCoordinateMode } from "scichart/Charting/LayoutManager/EInnerAxisPlacementCoordinateMode";
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider
} from "scichart/Charting/Model/IPaletteProvider";
import { IPointMetadata } from "scichart/Charting/Model/IPointMetadata";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { DateTimeNumericAxis } from "scichart/Charting/Visuals/Axis/DateTimeNumericAxis";
import { TextLabelProvider } from "scichart/Charting/Visuals/Axis/LabelProvider/TextLabelProvider";
import { LogarithmicAxis } from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import { INumericAxisOptions, NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { ShadowEffect } from "scichart/Charting/Visuals/RenderableSeries/ShadowEffect";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { Point } from "scichart/Core/Point";
import { Thickness } from "scichart/Core/Thickness";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { ELabelAlignment } from "scichart/types/LabelAlignment";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { RightAlignedOuterVerticallyStackedAxisLayoutStrategy } from "scichart/Charting/LayoutManager/RightAlignedOuterVerticallyStackedAxisLayoutStrategy"
import classes from "../../../Examples.module.scss";
import { appTheme } from "../../../theme";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    const commonAxisOptions: INumericAxisOptions = {
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: true,
        autoRange: EAutoRange.Never,
        axisTitleStyle: {
            fontSize: 18
        },
        majorTickLineStyle: {
            tickSize: 6,
            strokeThickness: 2,
            color: "white"
        },
        axisBorder: {
            border: 2, 
            color: "white"
        },
        labelStyle: {
            fontSize: 14,
        }
    };

    const horizontalAxisPosition = 60;
    const verticalAxisPosition = 30;

    const primaryColors = ["#4FBEE6",
    "#AD3D8D",
    "#6BBDAE",
    "#E76E63",
    "#2C4B92"];

    const xAxis1 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "xAxis1", axisTitle: "X Axis" });
    const xAxis2 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "xAxis2",
        axisTitle: "Flipped X Axis",
        flippedCoordinates: true
    });
    const xAxis3 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "xAxis3",
        axisTitle: "Stacked X Axis",
        axisAlignment: EAxisAlignment.Right,
        flippedCoordinates: false
    });
    const xAxis4 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "xAxis4",
        // axisTitle: "TopInnerXAxis",
        axisAlignment: EAxisAlignment.Top,

        isInnerAxis: true
    });
    const xAxis5 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "xAxis5", axisTitle: "xAxis5" });
    const xAxis6 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "xAxis6", axisTitle: "xAxis6" });
    const xAxis7 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "xAxis7", axisTitle: "xAxis7" });

    const yAxis2 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "yAxis1", axisTitle: "Stacked Y Axis" });
    const yAxis1 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "yAxis2",
        axisTitle: "Flipped Y Axis - Left Aligned",
        axisAlignment: EAxisAlignment.Left,
        flippedCoordinates: true
    });
    const yAxis3 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "yAxis3",
        axisTitle: "Y Axis - Top Aligned",
        axisAlignment: EAxisAlignment.Top,
        flippedCoordinates: false
    });
    const yAxis4 = new NumericAxis(wasmContext, {
        ...commonAxisOptions,
        id: "yAxis4",
        // axisTitle: "InnerYAxis",
        flippedCoordinates: false,
        isInnerAxis: true
    });
    const yAxis5 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "yAxis5", axisTitle: "yAxis5" });
    const yAxis6 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "yAxis6", axisTitle: "yAxis6" });
    const yAxis7 = new NumericAxis(wasmContext, { ...commonAxisOptions, id: "yAxis7", axisTitle: "yAxis7" });

    sciChartSurface.layoutManager.rightOuterAxesLayoutStrategy =
        new RightAlignedOuterVerticallyStackedAxisLayoutStrategy();

    // use axes with custom ids for positioning the central axes
    sciChartSurface.layoutManager.rightInnerAxesLayoutStrategy.orthogonalAxisId = xAxis1.id;
    sciChartSurface.layoutManager.bottomInnerAxesLayoutStrategy.orthogonalAxisId = yAxis1.id;
    sciChartSurface.layoutManager.leftInnerAxesLayoutStrategy.orthogonalAxisId = xAxis1.id;
    sciChartSurface.layoutManager.topInnerAxesLayoutStrategy.orthogonalAxisId = yAxis1.id;

    sciChartSurface.layoutManager.rightInnerAxesLayoutStrategy.coordinateMode =
        EInnerAxisPlacementCoordinateMode.DataValue;

    sciChartSurface.layoutManager.rightInnerAxesLayoutStrategy.axisPosition = verticalAxisPosition;

    sciChartSurface.layoutManager.topInnerAxesLayoutStrategy.coordinateMode =
        EInnerAxisPlacementCoordinateMode.DataValue;
    sciChartSurface.layoutManager.topInnerAxesLayoutStrategy.axisPosition = horizontalAxisPosition;

    xAxis1.drawMajorGridLines = true;
    yAxis1.drawMajorGridLines = true;

    sciChartSurface.xAxes.add(
        xAxis2,
        xAxis3,
        xAxis1,
        xAxis4
        //  xAxis5,
        //  xAxis6, xAxis7
    );

    sciChartSurface.yAxes.add(
        yAxis2,
        yAxis3,
        yAxis1,
        yAxis4
        // yAxis5,
        // yAxis6, yAxis7
    );
    xAxis1.isPrimaryAxis = true;
    yAxis1.isPrimaryAxis = true;

    sciChartSurface.xAxes.asArray().forEach((xAxis, index) => {
        const yAxis = sciChartSurface.yAxes.get(index);

        xAxis.axisTitleStyle.color = primaryColors[index];
        yAxis.axisTitleStyle.color = primaryColors[index];

        xAxis.majorTickLineStyle = { color: primaryColors[index] };
        yAxis.majorTickLineStyle = { color: primaryColors[index] };

        xAxis.labelStyle.color = primaryColors[index];
        yAxis.labelStyle.color = primaryColors[index];

        xAxis.axisBorder.borderTop = 2;
        xAxis.axisBorder.borderBottom = 2;
        xAxis.axisBorder.borderRight = 2;
        xAxis.axisBorder.borderLeft = 2;
        xAxis.axisBorder.color = primaryColors[index];

        yAxis.axisBorder.borderTop = 2;
        yAxis.axisBorder.borderBottom = 2;
        yAxis.axisBorder.borderRight = 2;
        yAxis.axisBorder.borderLeft = 2;
        yAxis.axisBorder.color = primaryColors[index];

        xAxis.labelStyle.alignment = ELabelAlignment.Center;
        yAxis.labelStyle.alignment = ELabelAlignment.Center;

        xAxis.axisRenderer.keepLabelsWithinAxis = true;
        yAxis.axisRenderer.keepLabelsWithinAxis = true;

        xAxis.visibleRange = new NumberRange(-10, 110);
        yAxis.visibleRange = new NumberRange(-10, 140);

        const dataSeries = new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true });
        for (let i = 0; i < 100; i++) {
            let y = Math.sin(i * 0.1) * i + 50;

            dataSeries.append(i, y);
        }
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            xAxisId: xAxis.id,
            yAxisId: yAxis.id,
            strokeThickness: 3,
            stroke: primaryColors[index]
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    });

    // leave only one border for Inner Axes
    xAxis4.axisBorder.borderRight = 0;
    xAxis4.axisBorder.borderBottom = 0;
    xAxis4.axisBorder.borderLeft = 0;

    yAxis4.axisBorder.borderTop = 0;
    yAxis4.axisBorder.borderBottom = 0;
    yAxis4.axisBorder.borderLeft = 0;

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({
            includedXAxisIds: [xAxis1.id, xAxis4.id],
            includedYAxisIds: [yAxis1.id, yAxis4.id]
        }),
        new XAxisDragModifier(),
        new YAxisDragModifier()
    );

    const series4ScaleFactor = 3;
    console.log(" xAxis1.visibleRange", xAxis1.visibleRange);
    console.log(" yAxis1.visibleRange", yAxis1.visibleRange);
    xAxis4.visibleRange = new NumberRange(
        (xAxis1.visibleRange.min - verticalAxisPosition) * series4ScaleFactor,
        (xAxis1.visibleRange.max - verticalAxisPosition) * series4ScaleFactor
    );
    yAxis4.visibleRange = new NumberRange(
        (horizontalAxisPosition - yAxis1.visibleRange.max) * series4ScaleFactor,
        (horizontalAxisPosition - yAxis1.visibleRange.min) * series4ScaleFactor
    );

    xAxis3;
    yAxis2;

    xAxis2.visibleRangeChanged.subscribe(data => {
        xAxis3.visibleRange = data.visibleRange;
    });
    yAxis2.visibleRangeChanged.subscribe(data => {
        yAxis3.visibleRange = data.visibleRange;
    });

    xAxis3.visibleRangeChanged.subscribe(data => {
        xAxis2.visibleRange = data.visibleRange;
    });
    yAxis3.visibleRangeChanged.subscribe(data => {
        yAxis2.visibleRange = data.visibleRange;
    });

    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function FeatureAxisLayout() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

        return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
        </div>
    );
}
