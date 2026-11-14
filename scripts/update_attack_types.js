import fs from 'fs';

let content = fs.readFileSync('src/data/units.ts', 'utf8');

const attackTypeUpdates = [
  { id: 'espadachin_hierro', type: 'slash', color: '#CBD5E1' },
  { id: 'samurai_carmesi', type: 'slash', color: '#EF4444' },
  { id: 'ninja_sombrio', type: 'slash', color: '#9333EA' },
  { id: 'asesina_carmesi', type: 'slash', color: '#F43F5E' },
  { id: 'arquera_elfica', type: 'arrow', color: '#10B981' },
  { id: 'artillero_pesado', type: 'multishot', color: '#F97316' },
  { id: 'robot_centinela', type: 'multishot', color: '#06B6D4' },
  { id: 'lanzacohetes', type: 'missile', color: '#EF4444' },
  { id: 'golem_magma', type: 'shockwave', color: '#EA580C' },
  { id: 'caballero_cristal', type: 'stun', color: '#38BDF8' },
  { id: 'druida_bosque', type: 'spore', color: '#22C55E' },
  { id: 'reina_espinas', type: 'spore', color: '#16A34A' },
  { id: 'chaman_electrico', type: 'lightning', color: '#38BDF8' },
  { id: 'titan_tormenta', type: 'lightning', color: '#60A5FA' },
  { id: 'kronos_dimensiones', type: 'portal', color: '#C084FC' },
  { id: 'viajero_tiempo', type: 'portal', color: '#818CF8' }
];

let updatedCount = 0;
for (const u of attackTypeUpdates) {
  const blockReg = new RegExp(`(id:\\s*'${u.id}'[\\s\\S]*?projectileType:\\s*')[^']+('[\\s\\S]*?projectileColor:\\s*')[^']+'`);
  if (blockReg.test(content)) {
    content = content.replace(blockReg, `$1${u.type}$2${u.color}'`);
    updatedCount++;
  }
}

fs.writeFileSync('src/data/units.ts', content, 'utf8');
console.log('Updated unit attack archetypes count:', updatedCount);
