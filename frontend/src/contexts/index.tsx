
import React from "react"


export function createModelContext() {
    return React.createContext({
        value: 0,
        addNewBody: () => {}
    });
}

export const toggleReducer: React.Reducer<any,any> = (state, action) => {
    switch (action.type) {
      case 'increment':
        return {count: state.count + 1};
      case 'decrement':
        return {count: state.count - 1};
      default:
        throw new Error();
    }
}

type CounterState = {count: Number}

export const initialState: CounterState = {
  count: 0
}



export const StateContext = React.createContext<{state: CounterState, dispatch:React.Dispatch<any>}>({
  state: initialState,
  dispatch: ()=>{}
})

type StateChildren = {children: any}

export const StateProvider = ({ children }: StateChildren) => {
  const [_state, _dispatch] = React.useReducer(toggleReducer, initialState)

  return (
    <StateContext.Provider value={{state: _state, dispatch: _dispatch }}>
    	{ children }
    </StateContext.Provider>
  )
}


// type Action =
//  | { type: 'request' }
//  | { type: 'success', results: ApiResponse }
//  | { type: 'failure', error: string };
//
//  type State = {
//     data?: ApiResponse;
//     isLoading: boolean;
//     error?: string;
//  }
//
//  type ApiResponse {
//      data: string;
//  }
//
// function requestReducer(state: State, action: Action): State {
//     switch (action.type) {
//         case 'request':
//             return { isLoading: true };
//         case 'success':
//             return { isLoading: false, data: action.results };
//         case 'failure':
//             return { isLoading: false, error: action.error };
//     }
// }
