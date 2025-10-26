import React from 'react';
import { WebView } from 'react-native-webview';

export default function IncidentHeatmap({ apiKey, incidents = [] }) {
  // Convert data to JSON for injecting
  const incidentsData = JSON.stringify(incidents);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-core.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-service.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"></script>
        <script src="https://js.api.here.com/v3/3.1/mapsjs-data.js"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const platform = new H.service.Platform({ apikey: '${apiKey}' });
          const defaultLayers = platform.createDefaultLayers();
          const map = new H.Map(
            document.getElementById('map'),
            defaultLayers.vector.normal.map,
            { center: {lat:14.7940, lng:120.9429}, zoom: 12 }
          );

          const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
          const ui = H.ui.UI.createDefault(map, defaultLayers);

          const incidents = ${incidentsData};
          const group = new H.map.Group();

          incidents.forEach(i => {
            if (!i.lat || !i.lng) return;
            const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="34"><path d="M12 0C5.4 0 0 5.2 0 11.6c0 7.9 10.6 20.7 11.1 21.3a1 1 0 0 0 1.7 0C13.4 32.3 24 19.5 24 11.6 24 5.2 18.6 0 12 0z" fill="red" stroke="#222" stroke-width="1"/><circle cx="12" cy="11" r="4" fill="#fff" stroke="#222" stroke-width="1"/></svg>';
            const icon = new H.map.Icon(svg);
            const marker = new H.map.Marker({lat: i.lat, lng: i.lng}, { icon });
            group.addObject(marker);
          });

          map.addObject(group);
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={{ flex: 1 }}
    />
  );
}
