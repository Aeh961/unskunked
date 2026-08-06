import { Component, ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { hasError: boolean };

/**
 * react-native-maps failing to render (missing native module, etc.) throws at render time,
 * which only a class-based error boundary can catch - hooks/try-catch can't intercept it.
 */
export class MapErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (__DEV__) {
      console.warn("Map failed to render, falling back to list mode.", error);
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
