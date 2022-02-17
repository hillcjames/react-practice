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

}

export const mainStore = new MainStore();
