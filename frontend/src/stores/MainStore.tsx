import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../util";

// import { themeApi } from "../api/clients/ThemeAPI";
// import { DARK_THEME } from "../constants";
// import { isBlank } from "../utility";

// think up a better name sometime. This is a store for navigation, what screen you're on, what panels are showing.
export class MainStore {
    // private readonly storeUrl$ = new BehaviorSubject("");

    // private readonly themeClass$ = new BehaviorSubject(DARK_THEME);

    // themeClass = () => asBehavior(this.themeClass$);
    // getTheme = () => this.themeClass$.value;
    // setTheme = (newTheme: string) => {
    //     this.themeClass$.next(newTheme);
    // };
    // updateTheme = async (newTheme: string) => {
    //     const result = await themeApi.setTheme(newTheme);
    //     this.themeClass$.next(result.data);
    // };
    //
    // toggleTheme = () => {
    //     this.updateTheme(isBlank(this.themeClass$.value) ? DARK_THEME : "");
    // };

    private readonly isSolarDisplayVisible$ = new BehaviorSubject(true);
    isSolarDisplayVisible = () => asBehavior(this.isSolarDisplayVisible$);
    showSolarDisplay = () => this.isSolarDisplayVisible$.next(true);
    hideSolarDisplay = () => this.isSolarDisplayVisible$.next(false);


    private readonly canvasWidth$ = new BehaviorSubject(0);
    private readonly canvasHeight$ = new BehaviorSubject(0);
    canvasWidth = () => asBehavior(this.canvasWidth$);
    canvasHeight = () => asBehavior(this.canvasHeight$);
    updateCanvasWidth = (newNum: number) => this.canvasWidth$.next(newNum);
    updateCanvasHeight = (newNum: number) => this.canvasHeight$.next(newNum);


    private readonly solarDataIsLoading$ = new BehaviorSubject(true);
    solarDataIsLoading = () => asBehavior(this.solarDataIsLoading$);
    setSolarDataLoading = (loading: boolean) => this.solarDataIsLoading$.next(loading);

    private readonly solarDataLoadFailure$ = new BehaviorSubject(false);
    solarDataLoadFailure = () => asBehavior(this.solarDataLoadFailure$);
    setSolarDataLoadFailure = (failed: boolean) => this.solarDataLoadFailure$.next(failed);

}

export const mainStore = new MainStore();
