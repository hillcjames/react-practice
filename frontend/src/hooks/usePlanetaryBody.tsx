import { useCallback, useMemo, useState } from "react";
//
// export interface PlanetaryBody {
//     lastUpdate: number;
//     lastUpdate: number;
//
//     show: () => void;
// }
//
// export function usePlanetaryBody(initialValue: boolean): PlanetaryBody {
//     const [isVisible, setIsVisible] = useState(initialValue);
//     const show = useCallback(() => setIsVisible(true), []);
//     const hide = useCallback(() => setIsVisible(false), []);
//     const toggle = useCallback(() => setIsVisible(!isVisible), [isVisible]);
//
//     return useMemo(
//         () => ({
//             isVisible,
//             show,
//             hide,
//             toggle
//         }),
//         [isVisible, show, hide, toggle]
//     );
// }
