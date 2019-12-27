var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from "react";
import { View, NativeModules, Dimensions, NativeAppEventEmitter, requireNativeComponent, findNodeHandle, Platform, } from "react-native";
import * as PropTypes from "prop-types";
const LN2 = 0.6931471805599453;
const WORLD_PX_HEIGHT = 256;
const WORLD_PX_WIDTH = 256;
const ZOOM_MAX = 21;
/*if (Platform.OS === 'android') {

}*/
const REACT_CLASS = "RCTTangramMapView";
const REACT_ANDROID_CALLBACK = "RCTTangramMapViewAndroidCallback";
export class MarkerData {
}
export class Marker {
    constructor(map, id, isVisible) {
        this.map = map;
        this.id = id;
        this.isVisible = isVisible;
    }
    get ID() { return this.id; }
    getMarkerId() {
        return this.id;
    }
    setUserData(data) {
        this.userData = data;
        return this;
    }
    getUserData() {
        return this.userData;
    }
    setVisible(visible) {
        return this.map.setMarkerVisible(this.id, visible);
    }
    setDrawOrder(order) {
        return this.map.setMarkerDrawOrder(this.id, order);
    }
    setPoint(point) {
        return this.map.setMarkerPoint(this.id, point);
    }
    setPointEased(point, duration, easeType) {
        return this.map.setMarkerPointEased(this.id, point, duration, easeType);
    }
    setPolygon(polygon) {
        return this.map.setMarkerPolygon(this.id, polygon);
    }
    setPolyline(polygon) {
        return this.map.setMarkerPolyline(this.id, polygon);
    }
    setStylingFromPath(style) {
        return this.map.setMarkerStylingFromPath(this.id, style);
    }
    setStylingFromString(style) {
        return this.map.setMarkerStylingFromString(this.id, style);
    }
    setBitmap(base64Bitmap) {
        return this.map.setMarkerBitmap(this.id, base64Bitmap);
    }
}
//const { TangramEsManager } = NativeModules;
const TangramEsManager = {};
if (Platform.OS === 'android') {
    const RCTUIManager = NativeModules.UIManager;
    const commands = RCTUIManager[REACT_CLASS].Commands;
    // Since we cannot pass functions to dispatchViewManagerCommand, we keep a
    // map of callbacks and send an int instead
    const callbackMap = new Map();
    let nextCallbackId = 0;
    Object.keys(commands).forEach(command => {
        TangramEsManager[command] = (handle, ...rawArgs) => {
            const args = rawArgs.map(arg => {
                if (typeof arg === 'function') {
                    callbackMap.set(nextCallbackId, arg);
                    return nextCallbackId++;
                }
                return arg;
            });
            RCTUIManager.dispatchViewManagerCommand(handle, commands[command], args);
        };
    });
    NativeAppEventEmitter.addListener(REACT_ANDROID_CALLBACK, ([callbackId, args]) => {
        const callback = callbackMap.get(callbackId);
        if (!callback) {
            throw new Error(`Native is calling a callbackId ${callbackId}, which is not registered`);
        }
        callbackMap.delete(callbackId);
        callback.apply(null, args);
    });
}
export class MapView extends React.Component {
    constructor(props, states) {
        super(props, states);
        this.map = null;
        this.markers = new Map();
        this.state = {
            isReady: Platform.OS === 'ios',
        };
        this._onError = this._onError.bind(this);
        this._onLongPress = this._onLongPress.bind(this);
        this._onSingleTapUp = this._onSingleTapUp.bind(this);
        this._onSingleTapConfirmed = this._onSingleTapConfirmed.bind(this);
        this._onSceneReady = this._onSceneReady.bind(this);
        this._onViewComplete = this._onViewComplete.bind(this);
        this._onDoubleTap = this._onDoubleTap.bind(this);
        this._onFling = this._onFling.bind(this);
        this._onFeaturePick = this._onFeaturePick.bind(this);
        this._onMarkerPick = this._onMarkerPick.bind(this);
        this._onLabelPick = this._onLabelPick.bind(this);
        this._onPan = this._onPan.bind(this);
        this._onScale = this._onScale.bind(this);
        this._onRotate = this._onRotate.bind(this);
        this._onShove = this._onShove.bind(this);
    }
    getNativeName() {
        return REACT_CLASS;
    }
    componentDidMount() {
        if (this.refs && this.refs.map) {
            // this.requestRender();
        }
    }
    _uiManagerCommand(name) {
        return NativeModules.UIManager[this.getNativeName()].Commands[name];
    }
    _mapManagerCommand(name) {
        return NativeModules[`${this.getNativeName()}Manager`][name];
    }
    _getHandle() {
        return findNodeHandle(this.map);
    }
    _runCommand(name, args) {
        switch (Platform.OS) {
            case 'android':
                NativeModules.UIManager.dispatchViewManagerCommand(this._getHandle(), this._uiManagerCommand(name), args);
                break;
            case 'ios':
                this._mapManagerCommand(name)(this._getHandle(), ...args);
                break;
            default:
                break;
        }
    }
    _updateStyle() {
        /* const { customMapStyle } = this.props;
         this.map.setNativeProps({ customMapStyleString: JSON.stringify(customMapStyle) });*/
    }
    _onSceneReady(event) {
        const { geoPosition } = this.props;
        this.markers.clear();
        if (geoPosition) {
            this.map.setNativeProps({ geoPosition });
        }
        if (this.refs && this.refs.map) {
            this.requestRender();
        }
        this._updateStyle();
        this.setState({ isReady: true });
        if (this.props.onSceneReady)
            this.props.onSceneReady(event.nativeEvent.src);
    }
    _onPan(event) {
        if (this.props.onPan)
            this.props.onPan(event.nativeEvent.src);
    }
    _onFling(event) {
        if (this.props.onFling)
            this.props.onFling(event.nativeEvent.src);
    }
    _onScale(event) {
        if (this.props.onScale)
            this.props.onScale(event.nativeEvent.src);
    }
    _onShove(event) {
        if (this.props.onShove)
            this.props.onShove(event.nativeEvent.src);
    }
    _onRotate(event) {
        if (this.props.onRotate)
            this.props.onRotate(event.nativeEvent.src);
    }
    _onFeaturePick(event) {
        if (this.props.onFeaturePick)
            this.props.onFeaturePick(event.nativeEvent.src);
    }
    _onLabelPick(event) {
        if (this.props.onLabelPick)
            this.props.onLabelPick(event.nativeEvent.src);
    }
    _onMarkerPick(event) {
        if (this.props.onMarkerPick)
            this.props.onMarkerPick(event.nativeEvent.src);
    }
    _onViewComplete(event) {
        if (this.props.onViewComplete)
            this.props.onViewComplete(event.nativeEvent.src);
    }
    _onError(event) {
        if (this.props.onError)
            this.props.onError(event.nativeEvent.src);
    }
    _onDoubleTap(event) {
        if (this.props.onDoubleTap)
            this.props.onDoubleTap(event.nativeEvent.src);
    }
    _onLongPress(event) {
        if (this.props.onLongPress)
            this.props.onLongPress(event.nativeEvent.src);
    }
    _onSingleTapUp(event) {
        if (this.props.onSingleTapUp)
            this.props.onSingleTapUp(event.nativeEvent.src);
    }
    _onSingleTapConfirmed(event) {
        if (this.props.onSingleTapConfirmed)
            this.props.onSingleTapConfirmed(event.nativeEvent.src);
    }
    getGeoPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.getGeoPosition(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                });
            });
            return pr;
        });
    }
    getRotation() {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.getRotation(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                });
            });
            return pr;
        });
    }
    getTilt() {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.getTilt(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                });
            });
            return pr;
        });
    }
    getZoom() {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.getZoom(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                });
            });
            return pr;
        });
    }
    getCameraType() {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.getCameraType(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                });
            });
            return pr;
        });
    }
    setGeoPosition(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setGeoPosition(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, pos);
            });
            return pr;
        });
    }
    setTilt(tilt) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setTilt(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, tilt);
            });
            return pr;
        });
    }
    setZoom(zoom) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setZoom(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, zoom);
            });
            return pr;
        });
    }
    setRotation(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setRotation(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, amount);
            });
            return pr;
        });
    }
    setCameraType(cameraType) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setCameraType(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, cameraType);
            });
            return pr;
        });
    }
    setPickRadius(radius) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setPickRadius(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, radius);
            });
            return pr;
        });
    }
    setGeoPositionEase(pos, duration, easeType) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setPositionEase(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, pos, duration, easeType ? easeType : "CUBIC");
            });
            return pr;
        });
    }
    setTiltEase(tilt, duration, easeType) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setTiltEase(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, tilt, duration, easeType ? easeType : "CUBIC");
            });
            return pr;
        });
    }
    setZoomEase(zoom, duration, easeType) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setZoomEase(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, zoom, duration, easeType ? easeType : "CUBIC");
            });
            return pr;
        });
    }
    setRotationEase(amount, duration, easeType) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setRotationEase(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, amount, duration, easeType ? easeType : "CUBIC");
            });
            return pr;
        });
    }
    pickFeature(posx, posy) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.pickFeature(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve();
                }, posx, posy);
            });
            return pr;
        });
    }
    pickLabel(posx, posy) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.pickLabel(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve();
                }, posx, posy);
            });
            return pr;
        });
    }
    pickMarker(posx, posy) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.pickMarker(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve();
                }, posx, posy);
            });
            return pr;
        });
    }
    addDataLayer(layername, jsonData) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.addDataLayer(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, layername, jsonData);
            });
            return pr;
        });
    }
    addPolygonMapDataLayer(layername, points, propeties) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.addPolygonMapDataLayer(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, layername, points, propeties);
            });
            return pr;
        });
    }
    addPolylineMapDataLayer(layername, points, propeties) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.addPolylineMapDataLayer(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, layername, points, propeties);
            });
            return pr;
        });
    }
    clearMapDataLayer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setPickRadius(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, name);
            });
            return pr;
        });
    }
    removeMapDataLayer(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setPickRadius(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, name);
            });
            return pr;
        });
    }
    addMarker() {
        return __awaiter(this, void 0, void 0, function* () {
            const that = this;
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.addMarker(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (marker) => {
                    const mk = new Marker(that, marker.markerID, marker.isVisible);
                    that.markers.set(mk.ID, mk);
                    resolve(mk);
                });
            });
            return pr;
        });
    }
    putMarker(isVisible, drawOrder, point, polygon, polyline, style, drawableID, drawable) {
        const that = this;
        let pr = new Promise((resolve, reject) => {
            TangramEsManager.putMarker(findNodeHandle(this), (err) => {
                reject(new Error(err));
            }, (marker) => {
                const mk = new Marker(that, marker.markerID, marker.isVisible);
                that.markers.set(mk.ID, mk);
                resolve(mk);
            }, isVisible, drawOrder, point, polygon, polyline, style, drawableID, drawable);
        });
        return pr;
    }
    updateMarker(markerID, isVisible, drawOrder, point, polygon, polyline, style, drawableID, drawable) {
        const that = this;
        let pr = new Promise((resolve, reject) => {
            TangramEsManager.updateMarker(findNodeHandle(this), (err) => {
                reject(new Error(err));
            }, (marker) => {
                if (that.markers.has(marker.markerID)) {
                    resolve(that.markers.get(marker.markerID));
                }
                else {
                    const mk = new Marker(that, marker.markerID, marker.isVisible);
                    that.markers.set(mk.ID, mk);
                    resolve(mk);
                }
            }, markerID, isVisible, drawOrder, point, polygon, polyline, style, drawableID, drawable);
        });
        return pr;
    }
    /**
     * Remove a map marker by markerid
     *
     * @param {number} markerID
     * @returns {number}
     *
     * @memberOf MapView
     */
    removeMarker(markerID) {
        const that = this;
        let pr = new Promise((resolve, reject) => {
            TangramEsManager.removeMarker(findNodeHandle(this), (err) => {
                reject(new Error(err));
            }, (result) => {
                that.markers.delete(result);
                resolve(result);
            }, markerID);
        });
        return pr;
    }
    /**
     * Remove all map markers .
     *
     * @returns
     *
     * @memberOf MapView
     */
    removeAllMarkers() {
        const that = this;
        let pr = new Promise((resolve, reject) => {
            TangramEsManager.removeAllMarkers(findNodeHandle(this), (err) => {
                reject(new Error(err));
            }, (result) => {
                that.markers.clear();
                resolve(result);
            });
        });
        return pr;
    }
    setMarkerVisible(mid, visible) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerVisible(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, visible);
            });
            return pr;
        });
    }
    setMarkerDrawOrder(mid, order) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerDrawOrder(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, order);
            });
            return pr;
        });
    }
    setMarkerBitmap(mid, bitmapBase64) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerBitmap(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, bitmapBase64);
            });
            return pr;
        });
    }
    setMarkerPoint(mid, point) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerPoint(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, point);
            });
            return pr;
        });
    }
    setMarkerPointEased(mid, point, duration, easeType) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerPoint(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, point, duration, easeType ? easeType : "CUBIC");
            });
            return pr;
        });
    }
    setMarkerPolygon(mid, polygon) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerPolygon(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, polygon);
            });
            return pr;
        });
    }
    setMarkerPolyline(mid, polyline) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerPolyline(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, polyline);
            });
            return pr;
        });
    }
    setMarkerStylingFromPath(mid, stylePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerStylingFromPath(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, stylePath);
            });
            return pr;
        });
    }
    setMarkerStylingFromString(mid, style) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.setMarkerStylingFromString(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result.result);
                }, mid, style);
            });
            return pr;
        });
    }
    requestRender() {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.requestRender((err) => {
                    reject(new Error(err));
                }, () => {
                    resolve();
                });
            });
            return pr;
        });
    }
    updateSceneAsync(scneUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.updateSceneAsync((err) => {
                    reject(new Error(err));
                }, () => {
                    resolve();
                }, scneUpdates);
            });
            return pr;
        });
    }
    loadSceneFile(scenePath, scneUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.loadSceneFile((err) => {
                    reject(new Error(err));
                }, () => {
                    resolve();
                }, scenePath, scneUpdates);
            });
            return pr;
        });
    }
    loadSceneFileAsync(scenePath, scneUpdates) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.loadSceneFileAsync((err) => {
                    reject(new Error(err));
                }, () => {
                    resolve();
                }, scenePath, scneUpdates);
            });
            return pr;
        });
    }
    useCachedGlState(cache) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.useCachedGlState((err) => {
                    reject(new Error(err));
                }, () => {
                    resolve();
                }, cache);
            });
            return pr;
        });
    }
    /**
     * Convert a geo position to screen position
     *
     * @param {PointF} pos
     * @returns {LngLat}
     *
     * @memberOf MapView
     */
    screenToLngLat(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.screenToLngLat(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, pos);
            });
            return pr;
        });
    }
    /**
     * Convert screen
     *
     * @param {LngLat} pos
     * @returns {PointF}
     *
     * @memberOf MapView
     */
    lngLatToScreen(pos) {
        return __awaiter(this, void 0, void 0, function* () {
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.lngLatToScreen(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    resolve(result);
                }, pos);
            });
            return pr;
        });
    }
    captureFrame(waiting, compressRate, width, height) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            waiting = waiting ? waiting : true;
            let pr = new Promise((resolve, reject) => {
                TangramEsManager.captureFrame(findNodeHandle(this), (err) => {
                    reject(new Error(err));
                }, (result) => {
                    if (result) {
                        result.data = `data:image/png;base64,${result.base64Data}`;
                    }
                    resolve(result);
                }, waiting, compressRate, width, height);
            });
            return pr;
        });
    }
    screenCenterPoint() {
        const { height, width } = Dimensions.get("window");
        return { y: height / 2, x: width / 2 };
    }
    computeHeading(from, to) {
        return null;
    }
    calcZoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / LN2);
    }
    latRad(lat) {
        const sin = Math.sin(lat * Math.PI / 180);
        const radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
    }
    getBoundsZoomLevel(ne, sw, mapWidthPx, mapHeightPx) {
        const latFraction = (this.latRad(ne.latitude) - this.latRad(sw.latitude)) / Math.PI;
        const lngDiff = ne.longitude - sw.longitude;
        const lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;
        const latZoom = this.calcZoom(mapHeightPx, WORLD_PX_HEIGHT, latFraction);
        const lngZoom = this.calcZoom(mapWidthPx, WORLD_PX_WIDTH, lngFraction);
        const result = Math.min(latZoom, lngZoom);
        return Math.min(result, ZOOM_MAX);
    }
    fitToBounds(positions, padding, duration) {
        return __awaiter(this, void 0, void 0, function* () {
            const { height, width } = Dimensions.get("window");
            let minLat = Number.MIN_SAFE_INTEGER;
            let maxLat = Number.MAX_SAFE_INTEGER;
            let minLon = Number.MIN_SAFE_INTEGER;
            let maxLon = Number.MAX_SAFE_INTEGER;
            duration = duration || 1000;
            padding = padding || 0;
            for (const item of positions) {
                const lat = item.latitude;
                const lon = item.longitude;
                maxLat = Math.max(lat, maxLat);
                minLat = Math.min(lat, minLat);
                maxLon = Math.max(lon, maxLon);
                minLon = Math.min(lon, minLon);
            }
            const ne = { latitude: maxLat, longitude: maxLon };
            const sw = { latitude: minLat, longitude: minLon };
            const midpoint = { latitude: (maxLat + minLat) / 2, longitude: (maxLon + minLon) / 2 };
            const zoomToFit = this.getBoundsZoomLevel(ne, sw, width - padding, height - padding);
            yield this.setGeoPositionEase(midpoint, duration);
            return this.setZoomEase(zoomToFit, duration);
        });
    }
    render() {
        const { style } = this.props;
        const TangramMapView = RCTTangramMapView;
        return (<TangramMapView ref={ref => { this.map = ref; }} style={[style && style]} onDoubleTap={this._onDoubleTap} onViewComplete={this._onViewComplete} onError={this._onError} onFeaturePick={this._onFeaturePick} onFling={this._onFling} onLabelPick={this._onLabelPick} onPan={this._onPan} onMarkerPick={this._onMarkerPick} onSceneReady={this._onSceneReady} onSingleTapUp={this._onSingleTapUp} onLongPress={this._onLongPress} onSingleTapConfirmed={this._onSingleTapConfirmed} onRotate={this._onRotate} onScale={this._onScale} onShove={this._onShove} {...this.props}></TangramMapView>);
    }
}
MapView.defaultProps = {
    scenePath: "default_scene.yaml",
    cameraType: "FLAT",
    cacheName: "tile_cache",
    cacheSize: 30,
    zoom: 14,
    minZoom: 1,
    maxZoom: 24,
    handleDoubleTap: true,
    handleSingleTapUp: true,
    handleSingleTapConfirmed: true,
    handlePan: true,
    handleFling: true,
};
MapView.propTypes = Object.assign(Object.assign({}, View.propTypes), { scenePath: PropTypes.string, sceneUpdates: PropTypes.any, layers: PropTypes.array, geoPosition: PropTypes.shape({
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired
    }), pickRadius: PropTypes.number, cacheName: PropTypes.string, cacheSize: PropTypes.number, cameraType: PropTypes.oneOf(["PERSPECTIVE", "ISOMETRIC", "FLAT"]), zoom: PropTypes.number, minZoom: PropTypes.number, maxZoom: PropTypes.number, tilt: PropTypes.number, minTilt: PropTypes.number, maxTilt: PropTypes.number, rotate: PropTypes.number, minRotate: PropTypes.number, maxRotate: PropTypes.number, 
    /**
    * Callback that is called once, when the error has occured.
    */
    onError: PropTypes.func, 
    /**
   * Callback that is called once, when the map reloading scene.
   */
    onSceneReloading: PropTypes.func, 
    /**
    * Callback that is called once, when the map reload scene.
    */
    onSceneReloaded: PropTypes.func, 
    /**
    * Callback that is called once, when the scene ready.
    */
    onSceneReady: PropTypes.func, 
    /**
            * Callback that is called once, when the feature pick.
            */
    onFeaturePick: PropTypes.func, 
    /**
    * Callback that is called once, when the label pick.
    */
    onLabelPick: PropTypes.func, 
    /**
    * Callback that is called once, when the marker pick.
    */
    onMarkerPick: PropTypes.func, 
    /**
    * Callback that is called once, when the double tap.
    */
    onDoubleTap: PropTypes.func, 
    /**
           * Callback that is called once, when the long press.
           */
    onLongPress: PropTypes.func, 
    /**
    * Callback that is called once, when the single tap.
    */
    onSingleTapUp: PropTypes.func, 
    /**
           * Callback that is called once, when the single tap confirmed.
           */
    onSingleTapConfirmed: PropTypes.func, 
    /**
    * Callback that is called once, when the view completed.
    */
    onViewComplete: PropTypes.func, 
    /**
            * Callback that is called once, when the pan.
            */
    onPan: PropTypes.func, 
    /**
    * Callback that is called once, when the pan fling.
    */
    onFling: PropTypes.func, 
    /**
           * Callback that is called once, when the scale changed.
           */
    onScale: PropTypes.func, 
    /**
   * Callback that is called once, when the rotating.
   */
    onRotate: PropTypes.func, 
    /**
   * Callback that is called once, when the shoving two finger.
   */
    onShove: PropTypes.func, handleDoubleTap: PropTypes.bool, handleSingleTapUp: PropTypes.bool, handleSingleTapConfirmed: PropTypes.bool, handleFling: PropTypes.bool, handlePan: PropTypes.bool, handleScale: PropTypes.bool, handleShove: PropTypes.bool, handleRotate: PropTypes.bool });
const MapViewInterface = {
    name: "MapView",
    propTypes: MapView.propTypes
};
const RCTTangramMapView = requireNativeComponent('RCTTangramMapView', MapViewInterface, {
    nativeOnly: {
        onChange: true,
    },
});
//# sourceMappingURL=MapView.js.map