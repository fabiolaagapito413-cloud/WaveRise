// =====================================
// MAPA PREMIUM - WaveRise 3.0
// =====================================

let marcador = null;

// =====================================

export function iniciarMapa(id = "mapa") {

    const mapa = L.map(id, {

        zoomControl: false,

        attributionControl: false

    }).setView([-23.96, -46.33], 10);

    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            maxZoom: 19

        }

    ).addTo(mapa);

    return mapa;

}

// =====================================

export function moverMapa(

    mapa,

    latitude,

    longitude,

    praia

) {

    mapa.flyTo(

        [latitude, longitude],

        12,

        {

            duration: 1.8

        }

    );

    if (marcador) {

        mapa.removeLayer(marcador);

    }

    const icone = L.divIcon({

        className: "waveMarker",

        html: `
            <div class="wave-marker">
                🌊
            </div>
        `,

        iconSize: [40, 40],

        iconAnchor: [20, 20]

    });

    marcador = L.marker(

        [latitude, longitude],

        {

            icon: icone

        }

    ).addTo(mapa);

    marcador.bindPopup(

        `
        <strong>${praia}</strong><br>
        WaveRise 🌊
        `
    );

    marcador.openPopup();

}

// =====================================

export function obterMarcador() {

    return marcador;

}