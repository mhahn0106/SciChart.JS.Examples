import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import { GalleryItem } from "../../../../../helpers/types/types";

const previewDescription = `SciChart.js supports Candlestick Charts or OHLC with custom colours per bar and Date X-Axis.`;
const description = `OHLC charts can be animated, dynamically updated for real trading apps or combined with other series types to draw technical indicators or shapes.`;
const tips = [
    `Try dragging on the chart to pan or zoom it. Use the mousewheel to zoom and double-click to zoom to fit.`
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
        href: ExampleStrings.urlOhlcChartDocumentation,
        title: ExampleStrings.urlTitleOhlcChartDocumentation,
        linkTitle: "JavaScript OHLC Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const Subtitle = () => (
    <p>
        For this example, we demonstrate how to create a <strong>JavaScript OHLC Chart</strong>{" "}
        or Stock Chart using SciChart.js. This is our powerful{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Chart Component">
            JavaScript Chart Component
        </a>.
    </p>
);

export const ohlcChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleOhlcChart,
    pageTitle: ExampleStrings.pageTitleOhlcChart,
    path: ExampleStrings.urlOhlcChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    previewDescription,
    githubUrl,
    metaDescription:
        "Easily create JavaScript OHLC Chart or Stock Chart using feature-rich SciChart.js chart library. Supports custom colors. Get your free trial now. ",
    metaKeywords: "ohlc, stock, trading, chart, javascript, webgl, canvas",
    thumbnailImage: "javascript-ohlc-chart.jpg"
};
