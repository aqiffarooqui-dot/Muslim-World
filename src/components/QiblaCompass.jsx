import React, { useState, useEffect } from 'react';

const QiblaCompass = () => {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState(0);
  const [error, setError] = useState('');

  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          calculateQibla(userLat, userLng);
        },
        (err) => {
          setError('Location permission required for Qibla direction.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }

    const handleOrientation = (e) => {
      let compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
      if (compass !== undefined) {
        setHeading(compass);
      }
    };

    if (window.DeviceOrientationEvent) {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then((response) => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error);
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const calculateQibla = (lat, lng) => {
    const phiK = (KAABA_LAT * Math.PI) / 180;
    const lambdaK = (KAABA_LNG * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    const lambda = (lng * Math.PI) / 180;

    const y = Math.sin(lambdaK - lambda);
    const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
    let qibla = Math.atan2(y, x);
    qibla = (qibla * 180) / Math.PI;
    qibla = (qibla + 360) % 360;

    setQiblaDirection(qibla);
  };

  const rotationAngle = qiblaDirection - heading;

  return (
    <div style={{ textAlign: 'center', padding: '20px', color: '#fff', background: '#0b132b', minHeight: '100vh' }}>
      <h2>Qibla Direction</h2>
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      
      <div style={{ position: 'relative', width: '250px', height: '250px', margin: '40px auto', borderRadius: '50%', border: '4px solid #4cc9f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: `rotate(${rotationAngle}deg)`,
          transition: 'transform 0.1s ease-out',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            width: '0',
            height: '0',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '80px solid #f72585',
            position: 'absolute',
            top: '25px'
          }}></div>
        </div>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Kaaba</span>
      </div>

      <p>Rotate your phone until the arrow points straight up.</p>
    </div>
  );
};

export default QiblaCompass;
