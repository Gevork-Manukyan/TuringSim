import { Component, ErrorInfo, ReactNode } from "react";
import "./ErrorBoundary.scss";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Top-level error boundary: catches render/runtime errors anywhere in the tree
 * and shows a recoverable fallback instead of a blank white screen.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface for debugging; swap for real error tracking when added.
    console.error("Uncaught error:", error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="ErrorBoundary" role="alert">
          <h1 className="ErrorBoundary__title">Something went wrong</h1>
          <p className="ErrorBoundary__body">
            The app hit an unexpected error. Reloading usually fixes it — your
            saved machine is kept in the browser.
          </p>
          <button className="ErrorBoundary__button" onClick={this.handleReload}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
