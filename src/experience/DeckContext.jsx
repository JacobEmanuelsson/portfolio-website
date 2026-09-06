"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

const DeckContext = createContext(null);

// any component inside <Deck> calls this to read activeIndex / goTo / advance etc.
export const useDeck = () => useContext(DeckContext);

const TRANSITION_MS = 780;
const SWIPE_THRESHOLD = 40;   // px a touch must travel to count as a swipe, not a tap
const WHEEL_IDLE_MS = 150;    // a gap this long between wheel events = the gesture ended
const WHEEL_MIN_DELTA = 4;    // ignore trackpad micro-jitter below this

// --- DEBUG TOGGLE ---------------------------------------------------------
// Flip to false to SIMULATE not using useCallback: goTo/advance then get a new
// identity on every render, so the listener useEffect tears down + re-attaches
// (and resets wheelReady / the idle timer) on every render. Scroll hard on a
// trackpad and watch it skip panels / feel unpredictable. Watch the console —
// with this false you'll see "listeners (re)attached" fire on every scroll.
// Set back to true when done.
const STABLE_CALLBACKS = true;
// -----------------------------------------------------------------------------

export function DeckProvider({ count, children }) { 
    const [activeIndex, setActiveIndex] = useState(0);  // state = drives the re-render (dots, panels)
    const [transitioning, setTransitioning] = useState(false);

    // same values as refs — the window listeners below are set up once and would
    // otherwise read a stale activeIndex/transitioning from that first render
    const activeRef = useRef(0);
    const transRef = useRef(false);
    const interceptorRef = useRef(null); // the intro drops a function here to grab the first gestures

    // when STABLE_CALLBACKS is false this changes every render, forcing goTo (and
    // therefore advance, and therefore the listener effect) to rebuild each time
    const nonce = STABLE_CALLBACKS ? 0 : Math.random();

    // jump straight to a panel (used by the dot nav)
    const goTo = useCallback((i) => {
        i = Math.max(0, Math.min(count - 1, i));           // keep i inside 0..count-1
        if (i === activeRef.current || transRef.current) return; // already there, or mid-move
        transRef.current = true;
        setTransitioning(true);
        activeRef.current = i;
        setActiveIndex(i);
        // unlock once the css fade has finished
        setTimeout(() => { transRef.current = false; setTransitioning(false); }, TRANSITION_MS);

    }, [count, nonce]);

    // move one panel in a direction (wheel / keys / swipe)
    const advance = useCallback((dir) => {
        // on panel 0 the intro gets first refusal on a forward gesture (begin / skip)
        if (activeRef.current === 0 && dir > 0 && interceptorRef.current?.(dir)) return;
        goTo(activeRef.current + dir);
    }, [goTo]);

    // the intro calls this on mount; the returned fn clears it on unmount
    const registerInterceptor = useCallback((fn) => {
        interceptorRef.current = fn;
        return () => {
            if (interceptorRef.current === fn) interceptorRef.current = null;
        };
    }, []);

    // all the scroll / key / touch listeners live here, set up once (advance is stable)
    useEffect(() => {
        if (!STABLE_CALLBACKS) {
            console.log("[deck] listeners (re)attached @", Math.round(performance.now()), "ms");
        }

        // gesture state — lives here so it survives re-renders (that's the point of the stable advance)
        let wheelReady = true;
        let wheelIdleTimer;

        const onWheel = (e) => {
        e.preventDefault(); // stops the page scrolling

        // trackpads emit tiny jitter events at the edges of a gesture — skip them
        if (Math.abs(e.deltaY) < WHEEL_MIN_DELTA) return;

        // every event (the flick AND its inertia tail) pushes the "gesture ended"
        // check further out; wheelReady only flips back once the wheel is truly quiet
        clearTimeout(wheelIdleTimer);
        wheelIdleTimer = setTimeout(() => { wheelReady = true; }, WHEEL_IDLE_MS);

        if (!wheelReady) return;   // still inside one continuous gesture
        wheelReady = false;
        advance(e.deltaY > 0 ? 1 : -1);
        };

        const onKey = (e) => {
        if (e.key === "ArrowDown" || e.key === "PageDown") {
            e.preventDefault();
            advance(1);
        } else if (e.key === "ArrowUp" || e.key === "PageUp") {
            e.preventDefault();
            advance(-1);
        } else if (e.code === "Space" || e.code === "Enter") {
   
            if (e.target?.closest?.("button, a, input, textarea, select")) return;
            if (activeRef.current === 0) advance(1); 
        }
        };

        let touchStartY = 0;

        const onTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
        };

        const onTouchMove = (e) => {
        if (e.target?.closest?.("[data-scrollable]")) return; // allow inner scroll
        e.preventDefault(); // otherwise the page rubber-bands
        };

        const onTouchEnd = (e) => {
        const dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dy) < SWIPE_THRESHOLD) return; // a tap, not a swipe
        advance(dy > 0 ? 1 : -1); // swipe up => forward
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("keydown", onKey);
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd);

        return () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchend", onTouchEnd);
        clearTimeout(wheelIdleTimer);
        };
    }, [advance]);

    return (
        <DeckContext.Provider
        value={{ activeIndex, transitioning, count, goTo, advance, registerInterceptor }}
        >
        {children}
        </DeckContext.Provider>
    );

}
