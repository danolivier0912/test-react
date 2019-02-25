import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connectToStores } from "fluxible-addons-react";

if (process.env.BROWSER) {
  require("../style/Grid.scss");
}

class Grid extends Component {
  padStr(input) {
    return (input < 10) ? "0" + input : "" + input;
  }

  dateToDdMmYyyy(input) {
    const dte = new Date(input);
    return this.padStr(dte.getDate()) + '/' + this.padStr(dte.getMonth() + 1) + '/' + dte.getFullYear();
  }

  secondsToHours(value) {
    return value/3600;
  }

  render() {
    const { data } = this.props;
    const dayHeight = this.secondsToHours(data.endTime - data.startTime) * 300;

    return (
      <div className="Grid">
        <div className="Title">
          {'Grille du ' + this.dateToDdMmYyyy(data.day)}
        </div>
        <div className="Chns">
          {data.chns.map(chn =>
            <div key={chn.key} className="Chn">
              <div className="Chn-title">{chn.key}</div>
              <div className="shows" style={{height: dayHeight}}>
                {chn.shows.map((show, i) => {
                  const showLength = this.secondsToHours(show.endTime - show.startTime) * 300;

                  return (
                      <div key={i} style={{height: showLength + 'px'}} className="show">
                        <p className="show-title">{show.title}</p>
                        {show.subTitle ? <p>{show.subTitle}</p> : ''}
                      </div>
                  )
                })}
              </div>
            </div>
           )}
        </div>
      </div>
    );
  }
}

Grid = connectToStores(Grid, [
  "GridStore",
], (context) => {
  return {
    data: context.getStore("GridStore").getData(),
  };
}, {getStore: PropTypes.func});

export default Grid;
