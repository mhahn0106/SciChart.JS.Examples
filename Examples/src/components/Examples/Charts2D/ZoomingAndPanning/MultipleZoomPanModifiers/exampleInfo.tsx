import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import * as React from "react";
import { ExampleStrings } from "../../../ExampleStrings";
import exampleImage from "./zoom-pan-multiple-modifiers.jpg";
import { TDocumentationLink } from "../../../../../helpers/types/ExampleDescriptionTypes";

const description = `Scroll Middle Mouse button to zoom in/zoom out. Use Right Mouse Button to select an area on the chart with RubberBandXyZoomModifier. Try it out on touch devices: use pinch zoom gesture to scale.`;
const tips = [
    `Use 'executeOn' property to assign a Modifier to specific mouse button. `,
    `Use 'easingFunction' property to animate zoom. `,
    `Use CSS 'touch-action' property to override browser default touch behavior. e.g., 'touch-action: none'. `,
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
    }
];

const Subtitle = () => (
    <p>
        Demonstrates different <strong>Zoom and Pan Modifiers on a JavaScript Chart</strong> including Mousewheel, Pinchzoom, Rubber-band zoom.
    </p>
);

export const zoomAndPanWithMultipleChartModifiersExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleZoomPanWithMultipleChartModifiers,
    pageTitle: ExampleStrings.titleZoomPanWithMultipleChartModifiers + ExampleStrings.exampleGenericTitleSuffix,
    path: ExampleStrings.urlZoomPanWithMultipleChartModifiers,
    subtitle: Subtitle,
    documentationLinks,
    tips,
    description,
    githubUrl,
    metaDescription:
        "Demonstrates how to use multiple Zoom and Pan Modifiers on a JavaScript Chart with SciChart.js",
    metaKeywords: "zoom, pan, pinch, touch, scale, javascript, webgl, canvas",
    thumbnailImage: exampleImage
};
