import React, { useRef } from "react";

export const useScroll = <T extends HTMLElement>(options?: boolean | ScrollIntoViewOptions): [React.RefObject<T>, () => void] => {
    const elRef = useRef<T>(null);
    const executeScroll = () => {
        if (elRef.current) {
            elRef.current.scrollIntoView(options);
        }
    };

    return [elRef, executeScroll];
};