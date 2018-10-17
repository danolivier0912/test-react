import React from "react";
import ReactDOMServer from "react-dom/server";
import serialize from "serialize-javascript";
import { navigateAction } from "fluxible-router";

import app from "./app";
import HtmlDocument from "./HtmlDocument";

let webpackStats;

const renderApp = (req, res, context, next) => {
  try {
    webpackStats = require("./webpack-stats.json");

    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    delete require.cache[require.resolve("./webpack-stats.json")];

    // dehydrate the app and expose its state
    const state = "window.App=" + serialize(app.dehydrate(context)) + ";";

    const Application = app.getComponent();

    // Render the Application to string
    const markup = ReactDOMServer.renderToString(
      <Application context={ context.getComponentContext() } />
    );

    // The application component is rendered to static markup
    // and sent as response.
    const html = ReactDOMServer.renderToStaticMarkup(
      <HtmlDocument
        context={ context.getComponentContext() }
        state={state}
        markup={markup}
        script={webpackStats.script}
        css={webpackStats.css}
      />
    );
    const doctype = "<!DOCTYPE html>";
    res.send(doctype + html);
  }
  catch (e) {
    next(e);
  }
}

const render = (req, res, next) => {
  // Create a fluxible context (_csrf is needed by the fetchr plugin)
  const context = app.createContext({
    req: req
  });

  // Fill the intl store with the messages according to locale and
  // execute the navigate action to fill the RouteStore
  // (here we make use of executeAction returning a promise)
  Promise.all([
    context.executeAction(navigateAction, { url: req.url })
  ])
  .then((data) => renderApp(req, res, context, next))
  .catch((err) => {
    if (!err.statusCode || !err.status) {
      next(err);
    }
    else {
      renderApp(req, res, context, next);
    }
  });
}

export default render;