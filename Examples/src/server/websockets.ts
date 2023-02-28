import * as http from "http";
import * as socketIo from "socket.io";
import fetch from 'node-fetch';
import { response } from "express";

// $.ajax({
//     url: "/data/getStatusList/" + productType + /" + prodId + "/" + gearStatusOffset + "/" + dataPerReq + "/" + fMode,
//     ex) http://10.10.17.18:8080/data/getStatusList/gear/15/100/100/0
//     method: "GET",
// });

type _chartData = {
    data_seq: number;
    cht_val_1: number;
    cht_val_2: number;
    cht_val_3: number;
    cht_val_4: number;
    failure_mode: number;
}

type _baseDataMessage = {
    code: number;
    status: string;
    message: string;
    dataList: _chartData[];
};

type chartData = {
    x: number[];
    ys: number[][];
    failures: number[];
};

async function fetchDataFromWAS(
    modelType = 'gear',
    productId = 15,
    statusOffset = 100,
    dataPerReq = 10,
    fMode = 0) : Promise<chartData>
{
    console.log("In fetchDataFromWAS(): %s, %d, %d, %d, %d", modelType, productId, statusOffset, dataPerReq, fMode);
  
    let url: string;
    url = "http://10.10.17.18:8080/data/getStatusList/" ;
    url += modelType + "/";
    url += productId + "/";
    url += statusOffset + "/";
    url += dataPerReq + "/";
    url += fMode;

    const response = await fetch(url);
    if (response.status != 200) {
        console.log("URL : " + url);
        console.log("response status =" + response.status);
        // need to add return code.. ---.---;;
    }

    const _jsonObj = await response.json();
    const dataArr : _chartData[] = (_jsonObj as _baseDataMessage).dataList;

    if (dataArr == null ||  dataArr == undefined) {
        return null;
    }

    const len_ = 4;
    // Temporary arry for fast insertion. Do not forget for delete.
    const chartVals : number[][] = new Array(len_);
    {
        let ii: number = 0;
        dataArr.forEach(e => {
            if (ii===0) {
                chartVals[0] = [];
                chartVals[1] = [];
                chartVals[2] = [];
                chartVals[3] = [];
                ii += 1;
            }
            chartVals[0].push(e.cht_val_1);
            chartVals[1].push(e.cht_val_2);
            chartVals[2].push(e.cht_val_3);
            chartVals[3].push(e.cht_val_4);
        });
    }
// console.log(chartVals);
// return;
    const x: number[] = [];
    const ys: number[][] = new Array(len_);
    const failures: number[] = []; // failure_mode
    let nextx = statusOffset;
    const pointsPerUpdate = dataPerReq;
    for (let i = 0; i < pointsPerUpdate; i++) { // data requested
        x.push(nextx); // x is a just step index
        nextx++;
        for (let s = 0; s < len_; s++) { // we need (series.length) seriesData
            if (i === 0) { // populate array at index 0.
                ys[s] = [];
            }
            let nextY = chartVals[s][i]; // pickup next y data.
            ys[s].push(nextY); // store next y data
        }
        failures.push((dataArr[i].failure_mode > 0 ) ? 1000 : 0);
    }

    console.log("----Got %d data from WAS-----", x.length);
    chartVals.length = 0;

    const ret: chartData = {x, ys, failures} as chartData;

    return ret;
}

// --- code block: fetch data from WAS

type TSubscription = {
    series: number[];
    startX: number;
    pointsPerUpdate: number;
    sendEvery: number;
    positive: boolean;
    scale: number;
    modelType: string;
    productId: number;
    fMode: number;
};

function send_(socket:any, data:chartData)
{
    console.log("in send_(): " + socket + ",,," + data);
    if (data == null || data == undefined)
        return;

    const x = data.x;
    const ys = data.ys;
    const failures = data.failures;
    let date = new Date()
    socket.emit("data", {x, ys, failures, sendTime: date.getTime()});
    date = null;
}
const sendData = (
    socket: any,
    series: number[],
    nextx: number,
    pointsPerUpdate: number,
    sendEvery: number,
    stopX: number,
    positive: boolean,
    scale: number,
    modelType: string,
    productId: number,
    fMode: number
): void => {
    if (!socket.wantsData) {
        return;
    }

    console.log(`Creating ${pointsPerUpdate} points for ${series.length} series starting at x=${nextx}`);
    
    const isDataFromWas: boolean = true;
    if (isDataFromWas) {
        fetchDataFromWAS(modelType, productId, nextx, pointsPerUpdate).then(value => send_(socket, value));
        nextx += pointsPerUpdate;
    } else { // old code.
        const x: number[] = [];
        const ys: number[][] = new Array(series.length);
        for (let i = 0; i < pointsPerUpdate; i++) { // data requested
            x.push(nextx); // x is a just step index
            nextx++;
            for (let s = 0; s < series.length; s++) { // we need (series.length) seriesData
                if (i === 0) { // populate array at index 0.
                    ys[s] = [];
                }
                let nextY = series[s] + Math.random() * scale - scale / 2; // pickup next y data.
                if (positive) {
                    nextY = Math.abs(nextY);
                }
                ys[s].push(nextY); // store next y data
                series[s] = nextY; // series store last y value.
            }
        }
        socket.emit("data", { x, ys, sendTime: new Date().getTime() });

    }
    if (nextx < stopX) {
        setTimeout(() => {
            sendData(socket, series, nextx, pointsPerUpdate, sendEvery, stopX, positive, scale, modelType, productId, fMode);
        }, sendEvery);
    } else {
        console.log("In senddata() : nextx(%d) > stopX(%d) --> finished", nextx, stopX);
        socket.emit("finished");
    }
};

// tslint:disable: no-console
export const createSocketServer = (server: http.Server): void => {
    const io = new socketIo.Server(server, { 
        serveClient: false, 
        cors: {
            origin: ["http://localhost:8080","http://localhost:8081", "http://localhost:8085"],
            methods: ["GET", "POST"]
        } 
    });
  
    // listen on every connection
    io.on("connection", (socket) => {
        console.log("New user connected, socket.id", socket.id);

        socket.on("getData", (message: TSubscription) => {
            console.log("subscribe from ", socket.id, message);
            // @ts-ignore
            socket.wantsData = true;
            sendData(
                socket,
                message.series,
                message.startX,
                message.pointsPerUpdate,
                message.sendEvery,
                message.startX + 1000000 * message.pointsPerUpdate,
                message.positive,
                message.scale,
                message.modelType,
                message.productId,
                message.fMode
            );
        });

        // Disconnect
        socket.on("disconnect", () => {
            // @ts-ignore
            socket.wantsData = false;
            console.log("disconnect, socket.id", socket.id);
        });
    });
};
