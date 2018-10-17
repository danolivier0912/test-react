import React, { Component } from "react";
import PropTypes from 'prop-types';
import { provideContext } from "fluxible-addons-react";
import { handleHistory } from "fluxible-router";

class Application extends Component {
  static contextTypes = {
    getStore: PropTypes.func.isRequired,
    executeAction: PropTypes.func.isRequired
  }

  static propTypes = {
    // props coming from fluxible-router's handleHistory
    currentRoute: PropTypes.object,
    currentNavigateError: PropTypes.shape({
      statusCode: PropTypes.number.isRequired,
      message: PropTypes.string.isRequired
    })
  }

  componentDidMount(){
    window.requestAnimFrame = (() => {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ){ window.setTimeout(callback, 1000 / 60); };
    })();
  }

  render() {
    const { currentRoute, currentNavigateError, isNavigateComplete } = this.props;
    let Handler = currentRoute && currentRoute.handler;
    const params = currentRoute.params;

    return (
      <div>
        <Handler {...params} />
      </div>
    );
  }
}

// Wrap with fluxible-router's history handler (required for routing)
// It also pass `currentRoute` as prop to the component
Application = handleHistory(Application);

// Wrap Application with the fluxible context (required)
Application = provideContext(Application);

export default Application;
