import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-subcharts-grid.jpg";

const previewDescription = `Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript`;
const description = ``;
const tips = [
    ``,
    ``
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
        href: ExampleStrings.urlSubchartApiDocumentation,
        title: ExampleStrings.urlTitleSubCharstApiDocumentation,
        linkTitle: "Scichart.js SubCharts API Documentation"
    }
];

const Subtitle = () => (
    <p>
        Using the SubCharts API as part of <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">SciChart.js</a>, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript.
    </p>
);

export const subchartsGridExampleInfo: TExampleInfo = {
    title: "JavaScript 64-Chart Dashboard Performance Demo",
    pageTitle: "JavaScript 64-Chart Dashboard Performance Demo" + ExampleStrings.exampleGenericTitleSuffix,
    path: "/javascript-multiple-chart-dashboard-performance-demo",
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Using the SubCharts API as part of SciChart.js, this demo showcases an 8x8 grid of 64 charts updating in realtime in JavaScript",
    metaKeywords: "javascript, multichart, dashboard, performance, grid, realtime, webgl, canvas",
    thumbnailImage: exampleImage
};
