'use client'
import React, { useEffect } from 'react';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/maps/world.js'; // Dünya haritası verisi
import 'jsvectormap/dist/jsvectormap.css';

const WorldMap = () => {
  useEffect(() => {
    // Haritayı render etmeden önce eski bir instance varsa temizleyelim
    const mapElement = document.getElementById('world-map');
    if (mapElement) mapElement.innerHTML = '';

    const map = new jsVectorMap({
      selector: '#world-map',
      map: 'world',
      backgroundColor: 'transparent',
      draggable: true,
      zoomOnScroll: false,
      regionStyle: {
        initial: {
          fill: '#2D3748',
          stroke: '#1A202C',
          strokeWidth: 1,
        },
        hover: {
          fill: '#818CF8',
        },
      },
      markers: [
        { name: 'Türkiye', coords: [40.656, 29.2712] },
        { name: 'Europe Office', coords: [41.8925, 12.4964] },
        { name: 'USA Office', coords: [39.8283, -98.5795] },
        { name: 'Asia Office', coords: [35.6895, 139.6917] },
        { name: 'Africa Office', coords: [-26.2041, 28.0473] },
      ],
      markerStyle: {
        initial: {
          fill: '#E92B63', // Marker rengi
          stroke: '#fff',
          radius: 5,
        },
      },
    });

    return () => map.destroy(); 
  }, []);

  return <div id="world-map" style={{ width: '100%', height: '300px' }}></div>;
};

export default WorldMap;