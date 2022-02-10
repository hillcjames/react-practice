import React from "react";
import { Button } from "@blueprintjs/core";

export interface SendRequestButtonProps {
    isVisible: boolean;
    isDisabled: boolean;
    onClick: () => void;
}

const _SendRequestButton: React.FC<SendRequestButtonProps> = (props) => {
    if (!props.isVisible) return null;

    return (
        <Button
            data-element-id="send-request-button"
            disabled={props.isDisabled}
            onClick={props.onClick}
            icon="send-to-graph"
            minimal
            small
            title={
                props.isDisabled
                    ? "This is disabled for some reason."
                    : undefined
            }
        />
    );
};

export const SendRequestButton = React.memo(_SendRequestButton);
