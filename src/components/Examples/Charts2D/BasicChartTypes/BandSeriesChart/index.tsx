import * as React from "react";
import { MouseWheelZoomModifier } from "../../../../../../../src/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "../../../../../../../src/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "../../../../../../../src/Charting/ChartModifiers/ZoomPanModifier";
import { XyyDataSeries } from "../../../../../../../src/Charting/Model/XyyDataSeries";
import { NumericAxis } from "../../../../../../../src/Charting/Visuals/Axis/NumericAxis";
import { FastBandRenderableSeries } from "../../../../../../../src/Charting/Visuals/RenderableSeries/FastBandRenderableSeries";
import { SciChartSurface } from "../../../../../../../src/Charting/Visuals/SciChartSurface";
import { NumberRange } from "../../../../../../../src/Core/NumberRange";
import { EAxisAlignment } from "../../../../../../../src/types/AxisAlignment";

const divElementId = "chart";

const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Top }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Left, growBy: new NumberRange(0.4, 0.4) })
    );

    const dataSeries = new XyyDataSeries(wasmContext);
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        const k = 1 - i / 2000;
        dataSeries.append(i, Math.sin(i * STEP) * k * 0.7, Math.cos(i * STEP) * k);
    }
    const rendSeries = new FastBandRenderableSeries(wasmContext, { dataSeries, strokeThickness: 2 });
    sciChartSurface.renderableSeries.add(rendSeries);
    rendSeries.fill = "#279B2733";
    rendSeries.fillY1 = "#FF191933";
    rendSeries.stroke = "#FF1919FF";
    rendSeries.strokeY1 = "#279B27FF";

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

export default function BandSeriesChart() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
