import * as React from "react";
import { useLocation } from "react-router-dom";
import { Theme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import AppRouter from "./AppRouter/AppRouter";
import {
    ALL_MENU_ITEMS,
    getParentMenuIds,
    MENU_ITEMS_2D,
    MENU_ITEMS_3D,
    MENU_ITEMS_FEATURED_APPS,
} from "./AppRouter/examples";
import AppBarTop from "./AppTopBar/AppBarTop";
import DrawerContent from "./DrawerContent/DrawerContent";
import AppFooter from "./AppFooter/AppFooter";
import { EXAMPLES_PAGES } from "./AppRouter/examplePages";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { SciChartDefaults } from "scichart/Charting/Visuals/SciChartDefaults";
import classes from "./App.module.scss";
import "./index.scss";
import Gallery from "./Gallery/Gallery";
import { PAGES } from "./AppRouter/pages";
import {GalleryItem} from "../helpers/types/types";
import {allGalleryItems, getSeeAlsoGalleryItems} from "../helpers/SciChartExamples";

export default function App() {
    const location = useLocation();
    // For charts without layout we use '/iframe' prefix, for example '/iframe/javascript-multiline-labels'
    const isIFrame = location.pathname.substring(1, 7) === 'iframe';
    const pathname = isIFrame ? location.pathname.substring(7) : location.pathname;

    const isMedium = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

    let initialOpenedMenuItems = {
        MENU_ITEMS_FEATURED_APPS_ID: true,
        MENU_ITEMS_3D_ID: true,
        MENU_ITEMS_2D_ID: true,
    };

    MENU_ITEMS_FEATURED_APPS.forEach(item => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });
    MENU_ITEMS_3D.forEach(item => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });
    MENU_ITEMS_2D.forEach(item => {
        initialOpenedMenuItems = { ...initialOpenedMenuItems, [item.item.id]: true };
    });

    const [openedMenuItems, setOpenedMenuItems] = React.useState<Record<string, boolean>>(initialOpenedMenuItems);

    const [isDrawerOpened, setIsDrawerOpened] = React.useState(false);

    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find(key => EXAMPLES_PAGES[key].path === pathname);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];
    const currentExampleId = currentExample?.id;
    // SeeAlso is now optional on exampleInfo. Return this if provided else auto-generate from menu
    const seeAlso: GalleryItem[] = currentExample?.seeAlso ?? getSeeAlsoGalleryItems(ALL_MENU_ITEMS, currentExample);

    // // Find the example category
    // const exampleCategory = ALL_MENU_ITEMS.find(menuItem => {
    //     return menuItem.submenu.find(subMenu => subMenu.id === examplePage.id) !== undefined;
    // });
    // // Generate the seeAlso gallery items
    // const seeAlso: GalleryItem[] = examplePage?.seeAlso;

    const setOpenedMenuItem = (id: string, value: boolean = true) => {
        setOpenedMenuItems({ ...openedMenuItems, [id]: value });
    };

    const toggleOpenedMenuItem = (id: string) => setOpenedMenuItem(id, !openedMenuItems[id]);
    const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

    React.useEffect(() => {
        // For deployment to demo.scichart.com we are getting the license from the server
        // where it is set by environment variable.
        // When you npm run dev,
        // the beta trial key is served by the webpack dev server (webpack.client.no_server.config)
        // fetch("/api/license")
        //     .then(r => r.text())
        //     .then(key => SciChartSurface.setRuntimeLicenseKey(key));
        SciChartSurface.setRuntimeLicenseKey(
            "jfSxdnk34WloNyMt+qY0yhrB38zDm+awSDoCsWcflED/o+YAvdZJo9YVIHP80Y2QYiaDbcld7TIwAMkaPchHnPiX8jyHJ/bPNv58I7fTawRUbDfkastBk8ViSUzU+1uc6w+R6amhPCDlURXHA3ScgfPlM0e190MXbCowC3rxq8HlGzbE846FOKSUripZcSWLK9ic4rxyS/xeYq0yhwZ+UW4q6ffmhXR7VMtINelC6tcqH6lrm4oEQd5i0nj2kPqmTz+C5Ckw/OBj6K2nqLsEiBvsdiAS1qDJgK5ydmIGWKOk/xxwZVBtVEWsoi90tFAGa7czs1CnMDEvfVoAXMp4BW4QKXodOoOnnqlL+p7l6x714zSvqD9Td5VZk1dFtCY4ek7rQeWbaEqvRs+pWzjY+RLwBpKxs3FGzi7HpNteaXZQ8Avr9jTsH5nPMjNylnbIA7VWqWXrRZ8wP2KmFO+fgKk1HehqnhqsLhj54dq50ze7fua7XsYRjkzbPMUp/qXXHI5iCfENJagCifVlKCH2nTxhdH7AiHZDQKp2eem6FlL7b+goyrviKp5mjBbo"
        );

        SciChartDefaults.useSharedCache = true;
        if (currentExample) {
            const parentMenuIds = getParentMenuIds(currentExample.id);
            const updatedOpenedItems: Record<string, boolean> = { ...openedMenuItems };
            parentMenuIds.forEach(elId => {
                updatedOpenedItems[elId] = true;
            });
            setOpenedMenuItems(updatedOpenedItems);
        }
    }, [currentExampleId]);

    if (isIFrame) {
        return <AppRouter currentExample={currentExample} seeAlso={seeAlso} isIFrame={true}/>
    }

    const testIsOpened = (id: string): boolean => !!openedMenuItems[id];
    return (
        <div className={classes.App}>
            <Drawer
                className={classes.DrawerMobile}
                variant="temporary"
                classes={{ paper: classes.DrawerPaper }}
                anchor="right"
                open={isMedium && isDrawerOpened}
                onClose={toggleDrawer}
            >
                <DrawerContent
                    testIsOpened={testIsOpened}
                    toggleOpenedMenuItem={toggleOpenedMenuItem}
                    toggleDrawer={toggleDrawer}
                />
            </Drawer>
            <div className={classes.MainAppContent}>
                <AppBarTop toggleDrawer={toggleDrawer} currentExample={currentExample} />
                {PAGES.homapage.path === location.pathname && <AppRouter currentExample={currentExample} seeAlso={[]} />}

                <div className={classes.MainAppWrapper}>
                    <div className={classes.DrawerDesktop}>
                        <DrawerContent
                            testIsOpened={testIsOpened}
                            toggleOpenedMenuItem={toggleOpenedMenuItem}
                            toggleDrawer={() => {}}
                        />
                    </div>
                    {PAGES.homapage.path === location.pathname ? (
                        <div className={classes.GalleryAppWrapper}>
                            <Gallery examples={allGalleryItems} />
                        </div>
                    ) : (
                        <AppRouter currentExample={currentExample} seeAlso={seeAlso} />
                    )}
                </div>

                <AppFooter />
            </div>
        </div>
    );
}
