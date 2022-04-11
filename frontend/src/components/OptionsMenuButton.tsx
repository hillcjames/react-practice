import React, { Component, useContext, useEffect, useState } from "react";
import { Boundary, Button, Intent, Popover, Radio, RadioGroup, Switch } from "@blueprintjs/core";

import ToolPaneButton from './ToolPaneButton';

import { useToggleable } from "../hooks/useToggleable";
import { useBehavior } from '../hooks/useBehavior';

import { ModelState } from "../types/Model";
import { modelStore, TailLength } from '../stores/ModelStore';
import { mainStore } from '../stores/MainStore';

import { handleStringChange } from "../util";
import '../css/Body.css';
import '../css/ToolPaneButton.css';
import '../css/OptionsMenuButton.css';


export interface OptionsMenuButtonProps {
    modelState: ModelState
}

const _OptionsMenuButton: React.FC<OptionsMenuButtonProps> = (props) => {
    const tailsRelativeToReferencePlanet = useBehavior(mainStore.tailsRelativeToReferencePlanet);
    const showStars = useBehavior(mainStore.showStars);
    const optionsMenuIsOpen = useBehavior(mainStore.optionsMenuIsOpen);
    const extraInfoIsShowing = useBehavior(mainStore.extraInfoIsShowing);

    useEffect( () => {
        console.log("OptionsMenuButton is reloading!")
    });

    const temp = {
        test: "test",
        boundary: "scrollparent" as any,
        canEscapeKeyClose: true,
        hasBackdrop: false,
        inheritDarkTheme: true,
        // interactionKind: PopoverInteractionKind.CLICK,
        isOpen: false,
        minimal: false,
        modifiers: {
            arrow: { enabled: true },
            flip: { enabled: true },
            keepTogether: { enabled: true },
            preventOverflow: { enabled: true },
        },
        position: "right-bottom" as any,
        usePortal: true,
    };

    const { test, ...popoverProps } = temp;

    const getContents = () => {
        return (<div>
            <RadioGroup
                className={"radioGroup"}
                label="Show trails"
                name="group"
                onChange={handleStringChange((value: any) => {
                    console.log(value);
                    switch(value) {
                        case TailLength.NONE.name:
                            modelStore.setHistoryLength(TailLength.NONE);
                            modelStore.clearHistory();
                            break;
                        case TailLength.SHORT.name:
                            modelStore.setHistoryLength(TailLength.SHORT);
                            break;
                        case TailLength.LONG.name:
                            modelStore.setHistoryLength(TailLength.LONG);
                            break;
                    }
                    // mainStore.handleTailLengthChange(value);
                })}
                selectedValue={props.modelState.maxHistoryLength.name}
            >
                <Radio label={TailLength.NONE.name} value={TailLength.NONE.name} />
                <Radio label={TailLength.SHORT.name} value={TailLength.SHORT.name} />
                <Radio label={TailLength.LONG.name} value={TailLength.LONG.name} />
            </RadioGroup>

            <Switch
                className={"toggles"}
                label={tailsRelativeToReferencePlanet ? "Center is reference frame" : "Stars are reference frame"}
                // disabled={!tailLength}
                checked={tailsRelativeToReferencePlanet}
                onChange={() => {
                    if (tailsRelativeToReferencePlanet) {
                        mainStore.setTailsRelativeTostars();
                    }
                    else {
                        mainStore.setTailsRelativeToReferencePlanet();
                    }
            }} />
            <Switch
                className={"toggles"}
                label="Show Stars"
                checked={showStars}
                onChange={mainStore.toggleShowStars} />
            <Switch
                className={"toggles"}
                label="Show Extra Info"
                checked={extraInfoIsShowing}
                onChange={mainStore.toggleExtraInfo} />
            </div>);
    }

    return (

        <Popover
            // popoverClassName={exampleIndex <= 2 ? Classes.POPOVER_CONTENT_SIZING : ""}
            popoverClassName={"popover-custom"}
            portalClassName={"popover-custom"}
            className={"popover-custom"}
            // portalClassName="foo"
            {...popoverProps}
            // enforceFocus={false}
            isOpen={optionsMenuIsOpen}
        >
            <ToolPaneButton
                className={"optionsButton"}
                // text={"Recenter View"}
                onClick={() => {
                    if (!optionsMenuIsOpen) {
                        mainStore.openOptionsMenu();
                    }
                    else {
                        mainStore.closeOptionsMenu();
                    }
                }}
                icon="settings"
            />
            {getContents()}
        </Popover>
        );



}

export const OptionsMenuButton = React.memo(_OptionsMenuButton);
export default OptionsMenuButton;
