import { BehaviorSubject } from "rxjs";
import { asBehavior } from "../util";

// import { themeApi } from "../api/clients/ThemeAPI";
// import { DARK_THEME } from "../constants";
// import { isBlank } from "../utility";

export const Displays = {
    SOLAR: "SOLAR",
    DATA: "DATA"
}

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

    private readonly currentDisplay$ = new BehaviorSubject(Displays.SOLAR);
    currentDisplay = () => asBehavior(this.currentDisplay$);
    showSolarDisplay = () => this.currentDisplay$.next(Displays.SOLAR);
    showDataDisplay = () => this.currentDisplay$.next(Displays.DATA);


    private readonly universeWidth$ = new BehaviorSubject(400);
    private readonly universeHeight$ = new BehaviorSubject(200);
    universeWidth = () => asBehavior(this.universeWidth$);
    universeHeight = () => asBehavior(this.universeHeight$);
    updateUniverseWidth = (newNum: number) => this.universeWidth$.next(newNum);
    updateUniverseHeight = (newNum: number) => this.universeHeight$.next(newNum);

    private readonly solarDataIsLoading$ = new BehaviorSubject(true);
    solarDataIsLoading = () => asBehavior(this.solarDataIsLoading$);
    setSolarDataLoading = (loading: boolean) => this.solarDataIsLoading$.next(loading);

    private readonly solarDataLoadFailure$ = new BehaviorSubject(false);
    solarDataLoadFailure = () => asBehavior(this.solarDataLoadFailure$);
    setSolarDataLoadFailure = (failed: boolean) => this.solarDataLoadFailure$.next(failed);

    private readonly showDeadPlanets$ = new BehaviorSubject(true);
    showDeadPlanets = () => asBehavior(this.showDeadPlanets$);
    setShowDeadPlanets = (show: boolean) => this.showDeadPlanets$.next(show);

    private readonly showTails$ = new BehaviorSubject(true);
    showTails = () => asBehavior(this.showTails$);
    toggleShowTails = () => this.showTails$.next(!this.showTails$.getValue());

    private readonly showStars$ = new BehaviorSubject(true);
    showStars = () => asBehavior(this.showStars$);
    toggleShowStars = () => this.showStars$.next(!this.showStars$.getValue());

    private readonly tailsRelativeToReferencePlanet$ = new BehaviorSubject(false);
    tailsRelativeToReferencePlanet = () => asBehavior(this.tailsRelativeToReferencePlanet$);
    setTailsRelativeToReferencePlanet = () => this.tailsRelativeToReferencePlanet$.next(true);
    setTailsRelativeTostars = () => this.tailsRelativeToReferencePlanet$.next(false);

    // unused atm, hardcoded.
    // private readonly tailLength$ = new BehaviorSubject(500);
    // tailLength = () => asBehavior(this.tailLength$);
    // setTailLength = (newLen: number) => this.tailLength$.next(newLen);
}

export const mainStore = new MainStore();
