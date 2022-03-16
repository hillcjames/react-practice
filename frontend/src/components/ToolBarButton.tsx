import React from "react";
import { Button, Intent, IconName } from "@blueprintjs/core";

import '../css/Body.css';


export interface ToolBarButtonProps {
    text: string;
    onClick: ()=> void;
    disabled?: boolean;
    icon?: string;
    data_element_id?: string;
}

const _ToolBarButton: React.FC<ToolBarButtonProps> = (props) => {
    return (
        <Button
            text={props.text}
            onClick={props.onClick}
            minimal
            small
            intent={Intent.WARNING}
            title={props.text}
            data-element-id={props.data_element_id}
            icon={props.icon as IconName}
        />
    );
}

export const ToolBarButton = React.memo(_ToolBarButton);
export default ToolBarButton;
