import { motionLinesAddLine, motionLinesRemoveLine } from "../actions";
import { WEBSOCKET_MESSAGE } from "@giantmachines/redux-websocket";

export const customWebsocketMiddleware = store => next => action => {
    if (action.type === WEBSOCKET_MESSAGE) {
        let totalPayload; // parse through each payload
        try {
            totalPayload = JSON.parse(action.payload.data);

            // For each payload data 
            totalPayload.forEach((payloadDataChunk, i) => {

                const payloadType = payloadDataChunk.type;

                switch (payloadType) {
                    case "draw":
                        let lineId = (new Date()).getTime() + "-" + i;
                        let tempData = payloadDataChunk.data ? payloadDataChunk.data : {};
                        let shape = tempData.shape;
                        let coords = tempData.coords;

                        store.dispatch(motionLinesAddLine({
                            lineId,
                            shape,
                            coords

                        }))
                        setTimeout(() => {
                            store.dispatch(motionLinesRemoveLine({
                                lineId
                            }));
                        }, 1500); // NOTE: this 1500ms should be the same value as what's in App.css for .MotionLine.fadeOut's keyframe animation
                        break;
                    default:
                        break;
                }
            });
        } catch (e) { }
    }
    // window.c_cm = {
    //     store,
    //     next,
    //     action
    // };

    next(action);
}