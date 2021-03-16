import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpes/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpes/types/types";
import load500By500 from "../Load500By500/javascript-chart-load-500-series-by-500-points.jpg";
import ghostedTracesImg from "../RealtimeGhostedTraces/javascript-realtime-ghosted-traces-chart.jpg";
import millionPointsDemoImg from "../Load1MillionPoints/javascript-chart-performance-one-million-points.jpg";
import Gallery from "../../../../Gallery/Gallery";
import ExampleDescription from "../../../../ExampleDescription/ExampleDescription";

const Subtitle = () => (
    <p>
        Demonstrates appending <strong>millions of points</strong> to a line chart with SciChart.js, High Performance{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">
            JavaScript Charts
        </a>
    </p>
);

const seeAlso: GalleryItem[] = [
    {
        chartGroupTitle: "See also",
        items: [
            {
                imgPath: load500By500,
                title: ExampleStrings.titleLoad500By500,
                seoTitle:
                    "This demo showcases the incredible performance of our JavaScript Chart by loading 500 series with 500 points (250k points) instantly!",
                examplePath: ExampleStrings.urlLoad500By500
            },
            {
                imgPath: ghostedTracesImg,
                title: ExampleStrings.titleRealtimeGhostedTraces,
                seoTitle: "Realtime Ghosted Traces JavaScript Chart Performance demo",
                examplePath: ExampleStrings.urlRealtimeGhostedTraces
            },
            {
                imgPath: millionPointsDemoImg,
                title: ExampleStrings.titleLoadOneMillionPoints,
                seoTitle: "Load One Million Points in a JavaScript Chart Performance Demo",
                examplePath: ExampleStrings.urlLoadOneMillionPoints
            }
        ]
    }
];

const previewDescription = ``;
const description = `Demonstrates the speed and power of SciChart.js in a real-time example. Creates a timer and pushes 1,000
points every 10ms to 3 line series on the chart (300k points per second). The point count quickly rises into
the millions, and SciChart is still rendering!`;
const tips = [
    `For the fastest possible way of creating and appending data to a SciChartSurface, use the overloaded
    appendRange functions on dataseries.`
];
const documentationLinks: TDocumentationLink[] = [
    {
        href: ExampleStrings.urlDocumentationHome,
        title: ExampleStrings.titleDocumentationHome,
        linkTitle: "SciChart.js Documentation Home"
    },
    {
        href: ExampleStrings.urlTutorialsHome,
        title: ExampleStrings.titleTutorialsHome,
        linkTitle: "SciChart.js Tutorials"
    },
    {
        href: ExampleStrings.urlPerformanceTipsDocumentation,
        title: ExampleStrings.urlTitlePerformanceTipsDocumentation,
        linkTitle: "SciChart.js Performance Tips and Tricks"
    }
];

const SeeAlsoComponent = () => <Gallery examples={seeAlso} />;

const Description = () => (
    <div>
        <ExampleDescription
            documentationLinks={documentationLinks}
            tips={tips}
            description={description}
            previewDescription={previewDescription}
            seeAlso={seeAlso}
        />
    </div>
);

export const realtimePerformanceDemoExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleRealtimeJavaScriptChartDemo,
    path: ExampleStrings.urlRealtimeJavaScriptChartDemo,
    subtitle: Subtitle,
    description: Description,
    seeAlso: SeeAlsoComponent,
    code,
    githubUrl,
    seoDescription:
        "This demo showcases the incredible realtime performance of our JavaScript charts by updating the series with millions of data-points!",
    seoKeywords: "realtime, performance, demo, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-chart-realtime-performance-demo.jpg"
};
