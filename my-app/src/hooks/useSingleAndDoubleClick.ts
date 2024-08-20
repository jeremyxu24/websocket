import {
    MouseEventHandler,
    useEffect,
    useReducer,
    MouseEvent
} from "react";

type THookState<T extends HTMLDivElement> = {
    count: number;
    event: MouseEvent<T, globalThis.MouseEvent>;
};

const getReducer = <T extends HTMLDivElement>() => (
    state: THookState<T>,
    action: { type: "update"; payload: THookState<T> }
): THookState<T> => {
    switch (action.type) {
        case "update":
            return { ...action.payload };
        default:
            throw new Error();
    }
};

const getInitialState = <T extends HTMLDivElement>(): THookState<T> => ({
    count: 0,
    event: null as any
});

const useSingleAndDoubleClick = <T extends HTMLDivElement>(
    singleClickHandler: MouseEventHandler<T>,
    doubleClickHandler: MouseEventHandler<T>,
    delay: number = 250
) => {
    const reducer = getReducer<T>();
    const initialState = getInitialState<T>();
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const timer = setTimeout(() => {
            // simple click
            if (state.count === 1) singleClickHandler(state.event);
            dispatch({ type: "update", payload: { count: 0, event: null as any } });
        }, delay);

        // the duration between this click and the previous one
        // is less than the value of delay = double-click
        if (state.count === 2) doubleClickHandler(state.event);

        return () => clearTimeout(timer);
    }, [state.count]);

    return (event: THookState<T>["event"]) =>
        dispatch({ type: "update", payload: { count: state.count + 1, event } });
};

export default useSingleAndDoubleClick;