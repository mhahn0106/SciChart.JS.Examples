export const code = `
import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import {EAutoRange} from "scichart/types/AutoRange";
import {ENumericFormat} from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import {convertRgbToHexColor} from "scichart/utils/convertColor";
import {AlertTitle} from "@material-ui/lab";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {Button, ButtonGroup, FormControl} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const divElementId = "chart";

type TTimeSpan = {
    title: string;
    durationMs: number;
};

const SERIES = 500;
const POINTS = 500;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 142
        },
        notificationsBlock: {
            flexBasis: 320,
            flexGrow: 0,
            flexShrink: 0,
            marginLeft: 24
        },
        notification: {
            marginBottom: 16
        },
        description: {
            width: 800,
            marginBottom: 20
        }
    })
);

const drawExample = async (updateTimeSpans: (newTimeSpans: TTimeSpan[]) => void) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, 3, 2);
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, POINTS),
        autoRange: EAutoRange.Never
    });
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Never
    });
    yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
    sciChartSurface.yAxes.add(yAxis);

    const dataSeriesArray: XyDataSeries[] = new Array<XyDataSeries>(SERIES);
    const rendSeriesArray: FastLineRenderableSeries[] = new Array<FastLineRenderableSeries>(SERIES);
    for (let i = 0; i < SERIES; i++) {
        const dataSeries: XyDataSeries = new XyDataSeries(wasmContext);
        const rendSeries: FastLineRenderableSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries,
            strokeThickness: 2
        });

        dataSeriesArray[i] = dataSeries;
        rendSeriesArray[i] = rendSeries;

        sciChartSurface.renderableSeries.add(rendSeries);
    }

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Buttons for chart
    const loadPoints = () => {
        const newTimeSpans: TTimeSpan[] = [];

        // Start counting Points generation time
        const generateTimestamp = Date.now();

        const xValuesArray: number[][] = new Array<number[]>(SERIES);
        const yValuesArray: number[][] = new Array<number[]>(SERIES);
        const strokeArray: string[] = new Array<string>(SERIES);
        for (let i = 0; i < SERIES; i++) {
            // Allocate data arrays
            xValuesArray[i] = new Array<number>(POINTS);
            yValuesArray[i] = new Array<number>(POINTS);

            // Clear data, if any
            dataSeriesArray[i].clear();

            // Generate stroke
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            strokeArray[i] = convertRgbToHexColor(r, g, b);

            // Generate points
            let prevYValue = 0;
            for (let j = 0; j < POINTS; j++) {
                const curYValue = Math.random() * 10 - 5;

                xValuesArray[i][j] = j;
                yValuesArray[i][j] = prevYValue + curYValue;

                prevYValue += curYValue;
            }
        }

        // Add the first time span: Generating 1M data points
        newTimeSpans.push({
            title: "Generate 500x500 Data Points",
            durationMs: Date.now() - generateTimestamp
        });

        // Start counting batch append time
        const appendTimestamp = Date.now();
        for (let i = 0; i < SERIES; i++) {
            dataSeriesArray[i].appendRange(xValuesArray[i], yValuesArray[i]);
            rendSeriesArray[i].stroke = strokeArray[i];
        }

        // Add the second time span: Generation of data point
        newTimeSpans.push({
            title: "Append 500x500 Data Points",
            durationMs: Date.now() - appendTimestamp
        });

        // Subscribe to sciChartSurface.rendered event,
        // and calculate time duration between the append and
        // the first frame after it
        const firstFrameTimestamp = Date.now();
        let frameIndex: number = 0;
        let nextFramesTimestamp: number;
        const handler = () => {
            if (frameIndex === 0) {
                // Add the third time span: Render the first frame
                newTimeSpans.push({
                    title: "Render the frame",
                    durationMs: Date.now() - firstFrameTimestamp
                });
                nextFramesTimestamp = Date.now();
            } else {
                // Unsubscribe from sciChartSurface.rendered
                updateTimeSpans(newTimeSpans);
                sciChartSurface.rendered.unsubscribe(handler);

                // Zoom extents at the end of performance measurement
                sciChartSurface.zoomExtents();
            }
            setTimeout(sciChartSurface.invalidateElement, 0);
            // Increment frame index
            frameIndex++;
        };
        sciChartSurface.rendered.subscribe(handler);
    };

    document.getElementById("loadPoints").addEventListener("click", loadPoints);

    return { wasmContext, sciChartSurface };
};

export default function Load500By500() {
    const classes = useStyles();
    const [timeSpans, setTimeSpans] = React.useState<TTimeSpan[]>([]);
    React.useEffect(() => {
        drawExample((newTimeSpans: TTimeSpan[]) => {
            setTimeSpans([...newTimeSpans]);
        });
    }, []);

    return <div>
        <div style={{ display: "flex", maxWidth: 1200 }}>
            <div id={divElementId} style={{ flexBasis: 400, flexGrow: 1, flexShrink: 1 }} />
            <div className={classes.notificationsBlock}>
                {timeSpans.length > 0 && (
                    <Alert key="0" severity="info" className={classes.notification}>
                        {timeSpans.map((ts, index) => (
                            <div key={index}>
                                <AlertTitle>{ts.title}</AlertTitle>
                                Time: {ts.durationMs.toFixed(0)} ms
                            </div>
                        ))}
                    </Alert>
                )}
            </div>
        </div>
        <div>
            <div>
                <FormControl className={classes.formControl}>
                    <ButtonGroup size="medium" color="primary" aria-label="small outlined button group">
                        <Button id="loadPoints">Load</Button>
                    </ButtonGroup>
                </FormControl>
            </div>
        </div>
    </div>;
}

`;