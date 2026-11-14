import fs from 'fs';

let content = fs.readFileSync('src/data/units.ts', 'utf8');

const replacements = [
  { id: 'espadachin_hierro', newImg: '/assets/images/espadachin_hierro_1791739910528.jpg' },
  { id: 'arquera_elfica', newImg: '/assets/images/arquera_elfica_1791739921640.jpg' },
  { id: 'lanzacohetes', newImg: '/assets/images/lanzacohetes_artillery_1791739933641.jpg' },
  { id: 'mago_fuego', newImg: '/assets/images/mago_fuego_infernal_1791739954131.jpg' },
  { id: 'chaman_electrico', newImg: '/assets/images/chaman_electrico_storm_1791739966404.jpg' }
];

for (const r of replacements) {
  const reg = new RegExp(`(id:\\s*'${r.id}'[\\s\\S]*?imageUrl:\\s*')[^']+'`);
  content = content.replace(reg, `$1${r.newImg}'`);
}

fs.writeFileSync('src/data/units.ts', content, 'utf8');
console.log('Successfully updated 5 heroes with newly generated AI images!');
