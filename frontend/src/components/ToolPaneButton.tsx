import React from "react";
import { Button, ButtonProps, Intent, IconName } from "@blueprintjs/core";

import '../css/ToolPaneButton.css';


export interface ToolBarButtonProps {
    text: string;
    onClick: ()=> void;
    disabled?: boolean;
    icon?: string;
    data_element_id?: string;
}

const _ToolBarButton: React.FC<ToolBarButtonProps | ButtonProps> = (props) => {
    return (
        <Button
            className="toolpane-button"
            text={props.text}
            onClick={props.onClick}
            // minimal
            // small
            large
            intent={Intent.PRIMARY}
            // title={props.text}
            // data-element-id={props.data_element_id}
            icon={props.icon as IconName}
        />
    );
}

export const ToolBarButton = React.memo(_ToolBarButton);
export default ToolBarButton;
