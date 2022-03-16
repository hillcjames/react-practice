import React, { useEffect, useState } from "react";
// import { Cell, Column, Table } from "@blueprintjs/table";

import { ReactTabulator } from "react-tabulator";
import "react-tabulator/lib/styles.css"; // default theme
// import "react-tabulator/css/bootstrap/tabulator_bootstrap.min.css";
import "react-tabulator/css/tabulator_midnight.min.css";


import { ModelState } from "../types/Model";
import { Planet } from "../types/Planet";
import { Vector2d } from "../types/Vector2d";


import '../css/BasicDataTableDisplay.css';
// import "~@blueprintjs/table/lib/css/table.css";


export interface BasicDataTableDisplayProps {
    model: ModelState;
    rowClickCallback: (e: any, row: any) => void;
    selectedPlanetID: string;
    setSelectedPlanetID: (newID: string) => void;
}




const _BasicDataTableDisplay: React.FC<BasicDataTableDisplayProps> = (props) => {

    const [ref, setRef] = useState<any>(null);

    let VectorFormatter = (cell: any, formatterParams: any, onRendered: any) => {
        let pos: Vector2d = cell.getValue();
        return pos.x.toFixed(1) + " " + pos.y.toFixed(1);
    }

    let deadFilter = (data: Planet, filterParams: any) => {
        return !data.dead; //must return a boolean, true if it passes the filter.
    }


    useEffect(() => {
        console.log("Updating _BasicDataTableDisplay useEffect ", props.selectedPlanetID);

        // TODO replaceData and updateOrAddData cause lag, even with a small number of table entries. What gives?
        if (ref !== null && ref.current !== null) {
            ref.current.updateData(props.model.planets);
            if (ref.current.getRows().length < props.model.planets.length) {
                ref.current.updateOrAddData(props.model.planets);
            }

        }
    });

    // useEffect(() => {
    //     if (ref !== null && ref.current !== null) {
    //         ref.current.setFilter(deadFilter, {});
    //     }
    // }, [ref]);


    const columns = [
        { title: "Name", field: "name", width: 60 },
        // { title: "Pos", field: "pos", formatter: reactFormatter(<div>{pos}</div>) },
        { title: "Pos", field: "pos", width: 100, formatter: VectorFormatter },
        { title: "Velocity", field: "v", width: 100, formatter: VectorFormatter },
        { title: "Mass", field: "mass", width: 150 },
        { title: "Rank", field: "rank", width: 150 },
        { title: "Dead", field: "dead" },
    ];


    // useEffect(() => {
    //     console.log("Updating table!!")
    // });

    // const nameCellRenderer = (rowIndex: number) => {
    //     let p: Planet = props.model.state.planets[rowIndex];
    //     return (<Cell>{p.id}</Cell>);
    // }
    // const posCellRenderer = (rowIndex: number) => {
    //     // <Cell>{`€${(rowIndex * 10 * 0.85).toFixed(2)}`}</Cell>
    //     let p: Planet = props.model.planets[rowIndex];
    //     return (<div>{p.pos}</div>);
    // }


    return (
        <div className="BasicDataTableDisplay">
            {/* <Table numRows={props.model.state.planets.length}>
                <Column name="Name" cellRenderer={nameCellRenderer}/>
                <Column name="Pos" cellRenderer={posCellRenderer} />
            </Table> */}
            <ReactTabulator
                  onRef={(ref) => (setRef(ref))}
                  columns={columns}
                  data={props.model.planets}
                  events={{
                    rowClick: (e: any, row: any) => {
                        /* console.log("*", row.getData().name, props.selectedPlanetID) */
                        props.setSelectedPlanetID(row.getData().name);
                        /* console.log("*", row.getData().name, props.selectedPlanetID) */
                        props.rowClickCallback(e, row);
                    }}}
                  initialFilter={deadFilter}
                  rowFormatter={(row: any) => {
                      if (row.getData().dead) {
                          row.getElement().childNodes[0].style.backgroundColor = "#4d1300";
                      }
                      /* console.log(row.getData().name,  props.selectedPlanetID, row === props.selectedPlanetID) */
                      if (row.getData().name === props.selectedPlanetID ) {
                          row.getElement().style.backgroundColor = "#00802b";
                      }
                  }}
                />
                {/* options={options} */}
                {/* data-custom-attr="test-custom-attribute"
                className="custom-css-class" */}
        </div>
    );
}


const BasicDataTableDisplay = React.memo(_BasicDataTableDisplay);
export default BasicDataTableDisplay;
