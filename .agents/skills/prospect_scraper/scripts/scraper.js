import fs from 'fs';
import path from 'path';

// Parse arguments
const args = process.argv.slice(2);
const getArg = (flag, defaultValue) => {
  const index = args.indexOf(flag);
  return index !== -1 && args[index + 1] ? args[index + 1] : defaultValue;
};

const country = getArg('--country', 'AR').toUpperCase();

const cityCoords = {
  'buenos aires': { lat: -34.6037, lon: -58.3816 },
  'cordoba': { lat: -31.4135, lon: -64.1810 },
  'crdoba': { lat: -31.4135, lon: -64.1810 },
  'rosario': { lat: -32.9442, lon: -60.6505 },
  'lima': { lat: -12.0464, lon: -77.0428 },
  'arequipa': { lat: -16.4090, lon: -71.5375 },
  'trujillo': { lat: -8.1160, lon: -79.0300 }
};

const countryDefaults = {
  'AR': { lat: -34.6037, lon: -58.3816, city: 'Buenos Aires' },
  'PE': { lat: -12.0464, lon: -77.0428, city: 'Lima' }
};

const defaultCityObj = countryDefaults[country] || countryDefaults['AR'];
const city = getArg('--city', defaultCityObj.city);
const limit = parseInt(getArg('--limit', '10'), 10);
const outputFile = getArg('--output', 'scraped_prospects.json');

const lookupKey = city.toLowerCase().trim();
const coord = cityCoords[lookupKey] || { lat: defaultCityObj.lat, lon: defaultCityObj.lon };

console.log(`\n🚀 Iniciando scraping de inmobiliarias en OpenStreetMap...`);
console.log(`📍 País: ${country}`);
console.log(`🏙️ Ciudad: ${city} (Lat: ${coord.lat}, Lon: ${coord.lon})`);
console.log(`🔢 Límite: ${limit}\n`);

const query = `
[out:json][timeout:10];
node["office"="estate_agent"](around:50000,${coord.lat},${coord.lon});
out body;
`;

const url = 'https://overpass.kumi.systems/api/interpreter';

async function run() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.statusText}`);
    }

    const data = await response.json();
    const elements = data.elements || [];
    
    console.log(`🔍 Total de inmobiliarias encontradas en el mapa: ${elements.length}`);

    // Map and filter elements
    const prospects = [];
    for (const el of elements) {
      const tags = el.tags || {};
      const name = tags.name;
      const website = tags.website || tags['contact:website'] || null;
      const phone = tags.phone || tags['contact:phone'] || tags['contact:mobile'] || '-';
      const city = tags['addr:city'] || tags['addr:suburb'] || 'Confirmar';
      
      // If there's no website, it's a prospect!
      if (name && !website) {
        prospects.push({
          nombre: name,
          ciudad: city,
          telefono: phone,
          instagram: '-',
          web: null,
          rating: 4.0,
          rubro: 'Inmobiliaria',
          fuente: 'osm_scraper',
          estado: 'nuevo',
          created_at: new Date().toISOString()
        });
      }

      if (prospects.length >= limit) {
        break;
      }
    }

    console.log(`🏆 Prospectos calificados (sin sitio web) seleccionados: ${prospects.length}`);
    
    // Save to output file (JSON)
    fs.writeFileSync(outputFile, JSON.stringify(prospects, null, 2), 'utf-8');
    console.log(`💾 Resultados guardados exitosamente en JSON: '${outputFile}'`);
    
    // Save to output file (CSV)
    const csvHeader = 'Name,City,Phone,Website,Instagram,Rating,Category\n';
    const csvRows = prospects.map(p => {
      const escape = (str) => `"${(str || '').replace(/"/g, '""')}"`;
      return `${escape(p.nombre)},${escape(p.ciudad)},${escape(p.telefono)},${escape(p.web)},${escape(p.instagram)},${p.rating},${escape(p.rubro)}`;
    }).join('\n');
    const csvOutputFile = outputFile.replace('.json', '.csv');
    fs.writeFileSync(csvOutputFile, csvHeader + csvRows, 'utf-8');
    console.log(`💾 Resultados guardados exitosamente en CSV: '${csvOutputFile}'`);
    
    console.log('\n--- MUESTRA DE PROSPECTOS ---');
    console.table(prospects.map(p => ({ Nombre: p.nombre, Ciudad: p.ciudad, Teléfono: p.telefono })));

  } catch (error) {
    console.error(`❌ Error durante el scraping:`, error.message);
    process.exit(1);
  }
}

run();
