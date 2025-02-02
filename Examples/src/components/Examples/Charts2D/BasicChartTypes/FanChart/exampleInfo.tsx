import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import { ExampleStrings } from "../../../ExampleStrings";
import { GalleryItem } from "../../../../../helpers/types/types";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";
import exampleImage from "./javascript-fan-chart.jpg";

const description = `Fan charts can be used for visualizing, forecasting
or estimation figures and can be achieved in SciChart.js using several Band Series overlaid with varying
opacity.`;
const tips = [
    `As well as stroke, you can set strokeThickness, isVisible properties to change how the series is rendered.`
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
        href: ExampleStrings.urlFanChartDocumentation,
        title: ExampleStrings.urlTitleFanChartDocumentation,
        linkTitle: "JavaScript Fan Chart Documentation"
    },
    {
        href: ExampleStrings.urlRenderSeriesPropertiesDocumentation,
        title: ExampleStrings.urlTitleRenderSeriesProperties,
        linkTitle: "Common RenderableSeries Properties"
    }
];

const Subtitle = () => (
    <p>
        Here we demonstrate how to create a <strong>JavaScript Fan Chart</strong> using SciChart.js.{" "}
        Zoom in and out to see the detail you can go to using our{" "}
        <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank" title="JavaScript Charts">
            JavaScript Charts
        </a>
    </p>
);

export const fanChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleFanChart,
    pageTitle: ExampleStrings.pageTitleFanChart,
    path: ExampleStrings.urlFanChart,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Discover how to create JavaScript Fan Chart with SciChart. Zoom in to see the detail you can go to using our JavaScript Charts. Get your free demo today. ",
    metaKeywords: "fan, chart, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
