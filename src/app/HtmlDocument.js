import React from "react";
import PropTypes from 'prop-types';
import { provideContext } from "fluxible-addons-react";

class HtmlDocument extends React.Component {
  static propTypes = {
    context: PropTypes.object.isRequired,
    state: PropTypes.string.isRequired,
    markup: PropTypes.string.isRequired,
    script: PropTypes.arrayOf(PropTypes.string),
    css: PropTypes.arrayOf(PropTypes.string)
  }

  static defaultProps = {
    script: [],
    css: []
  }

  static contextTypes = {
    getStore: PropTypes.func.isRequired
  }

  render() {
    const { state, markup, script, css } = this.props;

    return (
      <html lang="fr">
        <head>
          <meta charSet="utf-8" />
          <title>Dev</title>
          <link rel="icon" type="image/png" sizes="32x32" href="/static/fav_32x32.png" />
          <link href="https://fonts.googleapis.com/css?family=Lato:400,700" rel="stylesheet" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          {css.map((href, k) => <link key={k} rel="stylesheet" type="text/css" href={href} />)}
        </head>

        <body>
          <div id="root" dangerouslySetInnerHTML={{__html: markup}} />
          <script dangerouslySetInnerHTML={{__html: state}} />
          {script.map((src, k) => <script key={k} src={src} />)}
        </body>
      </html>
    );
  }
}

HtmlDocument = provideContext(HtmlDocument);

export default HtmlDocument;
