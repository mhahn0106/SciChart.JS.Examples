import * as React from "react";
import { TExampleInfo } from "../../../../AppRouter/examplePages";
import { code } from "./GENERATED_SRC";
import { githubUrl } from "./GENERATED_GITHUB_URL";
import {ExampleStrings} from "../../../ExampleStrings";

const Description = () => (<div>
    <p>Demonstrates how to create a JavaScript 3D Surface Mesh Chart. This is a chart type which draws a 3D point-marker
        (Sphere, Cylinder, Cube) or a 2D flat billboarded pointmarker (Ellipse, Quad, Pixel) at X,Y,Z locations
        in 3D Space.</p>
    <h4>Tips!</h4>
    <p>Bubbles can be colored individually, programmatically selected and scaled using the PointMetadata3D class.
        PointMetadata also allows you to tag individual bubbles with a business object of any type.</p>
    <h4>Documentation Links</h4>
    <ul>
        <li><a href={ExampleStrings.urlDocumentationHome} title={ExampleStrings.titleDocumentationHome} target="_blank">
            SciChart.js Documentation Home</a></li>
        <li><a href={ExampleStrings.urlTutorials3DHome} title={ExampleStrings.titleTutorials3DHome} target="_blank">
            SciChart3D.js Tutorials</a></li>
        <li><a href={ExampleStrings.urlSurfaceMesh3DChartDocumentation} target="_blank"
               title={ExampleStrings.urlTitleSurfaceMesh3DChartDocumentation}>JavaScript 3D Surface Mesh
            Documentation</a></li>
    </ul>
    <h4>See Also</h4>
    <ul>
        <li><a href={ExampleStrings.urlLidarFeaturedApp}
               title={ExampleStrings.urlTitleLidarFeaturedApp}>LiDAR 3D Visualization with PixelPointMarker</a></li>
        <li><a href={ExampleStrings.urlSurfaceMesh3D}
               title={ExampleStrings.urlTitleSurfaceMesh3D}>The
            JavaScript 3D Surface Mesh Chart Example</a></li>
    </ul>
</div>);
const Subtitle = () => (<p>Demonstrates how to create a <strong>JavaScript 3D Bubble Chart</strong>{' '}
    using SciChart.js, High Performance{' '}
    <a href={ExampleStrings.urlJavascriptChartFeatures} target="_blank">JavaScript 3D Charts</a></p>);

export const bubble3DChartExampleInfo: TExampleInfo = {
    title: ExampleStrings.titleBubble3DChart,
    path: ExampleStrings.urlBubble3DChart,
    subtitle: Subtitle,
    description: Description,
    code,
    githubUrl,
};
