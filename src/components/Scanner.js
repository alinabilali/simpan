import React, { Component, Fragment } from 'react';
import Quagga from 'quagga';

class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nocamera: false,
    };
    this.onDetect = this.onDetect.bind(this);
  }

  componentDidMount() {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          constraints: {
            width: '790',
            height: '490',
          },
          numberOfWorkers: navigator.hardwareConcurrency,
          target: document.querySelector('#barcodeScan'),
        },
        locate: true,
        decoder: {
          readers: [
            'code_128_reader',
            'code_93_reader',
            'ean_reader',
            'code_39_reader',
            'code_93_reader',
          ],
        },
      },
      function (err) {
        if (err) {
          return;
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(this.onDetect);
  }

  onDetect(res) {
    console.log(res.codeResult.code);
    this.props.onDetected(res.codeResult.code);
    Quagga.stop();
    Quagga.offProcessed();
  }

  render() {
    return (
      <Fragment>
        <div id="barcodeScan"></div>
      </Fragment>
    );
  }
}

export default Scanner;
