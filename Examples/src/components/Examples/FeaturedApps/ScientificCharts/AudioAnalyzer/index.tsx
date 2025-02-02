import * as React from "react";
import {UniformHeatmapDataSeries} from "scichart/Charting/Model/UniformHeatmapDataSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {HeatmapColorMap} from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import {
    UniformHeatmapRenderableSeries
} from "scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries";
import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumberRange} from "scichart/Core/NumberRange";
import {EAutoRange} from "scichart/types/AutoRange";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {AudioDataProvider} from "./AudioDataProvider";
import {Radix2FFT} from "./Radix2FFT";
import {appTheme} from "../../../theme";
import {
    LogarithmicAxis
} from "scichart/Charting/Visuals/Axis/LogarithmicAxis";
import {ENumericFormat} from "scichart/types/NumericFormat";
import {GradientParams} from "scichart/Core/GradientParams";
import {PaletteFactory} from "scichart/Charting/Model/PaletteFactory";
import {Point} from "scichart/Core/Point";
import {
    FastMountainRenderableSeries
} from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import {
    EllipsePointMarker
} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import classes from "../../../Examples.module.scss";
import {
    TextAnnotation
} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {
    ECoordinateMode
} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint
} from "scichart/types/AnchorPoint";

export const divElementIdAudioChart = "sciChart1";
export const divElementIdFttChart = "sciChart2";
export const divElementIdChart3 = "sciChart3";

const AUDIO_STREAM_BUFFER_SIZE = 2048;

let cleanupRequested: boolean;

export const drawExample = async () => {
    cleanupRequested = false;

    const dataProvider = new AudioDataProvider();

    const bufferSize = dataProvider.bufferSize;
    const sampleRate = dataProvider.sampleRate;

    const fft = new Radix2FFT(bufferSize);

    const hzPerDataPoint = sampleRate / bufferSize;
    const fftSize = fft.fftSize;
    const fftCount = 200;

    let fftXValues: number[];
    let spectrogramValues: number[][];

    let audioDS: XyDataSeries;
    let historyDS: XyDataSeries;
    let fftDS: XyDataSeries;
    let spectrogramDS: UniformHeatmapDataSeries;

    // INIT AUDIO
    const initAudio = () => {
        return dataProvider.initAudio();
    };

    function updateAnalysers(frame: number): void {
        // Make sure Audio is initialized
        if (dataProvider.initialized === false) {
            return;
        }

        // Get audio data
        const audioData = dataProvider.next();

        // Update Audio Chart
        audioDS.removeRange(0, audioData.pointsCount);
        audioDS.appendRange(audioData.xData, audioData.yData);

        // Update History
        const maxLength = fftCount * audioData.pointsCount;
        historyDS.appendRange(audioData.xData, audioData.yData);
        if (historyDS.count() > maxLength) {
            historyDS.removeRange(0, historyDS.count() - maxLength);
        }

        // Perform FFT
        const fftData = fft.run(audioData.yData);

        // Update FFT Chart
        fftDS.clear();
        fftDS.appendRange(fftXValues, fftData);

        // Update Spectrogram Chart
        spectrogramValues.shift();
        spectrogramValues.push(fftData);
        spectrogramDS.setZValues(spectrogramValues);
    }

    // AUDIO CHART
    const initAudioChart = async () => {
        // Create a chart for the audio
        const {
            sciChartSurface,
            wasmContext
        } = await SciChartSurface.create(divElementIdAudioChart, {theme: appTheme.SciChartJsTheme});

        // Create an XAxis for the live audio
        const xAxis = new NumericAxis(wasmContext, {
            id: "audio",
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            drawMajorBands: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false
        });
        sciChartSurface.xAxes.add(xAxis);

        // Create an XAxis for the history of the audio on the same chart
        const xhistAxis = new NumericAxis(wasmContext, {
            id: "history",
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorGridLines: false,
            drawMajorTickLines: false
        });
        sciChartSurface.xAxes.add(xhistAxis);

        // Create a YAxis for the audio data
        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Never,
            visibleRange: new NumberRange(-32768 * 0.8, 32767 * 0.8), // [short.MIN. short.MAX]
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            drawMajorBands: false,
            drawMinorGridLines: false,
            drawMajorGridLines: false
        });
        sciChartSurface.yAxes.add(yAxis);

        audioDS = new XyDataSeries(wasmContext);

        // Fill the data series with zero values
        for (let i = 0; i < AUDIO_STREAM_BUFFER_SIZE; i++) {
            audioDS.append(0, 0);
        }

        // Add a line series for the live audio data
        // using XAxisId=audio for the live audio trace scaling
        const rs = new FastLineRenderableSeries(wasmContext, {
            xAxisId: "audio",
            stroke: "#4FBEE6",
            strokeThickness: 2,
            dataSeries: audioDS
        });

        sciChartSurface.renderableSeries.add(rs);

        historyDS = new XyDataSeries(wasmContext);
        for (let i = 0; i < AUDIO_STREAM_BUFFER_SIZE * fftCount; i++) {
            historyDS.append(0, 0);
        }

        // Add a line series for the historical audio data
        // using the XAxisId=history for separate scaling for this trace
        const histrs = new FastLineRenderableSeries(wasmContext, {
            stroke: "#208EAD33",
            strokeThickness: 1,
            opacity: 0.5,
            xAxisId: "history",
            dataSeries: historyDS
        });
        sciChartSurface.renderableSeries.add(histrs);

        // Add instructions
        sciChartSurface.annotations.add(new TextAnnotation({
            x1: 0,
            y1: 0,
            xAxisId: "history",
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            text: "This example uses your microphone to generate waveforms. Say something!",
            textColor: "#FFFFFF44"
        }));

        return sciChartSurface;
    };

    // FFT CHART
    const initFftChart = async () => {
        const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementIdFttChart, { theme: appTheme.SciChartJsTheme });
        const xAxis = new LogarithmicAxis(wasmContext, {
            logBase: 10,
            labelFormat: ENumericFormat.SignificantFigures,
            maxAutoTicks: 5,
            axisTitleStyle: {fontSize: 10},
            drawMinorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false
        });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            visibleRange: new NumberRange(0, 80),
            growBy: new NumberRange(0.1, 0.1),
            drawMinorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            labelPrecision: 0,
            axisTitleStyle: {fontSize: 10}
        });
        sciChartSurface.yAxes.add(yAxis);

        fftDS = new XyDataSeries(wasmContext);
        fftXValues = new Array<number>(fftSize);
        for (let i = 0; i < fftSize; i++) {
            fftXValues[i] = (i + 1) * hzPerDataPoint;
        }

        // Make a column chart with a gradient palette on the stroke only
        const rs = new FastMountainRenderableSeries(wasmContext, {
            dataSeries: fftDS,
            pointMarker: new EllipsePointMarker(wasmContext, {width: 9, height: 9}),
            strokeThickness: 3,
            paletteProvider: PaletteFactory.createGradient(
                wasmContext,
                new GradientParams(new Point(0, 0), new Point(1, 1), [
                    {offset: 0, color: "#36B8E6"},
                    {offset: 0.001, color: "#5D8CC2"},
                    {offset: 0.01, color: "#8166A2"},
                    {offset: 0.1, color: "#AE418C"},
                    {offset: 1.0, color: "#CA5B79"}
                ]),
                {
                    enableStroke: true,
                    enableFill: true,
                    enablePointMarkers: true,
                    fillOpacity: 0.17,
                    pointMarkerOpacity: 0.37
                }
            )
        });
        sciChartSurface.renderableSeries.add(rs);

        return sciChartSurface;
    };

    // SPECTROGRAM CHART
    const initSpectogramChart = async () => {
        spectrogramValues = new Array<number[]>(fftCount);
        for (let i = 0; i < fftCount; i++) {
            spectrogramValues[i] = new Array<number>(fftSize);
            for (let j = 0; j < fftSize; j++) {
                spectrogramValues[i][j] = 0;
            }
        }

        const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementIdChart3, { theme: appTheme.SciChartJsTheme });

        const xAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false
        });
        sciChartSurface.xAxes.add(xAxis);

        const yAxis = new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            drawLabels: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false
        });
        sciChartSurface.yAxes.add(yAxis);

        spectrogramDS = new UniformHeatmapDataSeries(wasmContext, {
            xStart: 0,
            xStep: 1,
            yStart: 0,
            yStep: 1,
            zValues: spectrogramValues
        });

        const rs = new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: spectrogramDS,
            colorMap: new HeatmapColorMap({
                minimum: 0,
                maximum: 70,
                gradientStops: [
                    {offset: 0, color: "#000000"},
                    {offset: 0.25, color: "#800080"},
                    {offset: 0.5, color: "#FF0000"},
                    {offset: 0.75, color: "#FFFF00"},
                    {offset: 1, color: "#FFFFFF"}
                ]
            })
        });
        sciChartSurface.renderableSeries.add(rs);

        return sciChartSurface;
    };

    // DRAW CHARTS
    const charts = await Promise.all([initAudioChart(), initFftChart(), initSpectogramChart()]);

    // INIT AUDIO
    await initAudio();

    // START ANIMATION
    let timerId: NodeJS.Timeout;
    let frameCounter = 0;
    const updateChart = () => {
        if (!dataProvider.isDeleted) {
            updateAnalysers(frameCounter++);
            timerId = setTimeout(updateChart, 20);
        }
    };
    updateChart();

    return {charts, dataProvider};
};

export default function AudioAnalyzer() {
    let charts: SciChartSurface[];
    let dataProvider: AudioDataProvider;

    React.useEffect(() => {
        drawExample().then(res => {
            charts = res.charts;
            dataProvider = res.dataProvider;
        });
        return () => {
            // Ensure deleting charts on React component unmount
            charts?.forEach(c => c.delete());
            // ensure releasing audio data provider
            dataProvider?.closeAudio();
        }
    }, []);

    return (
        <React.Fragment>
            <div style={{background: appTheme.Background}} className={classes.ChartWrapper}>
                <div style={{width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: appTheme.DarkIndigo}}>
                    <div id={divElementIdAudioChart} style={{ flexBasis: "50%" }}/>
                    <div style={{display: "flex", flex: 1 }}>
                        <div id={divElementIdFttChart} style={{flex: 1 }}/>
                        <div id={divElementIdChart3} style={{flex: 1 }}/>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}
