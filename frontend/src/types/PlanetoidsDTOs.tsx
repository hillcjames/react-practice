
export interface PlanetoidDTO {
    namespace: string; // ?
    path: string; // ?

    id: string;
    radius: number;
    posX: number;
    posY: number;
    vX: number;
    vY: number;
    mass: number;
    styleName: String;
}


export interface PlanetoidGetResponse {
    success: boolean;
    data: string;
    // data: PlanetoidDTO[];
}
//
//
// export interface WidgetCreateRequest {
//     displayName: string;
//     widgetVersion: string;
//     description: string;
//     widgetUrl: string;
//     imageUrlSmall: string;
//     imageUrlMedium: string;
//     width: number;
//     height: number;
//     widgetGuid: string;
//     universalName: string;
//     visible: boolean;
//     background: boolean;
//     singleton: boolean;
//     mobileReady: boolean;
//     widgetTypes: WidgetTypeReference[];
//     descriptorUrl?: string;
//     intents: IntentsDTO;
// }
//
//
// export interface WidgetCreateResponse {
//     success: boolean;
//     data: WidgetDTO[];
// }
//
// export interface WidgetUpdateRequest extends WidgetCreateRequest {
//     id: string;
//     update_action?: "add" | "remove";
//     widget_ids?: number[];
// }
//
// export interface WidgetDeleteIdDTO {
//     id: string;
//     value: object;
// }
//
// export interface WidgetDeleteResponse {
//     success: boolean;
//     data: WidgetDeleteIdDTO[];
// }
