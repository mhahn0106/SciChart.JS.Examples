import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {LogarithmicAxis} from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {ELogarithmicMajorTickMode} from "scichart/Charting/Numerics/TickProviders/LogarithmicTickProvider";

export async function initLogAxis() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-4");

    // Creating a Log(10) Axis for xAxis
    sciChartSurface.xAxes.add(new LogarithmicAxis(wasmContext, {
        axisTitle: "Log(10) Axis",
        axisAlignment: EAxisAlignment.Bottom,
        labelFormat: ENumericFormat.Scientific,
        logBase: 10,
        visibleRange: new NumberRange(1, 1E6)
    }));

    // Creating a Log(2) Axis on the YAxis
    sciChartSurface.yAxes.add(new LogarithmicAxis(wasmContext, {
        axisTitle: "Log(2) Axis",
        axisAlignment: EAxisAlignment.Left,
        labelFormat: ENumericFormat.SignificantFigures,
        majorTickMode: ELogarithmicMajorTickMode.RoundNumbers,
        logBase: 2,
        visibleRange: new NumberRange(0.1, 500)
    }));
}
