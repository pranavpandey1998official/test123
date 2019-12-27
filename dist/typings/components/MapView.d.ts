import * as React from "react";
import { ViewStyle, StyleProp, ViewProperties } from "react-native";
export interface BitmapData {
    format: "PNG";
    height: number;
    width: number;
    data: string;
    base64Data: string;
}
export interface PointF {
    x: number;
    y: number;
}
export interface Polygon {
    points: Array<Array<LngLat>>;
    properties: Map<string, string>;
}
export interface Polyline {
    points: LngLat[];
    properties: Map<string, string>;
}
export declare type EaseType = "LINEAR" | "CUBIC" | "QUINT" | "SINE";
export declare class MarkerData {
    markerID: number;
    isVisible?: boolean;
    result?: any;
}
export declare class Marker {
    private map;
    private id;
    private isVisible?;
    private userData;
    constructor(map: MapView, id: number, isVisible?: boolean);
    get ID(): number;
    getMarkerId(): number;
    setUserData<T>(data: T): Marker;
    getUserData<T>(): T;
    setVisible(visible: boolean): Promise<boolean>;
    setDrawOrder(order: number): Promise<boolean>;
    setPoint(point: LngLat): Promise<boolean>;
    setPointEased(point: LngLat, duration: number, easeType?: EaseType): Promise<boolean>;
    setPolygon(polygon: Polygon): Promise<boolean>;
    setPolyline(polygon: Polyline): Promise<boolean>;
    setStylingFromPath(style: string): Promise<boolean>;
    setStylingFromString(style: string): Promise<boolean>;
    setBitmap(base64Bitmap: string): Promise<boolean>;
}
export interface LngLat {
    longitude: number;
    latitude: number;
}
export declare type CameraType = "PERSPECTIVE" | "ISOMETRIC" | "FLAT";
export interface MapViewProps extends ViewProperties {
    style?: StyleProp<ViewStyle>;
    scenePath?: string;
    sceneUpdates?: object;
    layers?: string[];
    geoPosition?: LngLat;
    pickRadius?: number;
    cacheName?: string;
    cacheSize?: number;
    cameraType?: CameraType;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    tilt?: number;
    minTilt?: number;
    maxTilt?: number;
    rotate?: number;
    minRotate?: number;
    maxRotate?: number;
    handleDoubleTap?: boolean;
    handleSingleTapUp?: boolean;
    handleSingleTapConfirmed?: boolean;
    handleFling?: boolean;
    handlePan?: boolean;
    handleScale?: boolean;
    handleShove?: boolean;
    handleRotate?: boolean;
    onError?(event?: Event): void;
    onSceneReloading?(event?: Event): void;
    onSceneReloaded?(event?: Event): void;
    onSceneReady?(event?: Event): void;
    onFeaturePick?(event?: Event): void;
    onLabelPick?(event?: Event): void;
    onMarkerPick?(event?: Event): void;
    onDoubleTap?(event?: Event): void;
    onLongPress?(event?: Event): void;
    onSingleTapUp?(event?: Event): void;
    onSingleTapConfirmed?(event?: Event): void;
    onViewComplete?(event?: Event): void;
    onPan?(event?: Event): void;
    onFling?(event?: Event): void;
    onScale?(event?: Event): void;
    onRotate?(event?: Event): void;
    onShove?(event?: Event): void;
}
export interface MapViewStates {
    isReady: boolean;
}
export declare class MapView extends React.Component<MapViewProps, MapViewStates> {
    private map;
    static defaultProps: {
        scenePath: string;
        cameraType: string;
        cacheName: string;
        cacheSize: number;
        zoom: number;
        minZoom: number;
        maxZoom: number;
        handleDoubleTap: boolean;
        handleSingleTapUp: boolean;
        handleSingleTapConfirmed: boolean;
        handlePan: boolean;
        handleFling: boolean;
    };
    static propTypes: any;
    private markers;
    constructor(props: MapViewProps, states: MapViewStates);
    private getNativeName;
    componentDidMount(): void;
    private _uiManagerCommand;
    private _mapManagerCommand;
    private _getHandle;
    private _runCommand;
    private _updateStyle;
    private _onSceneReady;
    private _onPan;
    private _onFling;
    private _onScale;
    private _onShove;
    private _onRotate;
    private _onFeaturePick;
    private _onLabelPick;
    private _onMarkerPick;
    private _onViewComplete;
    private _onError;
    private _onDoubleTap;
    private _onLongPress;
    private _onSingleTapUp;
    private _onSingleTapConfirmed;
    getGeoPosition(): Promise<LngLat>;
    getRotation(): Promise<number>;
    getTilt(): Promise<number>;
    getZoom(): Promise<number>;
    getCameraType(): Promise<CameraType>;
    setGeoPosition(pos: LngLat): Promise<LngLat>;
    setTilt(tilt: number): Promise<number>;
    setZoom(zoom: number): Promise<number>;
    setRotation(amount: number): Promise<number>;
    setCameraType(cameraType: CameraType): Promise<CameraType>;
    setPickRadius(radius: number): Promise<number>;
    setGeoPositionEase(pos: LngLat, duration: number): Promise<LngLat>;
    setGeoPositionEase(pos: LngLat, duration: number, easeType?: EaseType): Promise<LngLat>;
    setTiltEase(tilt: number, duration: number): Promise<number>;
    setTiltEase(tilt: number, duration: number, easeType?: EaseType): Promise<number>;
    setZoomEase(zoom: number, duration: number): Promise<number>;
    setZoomEase(zoom: number, duration: number, easeType?: EaseType): Promise<number>;
    setRotationEase(amount: number, duration: number): Promise<number>;
    setRotationEase(amount: number, duration: number, easeType?: EaseType): Promise<number>;
    pickFeature(posx: number, posy: number): Promise<void>;
    pickLabel(posx: number, posy: number): Promise<void>;
    pickMarker(posx: number, posy: number): Promise<void>;
    addDataLayer(layername: string, jsonData?: string): Promise<number>;
    addPolygonMapDataLayer(layername: string, points: Set<Set<LngLat>>, propeties?: Map<string, string>): Promise<string>;
    addPolylineMapDataLayer(layername: string, points: Set<LngLat>, propeties?: Map<string, string>): Promise<string>;
    clearMapDataLayer(name: string): Promise<string>;
    removeMapDataLayer(name: string): Promise<string>;
    addMarker(): Promise<Marker>;
    putMarker(isVisible: boolean, drawOrder?: number, point?: LngLat, polygon?: Polygon, polyline?: Polyline, style?: string, drawableID?: number, drawable?: BitmapData): Promise<Marker>;
    updateMarker(markerID: number, isVisible: boolean, drawOrder?: number, point?: LngLat, polygon?: Polygon, polyline?: Polyline, style?: string, drawableID?: number, drawable?: BitmapData): Promise<Marker>;
    /**
     * Remove a map marker by markerid
     *
     * @param {number} markerID
     * @returns {number}
     *
     * @memberOf MapView
     */
    removeMarker(markerID: number): Promise<number>;
    /**
     * Remove all map markers .
     *
     * @returns
     *
     * @memberOf MapView
     */
    removeAllMarkers(): Promise<void>;
    setMarkerVisible(mid: number, visible: boolean): Promise<boolean>;
    setMarkerDrawOrder(mid: number, order: number): Promise<boolean>;
    setMarkerBitmap(mid: number, bitmapBase64: string): Promise<boolean>;
    setMarkerPoint(mid: number, point: LngLat): Promise<boolean>;
    setMarkerPointEased(mid: number, point: LngLat, duration: number, easeType?: EaseType): Promise<boolean>;
    setMarkerPolygon(mid: number, polygon: Polygon): Promise<boolean>;
    setMarkerPolyline(mid: number, polyline: Polyline): Promise<boolean>;
    setMarkerStylingFromPath(mid: number, stylePath: string): Promise<boolean>;
    setMarkerStylingFromString(mid: number, style: string): Promise<boolean>;
    requestRender(): Promise<void>;
    updateSceneAsync(scneUpdates?: object): Promise<void>;
    loadSceneFile(scenePath: string, scneUpdates?: object): Promise<void>;
    loadSceneFileAsync(scenePath: string, scneUpdates?: object): Promise<void>;
    useCachedGlState(cache: boolean): Promise<void>;
    /**
     * Convert a geo position to screen position
     *
     * @param {PointF} pos
     * @returns {LngLat}
     *
     * @memberOf MapView
     */
    screenToLngLat(pos: PointF): Promise<LngLat>;
    /**
     * Convert screen
     *
     * @param {LngLat} pos
     * @returns {PointF}
     *
     * @memberOf MapView
     */
    lngLatToScreen(pos: LngLat): Promise<PointF>;
    captureFrame(waiting?: boolean, compressRate?: number, width?: number, height?: number): Promise<BitmapData>;
    screenCenterPoint(): PointF;
    computeHeading(from: LngLat, to: LngLat): number;
    private calcZoom;
    private latRad;
    getBoundsZoomLevel(ne: LngLat, sw: LngLat, mapWidthPx: number, mapHeightPx: number): number;
    fitToBounds(positions: LngLat[], padding?: number, duration?: number): Promise<number>;
    render(): any;
}
