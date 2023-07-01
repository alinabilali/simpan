import React from 'react';
import { useState, useEffect } from 'react';
import Scanner from '../../components/Scanner';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BARCODES } from '../../config/barcode';
import Swal from 'sweetalert2';

const BarcodeScanner = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [scanning, setScanning] = useState(false);

  const _scan = () => {
    setScanning(!scanning);
  };

  const _onDetected = (result) => {
    setResults([]);
    setResults(results.concat([result]));
    setScanComplete(true);
  };

  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    if (scanComplete) {
      const barcodeID = BARCODES.find(
        (num) => num.barcodeNum === results.toString()
      );

      if (barcodeID) {
        navigate('/dash/food/scanned', { state: { results } });
      }

      if (!barcodeID) {
        Swal.fire({
          title: 'Barcode Not Found',
          text: 'This barcode is not registered in the system. Click OK to add it manually.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.value) {
            navigate('/dash/food/new', { state: { results } });
          }
        });
      }
    }
  }, [navigate, results, scanComplete]);

  return (
    <div>
      <Link to="/"></Link>
      <h1>Barcode Scanner</h1>

      <Scanner results={results} onDetected={_onDetected} />
    </div>
  );
};

export default BarcodeScanner;
