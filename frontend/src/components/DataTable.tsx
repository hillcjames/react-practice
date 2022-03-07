import React, { Component, useContext, useEffect, useState } from "react";

import { ModelState, Model } from "../types/Model";
import { Vector2d } from "../types/Vector2d";
import { Planet } from "../types/Planet";
import { mainStore } from '../stores/MainStore';
import { modelStore } from '../stores/ModelStore';
import { useBehavior } from '../hooks/useBehavior';
import { ColumnTabulator, GenericTable } from './GenericTable'

import '../css/Body.css';

export interface DataTableProps {
    model: ModelState
}

const _DataTable: React.FC<DataTableProps> = (props) => {

    const showDeadPlanets = useBehavior(mainStore.showDeadPlanets);

    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     console.log("Updating _TestComponent useEffect ");
    //     for (let p of props.model.planets) {
    //         if (p.name === "Bet") {
    //             let currentV = p.v.toString();
    //             console.log(currentV)
    //             setMsg(currentV)
    //         }
    //     }
    // });


    let VectorFormatter = (cell: any, formatterParams: any, onRendered: any) => {
        let pos: Vector2d = cell.getValue();
        return pos.x.toFixed(1) + " " + pos.y.toFixed(1);
    }

    let deadFilter = (data: Planet, filterParams: any) => {
        return showDeadPlanets || !data.dead; //must return a boolean, true if it passes the filter.
    }

    let getTableColumns: () => ColumnTabulator[] = () => {
        return [
            { title: "Name", field: "name", width: 30 },
            // { title: "Pos", field: "pos", formatter: reactFormatter(<div>{pos}</div>) },
            { title: "Pos", field: "pos", width: 100, formatter: VectorFormatter },
            { title: "Velocity", field: "v", width: 100, formatter: VectorFormatter },
            { title: "Mass", field: "mass", width: 150 },
            { title: "Rank", field: "rank", width: 150 },
            { title: "Debug", field: "debug", width: 150 },
            { title: "Dead", field: "dead" },
            // {
            //     title: "Actions",
            //     width: 180,
            //     responsive: 0,
            //     formatter: (row: any) => {
            //         const user: UserDTO = row.cell._cell.row.data;
            //         return (
            //             // TODO - Abstract this to only have to provide onclick function name with styled buttons
            //             <ButtonGroup data-role={"user-admin-widget-actions"} data-username={user.username}>
            //                 <EditButton
            //                     onClick={() => {
            //                         this.setState({ updatingUser: user });
            //                         this.showSubSection(UserWidgetSubSection.SETUP);
            //                     }}
            //                 />
            //                 <Divider />
            //                 <DeleteButton onClick={() => this.confirmDeleteUser(user)} />
            //             </ButtonGroup>
            //         );
            //     }
            // }
        ] as ColumnTabulator[];
    }


    return ( <div className="data-table">
                <GenericTable
                    title={"Current Planets"}
                    items={props.model.planets}
                    getColumns={() => getTableColumns()}
                    tableProps={{
                        loading: loading,
                        paginationSize: 10
                    }}
                />
            </div>
    );
}

export const DataTable = React.memo(_DataTable);
export default DataTable;
