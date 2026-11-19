import { UnitBlueprint } from '../types/game';

export const UNITS: Record<string, UnitBlueprint> = {
  vanguard_solar: {
    id: 'vanguard_solar',
    name: 'Vanguardia Solar',
    title: 'Centinela de Plasma',
    role: 'ataque',
    rarity: 'comun',
    cost: 100,
    baseDamage: 22,
    baseRange: 135,
    baseAttackSpeed: 1.4, // attacks per second
    projectileType: 'laser',
    projectileColor: '#F59E0B',
    imageUrl: '/assets/images/hero_vanguard_solar_1791483615299.jpg',
    showdownImageUrl: '/assets/images/attack_meteor_1791483757694.jpg',
    description: 'Guardián ágil que dispara ráfagas de energía solar de alta precisión.',
    showdownName: 'Lluvia de Meteoros',
    showdownDescription: 'Convoca 6 meteoros ardientes sobre el camino que infligen 260 de daño y aturden a los enemigos por 1.2s.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Núcleo Solar I',
        cost: 0,
        damage: 22,
        range: 135,
        attackSpeed: 1.4,
        description: 'Disparos solares estándar de alta cadencia.'
      },
      {
        name: 'Lanza Hiperión II',
        cost: 110,
        damage: 42,
        range: 155,
        attackSpeed: 1.8,
        description: '+90% daño y mayor alcance de adquisición táctica.',
        bonusEffect: 'Velocidad de ataque +30%'
      },
      {
        name: 'Furia de Helios III',
        cost: 240,
        damage: 95,
        range: 180,
        attackSpeed: 2.4,
        description: 'Dispara haces solares dobles con penetración térmica.',
        bonusEffect: 'Showdown cooldown reducido en 8s'
      }
    ],
    colorTheme: {
      primary: '#F59E0B',
      secondary: '#D97706',
      accent: '#FEF3C7',
      bg: 'rgba(245, 158, 11, 0.15)'
    }
  },

  pyromancer: {
    id: 'pyromancer',
    name: 'Piromante de Magma',
    title: 'Artillero Ígneo',
    role: 'area',
    rarity: 'especial',
    cost: 165,
    baseDamage: 40,
    baseRange: 120,
    baseAttackSpeed: 0.85,
    projectileType: 'fireball',
    projectileColor: '#EF4444',
    imageUrl: '/assets/images/hero_pyromancer_1791483624218.jpg',
    showdownImageUrl: '/assets/images/attack_supernova_1791483748936.jpg',
    description: 'Lanza orbes de magma condensado que detonan en un radio amplio, dañando a múltiples enemigos.',
    showdownName: 'Supernova Infernal',
    showdownDescription: 'Desata una colosal onda expansiva que calcina la zona, causando 380 de daño masivo y quemando a todos los enemigos por 5s.',
    showdownCooldown: 38,
    tiers: [
      {
        name: 'Orbe Ígneo I',
        cost: 0,
        damage: 40,
        range: 120,
        attackSpeed: 0.85,
        description: 'Explosión de 45px de radio al impactar.'
      },
      {
        name: 'Fuego Abrasador II',
        cost: 150,
        damage: 75,
        range: 135,
        attackSpeed: 1.1,
        description: 'Radio de explosión incrementado a 65px e inflige quemadura continua.',
        bonusEffect: 'Quemadura: 15 daño/seg'
      },
      {
        name: 'Erupción Volcánica III',
        cost: 320,
        damage: 160,
        range: 155,
        attackSpeed: 1.35,
        description: 'Detonaciones gigantescas de 85px de radio que ignoran 50% de la armadura enemiga.',
        bonusEffect: 'Radio de área máximo + armadura perforada'
      }
    ],
    colorTheme: {
      primary: '#EF4444',
      secondary: '#B91C1C',
      accent: '#FEE2E2',
      bg: 'rgba(239, 68, 68, 0.15)'
    }
  },

  zeker: {
    id: 'zeker',
    name: 'Zeker',
    title: 'Cazador de Brechas Crono',
    role: 'ataque',
    rarity: 'especial',
    cost: 115,
    baseDamage: 26,
    baseRange: 145,
    baseAttackSpeed: 1.65,
    projectileType: 'lightning',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_zeker_1794953003016.jpg',
    description: 'Cazador crono-eléctrico inicial armado con dagas de arco voltaico. Ataca con velocidad relampagueante y desgarra enemigos en línea.',
    showdownName: 'Tormenta de Filos Zeker',
    showdownDescription: 'Ejecuta cortes crono-eléctricos a todos los invasores del mapa, infligiendo 340 de daño y aturdiéndolos por 1.1s.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Dagas de Brecha I',
        cost: 0,
        damage: 26,
        range: 145,
        attackSpeed: 1.65,
        description: 'Descargas rápidas de energía crono-eléctrica de gran precisión.'
      },
      {
        name: 'Sobrecarga Voltaica II',
        cost: 125,
        damage: 54,
        range: 165,
        attackSpeed: 2.05,
        description: 'Aumenta drásticamente la cadencia de ataque y el alcance táctico.',
        bonusEffect: 'Cadencia +25% · Mayor alcance'
      },
      {
        name: 'Señor del Relámpago III',
        cost: 270,
        damage: 118,
        range: 190,
        attackSpeed: 2.55,
        description: 'Filos cargados al máximo que pulverizan exploradores y armaduras ligeras.',
        bonusEffect: 'Velocidad relámpago máxima'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#4F46E5',
      accent: '#E0F2FE',
      bg: 'rgba(56, 189, 248, 0.16)'
    }
  },

  cryo_mage: {
    id: 'cryo_mage',
    name: 'Criomago Glacial',
    title: 'Señor del Cero Absoluto',
    role: 'control',
    rarity: 'especial',
    cost: 155,
    baseDamage: 16,
    baseRange: 125,
    baseAttackSpeed: 1.1,
    projectileType: 'ice',
    projectileColor: '#06B6D4',
    imageUrl: '/assets/images/hero_cryo_mage_1791483643403.jpg',
    description: 'Dispara esquirlas de escarcha que ralentizan a los enemigos y los paraliza una sola vez por breve tiempo.',
    showdownName: 'Ventisca Cero',
    showdownDescription: 'Paraliza durante 1.5s (0.6s a jefes) a enemigos aún no congelados por Criomago y ralentiza a todo el mapa.',
    showdownCooldown: 44,
    tiers: [
      {
        name: 'Escarcha I',
        cost: 0,
        damage: 16,
        range: 125,
        attackSpeed: 1.1,
        description: 'Ralentiza a los objetivos un 35% durante 2.2s.'
      },
      {
        name: 'Vórtice Glacial II',
        cost: 140,
        damage: 32,
        range: 145,
        attackSpeed: 1.35,
        description: 'La ralentización aumenta al 50% en un radio de 30px.',
        bonusEffect: 'Ralentización en área'
      },
      {
        name: 'Cero Absoluto III',
        cost: 300,
        damage: 72,
        range: 165,
        attackSpeed: 1.65,
        description: 'Ralentiza un 60% y paraliza al enemigo una única vez por 0.6s.',
        bonusEffect: 'Parálisis única (0.6s)'
      }
    ],
    colorTheme: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#CFFAFE',
      bg: 'rgba(6, 182, 212, 0.15)'
    }
  },

  alchemist: {
    id: 'alchemist',
    name: 'Alquimista Áureo',
    title: 'Mercader Transmutador',
    role: 'economia',
    rarity: 'especial',
    cost: 120,
    baseDamage: 12,
    baseRange: 110,
    baseAttackSpeed: 0.9,
    projectileType: 'coin',
    projectileColor: '#EAB308',
    imageUrl: '/assets/images/hero_alchemist_1791483655132.jpg',
    description: 'Genera oro táctico al final de cada ronda y transmuta objetivos derrotados en botín adicional.',
    showdownName: 'Golpe de Midas',
    showdownDescription: 'Genera instantáneamente +80 monedas de oro puro y aturde a los 5 enemigos más cercanos por 3s.',
    showdownCooldown: 45,
    tiers: [
      {
        name: 'Crisol de Cobre I',
        cost: 0,
        damage: 12,
        range: 110,
        attackSpeed: 0.9,
        ecoYield: 15,
        description: 'Genera +15 monedas de oro garantizadas al final de cada ronda.'
      },
      {
        name: 'Matraz de Plata II',
        cost: 130,
        damage: 24,
        range: 125,
        attackSpeed: 1.2,
        ecoYield: 28,
        description: 'Genera +28 oro por ronda y añade un bonus al derrotar enemigos.',
        bonusEffect: '+28 Oro/ronda balanceado'
      },
      {
        name: 'Piedra Filosofal III',
        cost: 260,
        damage: 55,
        range: 145,
        attackSpeed: 1.5,
        ecoYield: 45,
        description: 'Genera +45 oro por ronda y duplica el botín de transmutación.',
        bonusEffect: '+45 Oro/ronda sostenido'
      }
    ],
    colorTheme: {
      primary: '#EAB308',
      secondary: '#CA8A04',
      accent: '#FEF08A',
      bg: 'rgba(234, 179, 8, 0.15)'
    }
  },

  resonator: {
    id: 'resonator',
    name: 'Resonador Sísmico',
    title: 'Tótem de Armonía Táctica',
    role: 'soporte',
    rarity: 'epica',
    cost: 210,
    baseDamage: 15,
    baseRange: 140,
    baseAttackSpeed: 0.7,
    projectileType: 'resonance',
    projectileColor: '#10B981',
    imageUrl: '/assets/images/hero_resonator_1791483708829.jpg',
    description: 'Emite pulsos armónicos que potencian el daño y velocidad de ataque de todas las unidades aliadas cercanas.',
    showdownName: 'Hiperimpulso Táctico',
    showdownDescription: 'Sobrecarga el sistema: Todas las unidades en el mapa obtienen +60% daño y +50% cadencia durante 8 segundos.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Aura Armónica I',
        cost: 0,
        damage: 15,
        range: 140,
        attackSpeed: 0.7,
        description: 'Otorga +20% de daño a unidades aliadas dentro de su radio.'
      },
      {
        name: 'Frecuencia Cuántica II',
        cost: 180,
        damage: 30,
        range: 165,
        attackSpeed: 0.9,
        description: 'Otorga +35% de daño y +25% de velocidad de ataque a todos los aliados en rango.',
        bonusEffect: 'Buff: +35% Daño / +25% Cadencia'
      },
      {
        name: 'Sintonía Trascendental III',
        cost: 360,
        damage: 60,
        range: 195,
        attackSpeed: 1.2,
        description: 'Otorga +55% de daño, +40% de cadencia y reduce en 25% el enfriamiento de Showdowns cercanos.',
        bonusEffect: 'Super-Aura masiva y reducción de CD'
      }
    ],
    colorTheme: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#A7F3D0',
      bg: 'rgba(168, 85, 247, 0.15)'
    }
  },

  void_sniper: {
    id: 'void_sniper',
    name: 'Francotirador del Vacío',
    title: 'Cañón Cuántico de Singularidad',
    role: 'especial',
    rarity: 'legendaria',
    cost: 280,
    baseDamage: 140,
    baseRange: 280,
    baseAttackSpeed: 0.45,
    projectileType: 'beam',
    projectileColor: '#A855F7',
    imageUrl: '/assets/images/hero_void_sniper_1791483664537.jpg',
    showdownImageUrl: '/assets/images/attack_orbital_beam_1791483770365.jpg',
    description: 'Especialista de alcance colosal con disparos hiper-densos que penetran armadura y vaporizan objetivos clave.',
    showdownName: 'Rayo Orbital de Ruptura',
    showdownDescription: 'Dispara una lanza cósmica vertical que inflige 1,200 de daño al enemigo más fuerte y 400 en línea recta.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Cañón de Riel I',
        cost: 0,
        damage: 140,
        range: 280,
        attackSpeed: 0.45,
        description: 'Disparos lentos pero devastadores con rango extraordinario.'
      },
      {
        name: 'Lente Cuántica II',
        cost: 240,
        damage: 310,
        range: 340,
        attackSpeed: 0.6,
        description: 'Alcance casi completo del mapa e ignora totalmente la armadura del objetivo.',
        bonusEffect: 'Penetración de Armadura 100%'
      },
      {
        name: 'Singularidad III',
        cost: 520,
        damage: 720,
        range: 420,
        attackSpeed: 0.8,
        description: 'Disparos con 35% de probabilidad de golpe crítico (daño x3) y alcance ilimitado.',
        bonusEffect: 'Golpes Críticos x3 Devastadores'
      }
    ],
    colorTheme: {
      primary: '#A855F7',
      secondary: '#7E22CE',
      accent: '#F3E8FF',
      bg: 'rgba(168, 85, 247, 0.15)'
    }
  },

  chrono_guardian: {
    id: 'chrono_guardian',
    name: 'Guardián Crono',
    title: 'Protector de la Fortaleza',
    role: 'especial',
    rarity: 'epica',
    cost: 230,
    baseDamage: 28,
    baseRange: 135,
    baseAttackSpeed: 1.1,
    projectileType: 'laser',
    projectileColor: '#3B82F6',
    imageUrl: '/assets/images/hero_chrono_guardian_1791483673461.jpg',
    description: 'Guardián temporal que debilita el avance hostil y puede reconstruir la integridad del núcleo.',
    showdownName: 'Rebobinado Temporal',
    showdownDescription: 'Restaura +30 puntos de vida al Núcleo de la Base y empuja a todos los enemigos 120px hacia atrás.',
    showdownCooldown: 44,
    tiers: [
      {
        name: 'Matriz Crono I',
        cost: 0,
        damage: 28,
        range: 135,
        attackSpeed: 1.1,
        description: 'Dispara haces cronales que entorpecen la marcha hostil.'
      },
      {
        name: 'Bucle Temporal II',
        cost: 190,
        damage: 58,
        range: 155,
        attackSpeed: 1.45,
        description: 'Los enemigos alcanzados son teletransportados 40px hacia atrás en el camino (CD 6s por enemigo).',
        bonusEffect: 'Micro-teletransporte regresivo'
      },
      {
        name: 'Fortaleza Eterna III',
        cost: 390,
        damage: 130,
        range: 180,
        attackSpeed: 1.85,
        description: 'Restaura +3 HP a la base al final de cada ronda y genera un escudo protector.',
        bonusEffect: '+3 HP a la base por ronda'
      }
    ],
    colorTheme: {
      primary: '#3B82F6',
      secondary: '#1D4ED8',
      accent: '#DBEAFE',
      bg: 'rgba(59, 130, 246, 0.15)'
    }
  },

  valkyrie_storm: {
    id: 'valkyrie_storm',
    name: 'Valquiria de la Tormenta',
    title: 'Señora del Rayo',
    role: 'ataque',
    rarity: 'epica',
    cost: 210,
    baseDamage: 38,
    baseRange: 150,
    baseAttackSpeed: 1.3,
    projectileType: 'beam',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_valkyrie_storm_1791486414560.jpg',
    description: 'Guerrera celestial que invoca arcos de relámpago encadenados entre enemigos con alta cadencia.',
    showdownName: 'Tormenta de Relámpagos',
    showdownDescription: 'Descarga un vendaval de truenos que inflige 480 de daño a todos los enemigos en el campo y los aturde durante 3s.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Jabalina Eléctrica I',
        cost: 0,
        damage: 38,
        range: 150,
        attackSpeed: 1.3,
        description: 'Proyectiles de rayo certeros con velocidad lumínica.'
      },
      {
        name: 'Sobrecarga de Tormenta II',
        cost: 175,
        damage: 78,
        range: 175,
        attackSpeed: 1.65,
        description: 'Incrementa el daño eléctrico en +105% y el alcance.',
        bonusEffect: 'Arco eléctrico bifurcado'
      },
      {
        name: 'Cólera del Olimpo III',
        cost: 360,
        damage: 165,
        range: 205,
        attackSpeed: 2.1,
        description: 'Disparos fulgurantes continuos con daño masivo a unidades blindadas.',
        bonusEffect: 'Daño crítico +35%'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#0284C7',
      accent: '#E0F2FE',
      bg: 'rgba(56, 189, 248, 0.15)'
    }
  },

  toxic_shaman: {
    id: 'toxic_shaman',
    name: 'Chamán Tóxico',
    title: 'Herborista de Miasma',
    role: 'control',
    rarity: 'comun',
    cost: 130,
    baseDamage: 24,
    baseRange: 130,
    baseAttackSpeed: 0.95,
    projectileType: 'fireball',
    projectileColor: '#22C55E',
    imageUrl: '/assets/images/hero_toxic_shaman_1791486425715.jpg',
    description: 'Lanza frascos de brea corrosiva que empapan el camino con veneno persistente y reducen la velocidad.',
    showdownName: 'Erupción de Miasma',
    showdownDescription: 'Inunda todo el campo de batalla con gas tóxico, disuelve un 50% de la armadura enemiga y causa 75 DPS por 6 segundos.',
    showdownCooldown: 34,
    tiers: [
      {
        name: 'Vial de Ácido I',
        cost: 0,
        damage: 24,
        range: 130,
        attackSpeed: 0.95,
        description: 'Aplica veneno de 12 DPS durante 3.5 segundos.'
      },
      {
        name: 'Niebla Venenosa II',
        cost: 130,
        damage: 50,
        range: 150,
        attackSpeed: 1.25,
        description: 'El charco de veneno ralentiza un 35% a los afectados.',
        bonusEffect: 'Ralentización corrosiva +35%'
      },
      {
        name: 'Peste Devastadora III',
        cost: 280,
        damage: 110,
        range: 175,
        attackSpeed: 1.6,
        description: 'El ácido derrite el blindaje reduciendo a la mitad la defensa enemiga.',
        bonusEffect: 'Disolución de blindaje'
      }
    ],
    colorTheme: {
      primary: '#22C55E',
      secondary: '#15803D',
      accent: '#DCFCE7',
      bg: 'rgba(34, 197, 94, 0.15)'
    }
  },

  mecha_artillery: {
    id: 'mecha_artillery',
    name: 'Coloso de Artillería',
    title: 'Batería de Asedio Pesada',
    role: 'area',
    rarity: 'epica',
    cost: 260,
    baseDamage: 85,
    baseRange: 210,
    baseAttackSpeed: 0.45,
    projectileType: 'fireball',
    projectileColor: '#D97706',
    imageUrl: '/assets/images/hero_mecha_artillery_1791486433415.jpg',
    description: 'Armatoste mecánico de asedio que dispara proyectiles parabólicos con gigantesca onda expansiva.',
    showdownName: 'Bombardeo de Racimo',
    showdownDescription: 'Dispara una salva aérea devastadora de 10 impactos explosivos que aniquilan enjambres y jefes.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Cañón Pesado I',
        cost: 0,
        damage: 85,
        range: 210,
        attackSpeed: 0.45,
        description: 'Enorme radio de explosión de área con daño masivo.'
      },
      {
        name: 'Obús Vulcan II',
        cost: 220,
        damage: 180,
        range: 235,
        attackSpeed: 0.6,
        description: '+110% de daño y radio de dispersión aumentado en 30px.',
        bonusEffect: 'Radio de área +50%'
      },
      {
        name: 'Acorazado Terrestre III',
        cost: 440,
        damage: 380,
        range: 260,
        attackSpeed: 0.8,
        description: 'Impactos telúricos que pulverizan tanques y blindajes de jauría.',
        bonusEffect: 'Daño a tanques +50%'
      }
    ],
    colorTheme: {
      primary: '#F59E0B',
      secondary: '#B45309',
      accent: '#FEF3C7',
      bg: 'rgba(245, 158, 11, 0.15)'
    }
  },

  shadow_assassin: {
    id: 'shadow_assassin',
    name: 'Asesino Umbrío',
    title: 'Espectro de Éter',
    role: 'especial',
    rarity: 'legendaria',
    cost: 290,
    baseDamage: 65,
    baseRange: 140,
    baseAttackSpeed: 1.8,
    projectileType: 'laser',
    projectileColor: '#C084FC',
    imageUrl: '/assets/images/hero_shadow_assassin_1791486441952.jpg',
    description: 'Rogue etéreo ultra veloz que corta a los enemigos prioritarios con dagas de sombra y golpes críticos.',
    showdownName: 'Danza de las Sombras',
    showdownDescription: 'Se teletransporta por el camino ejecutando tajos etéreos que causan 1400 de daño crítico instantáneo al enemigo más fuerte.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Hojas de Vacío I',
        cost: 0,
        damage: 65,
        range: 140,
        attackSpeed: 1.8,
        description: 'Ataques veloces de sombra con 20% de probabilidad crítica.'
      },
      {
        name: 'Paso Espectral II',
        cost: 250,
        damage: 135,
        range: 160,
        attackSpeed: 2.3,
        description: 'Cadencia feroz y daño duplicado contra objetivos con poca salud.',
        bonusEffect: 'Ejecución a baja vida'
      },
      {
        name: 'Segador del Eclipse III',
        cost: 500,
        damage: 290,
        range: 185,
        attackSpeed: 3.0,
        description: 'Torbellino de tajos hiperdimensionales que ignoran el 100% del blindaje.',
        bonusEffect: 'Ignora armadura por completo'
      }
    ],
    colorTheme: {
      primary: '#C084FC',
      secondary: '#9333EA',
      accent: '#FAF5FF',
      bg: 'rgba(192, 132, 252, 0.15)'
    }
  },

  plasma_gunner: {
    id: 'plasma_gunner',
    name: 'Artillero de Plasma',
    title: 'Comando Cyber-Crono',
    role: 'ataque',
    rarity: 'comun',
    cost: 160,
    baseDamage: 28,
    baseRange: 160,
    baseAttackSpeed: 2.5,
    projectileType: 'laser',
    projectileColor: '#06B6D4',
    imageUrl: '/assets/images/hero_plasma_gunner_1791556369753.jpg',
    description: 'Tirador cibernético con fusil de pulsos continuos de plasma a cadencia extrema.',
    showdownName: 'Sobrecarga de Plasma',
    showdownDescription: 'Descarga un torrente iónico masivo que barre el camino causando 460 de daño y disuelve la armadura enemiga por 5s.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Fusil de Pulsos I',
        cost: 0,
        damage: 28,
        range: 160,
        attackSpeed: 2.5,
        description: 'Ráfaga de plasma continuo a gran velocidad.'
      },
      {
        name: 'Acelerador de Flujo II',
        cost: 180,
        damage: 55,
        range: 180,
        attackSpeed: 3.2,
        description: '+95% daño y cadencia sobrecargada a 3.2 disparos/s.',
        bonusEffect: 'Cadencia +28%'
      },
      {
        name: 'Cañón Cuántico III',
        cost: 360,
        damage: 115,
        range: 205,
        attackSpeed: 4.0,
        description: 'Lanza haces de plasma concentrado que perforan múltiples enemigos en fila.',
        bonusEffect: 'Disparos perforantes'
      }
    ],
    colorTheme: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#CFFAFE',
      bg: 'rgba(6, 182, 212, 0.15)'
    }
  },

  paladin_aegis: {
    id: 'paladin_aegis',
    name: 'Paladín de la Égida',
    title: 'Guardián de la Aurora',
    role: 'soporte',
    rarity: 'epica',
    cost: 250,
    baseDamage: 38,
    baseRange: 120,
    baseAttackSpeed: 1.1,
    projectileType: 'resonance',
    projectileColor: '#F59E0B',
    imageUrl: '/assets/images/hero_paladin_aegis_1791556397903.jpg',
    description: 'Caballero sagrado provisto de martillo bendito y escudo que emite auras de protección y poder a sus aliados.',
    showdownName: 'Baluarte de Luz',
    showdownDescription: 'Invoca un santuario celestial que repara +40 de vida al Núcleo Crono y protege a la base de daño por 8 segundos.',
    showdownCooldown: 38,
    tiers: [
      {
        name: 'Martillo Sagrado I',
        cost: 0,
        damage: 38,
        range: 120,
        attackSpeed: 1.1,
        description: 'Golpes sagrados que aumentan +15% el daño de torres adyacentes.'
      },
      {
        name: 'Égida Resplandeciente II',
        cost: 210,
        damage: 72,
        range: 140,
        attackSpeed: 1.4,
        description: 'Aura protectora ampliada: aliados cercanos atacan +25% más rápido.',
        bonusEffect: 'Aura de celeridad aliada'
      },
      {
        name: 'Avatar Divino III',
        cost: 420,
        damage: 155,
        range: 165,
        attackSpeed: 1.8,
        description: 'Ondas expansivas de bendición que aturden a los enemigos al alcanzarlos.',
        bonusEffect: 'Aturdimiento sagrado breve (0.7s)'
      }
    ],
    colorTheme: {
      primary: '#FBBF24',
      secondary: '#D97706',
      accent: '#FEF3C7',
      bg: 'rgba(251, 191, 36, 0.15)'
    }
  },

  geomancer_titan: {
    id: 'geomancer_titan',
    name: 'Geomante Titánico',
    title: 'Coloso de Piedra Rúnica',
    role: 'control',
    rarity: 'epica',
    cost: 280,
    baseDamage: 60,
    baseRange: 145,
    baseAttackSpeed: 0.75,
    projectileType: 'fireball',
    projectileColor: '#F97316',
    imageUrl: '/assets/images/hero_geomancer_titan_1791556415947.jpg',
    description: 'Gigante telúrico ancestral que arroja peñascos masivos que aplastan y aturden brevemente a los invasores.',
    showdownName: 'Fisura Sísmica',
    showdownDescription: 'Abre una falla tectónica a lo largo de todo el camino, aturdiendo a todos los enemigos por 1.6s y ralentizándolos 60% por 6s.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Peñasco Rúnico I',
        cost: 0,
        damage: 60,
        range: 145,
        attackSpeed: 0.75,
        description: 'Impacto de roca con 50px de onda expansiva y 0.5s de micro-aturdimiento.'
      },
      {
        name: 'Furia Tectónica II',
        cost: 230,
        damage: 125,
        range: 165,
        attackSpeed: 0.95,
        description: 'Aumenta el radio a 75px e inflige el doble de daño a tanques blindados.',
        bonusEffect: 'Daño crítico a tanques'
      },
      {
        name: 'Cataclismo Terrestre III',
        cost: 460,
        damage: 260,
        range: 190,
        attackSpeed: 1.2,
        description: 'Lanza meteoros de basalto que dejan rocas obstáculo temporales en el camino.',
        bonusEffect: 'Aturdimiento en área prolongado'
      }
    ],
    colorTheme: {
      primary: '#EA580C',
      secondary: '#C2410C',
      accent: '#FFEDD5',
      bg: 'rgba(234, 88, 12, 0.15)'
    }
  },

  arcane_witch: {
    id: 'arcane_witch',
    name: 'Bruja Arcana',
    title: 'Señora del Tiempo Espacial',
    role: 'especial',
    rarity: 'legendaria',
    cost: 340,
    baseDamage: 90,
    baseRange: 175,
    baseAttackSpeed: 1.1,
    projectileType: 'laser',
    projectileColor: '#A855F7',
    imageUrl: '/assets/images/hero_arcane_witch_1791556434504.jpg',
    description: 'Hechicera cósmica que canaliza esferas galácticas capaces de alterar el flujo temporal y detonar agujeros negros.',
    showdownName: 'Vórtice Espacio-Temporal',
    showdownDescription: 'Invoca un agujero negro que comprime a todos los enemigos hacia el centro e inflige 950 de daño cósmico masivo.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Orbe Galáctico I',
        cost: 0,
        damage: 90,
        range: 175,
        attackSpeed: 1.1,
        description: 'Proyectil arcano con efecto gravitacional que ralentiza 40% al objetivo.'
      },
      {
        name: 'Distorsión de Éter II',
        cost: 290,
        damage: 185,
        range: 200,
        attackSpeed: 1.45,
        description: 'Los impactos crean pequeñas anomalías que dañan a 3 enemigos cercanos a la vez.',
        bonusEffect: 'Rebotes gravitacionales'
      },
      {
        name: 'Supernova Cósmica III',
        cost: 580,
        damage: 390,
        range: 230,
        attackSpeed: 1.85,
        description: 'Singularidades arcanas que desintegran la resistencia elemental enemiga.',
        bonusEffect: 'Daño dimensional devastador'
      }
    ],
    colorTheme: {
      primary: '#A855F7',
      secondary: '#7E22CE',
      accent: '#F3E8FF',
      bg: 'rgba(168, 85, 247, 0.15)'
    }
  },

  inferno_dragon: {
    id: 'inferno_dragon',
    name: 'Dragón Infernal',
    title: 'Terror Volcánico Acorazado',
    role: 'ataque',
    rarity: 'legendaria',
    cost: 360,
    baseDamage: 75,
    baseRange: 150,
    baseAttackSpeed: 2.2,
    projectileType: 'beam',
    projectileColor: '#EA580C',
    imageUrl: '/assets/images/hero_inferno_dragon_1791557148598.jpg',
    description: 'Dragón con armadura de placas que canaliza un rayo térmico continuo que calcina a objetivos resistentes.',
    showdownName: 'Aliento Primigenio',
    showdownDescription: 'Incinera el trayecto de la arena con un torrente de fuego concentrado causando 750 de daño masivo y quemando enemigos por 5s.',
    showdownCooldown: 34,
    tiers: [
      {
        name: 'Rayo Térmico I',
        cost: 0,
        damage: 75,
        range: 150,
        attackSpeed: 2.2,
        description: 'Haz concentrado de calor que funde blindajes enemigos.'
      },
      {
        name: 'Foco de Fusión II',
        cost: 310,
        damage: 155,
        range: 175,
        attackSpeed: 2.6,
        description: '+105% daño e inflige quemadura continua acumulativa.',
        bonusEffect: 'Quemadura térmica: 25 daño/s'
      },
      {
        name: 'Horno Dracónico III',
        cost: 620,
        damage: 320,
        range: 205,
        attackSpeed: 3.1,
        description: 'Llama hiperdensa que desintegra tanques y jefes con daño crítico.',
        bonusEffect: 'Penetración de armadura total'
      }
    ],
    colorTheme: {
      primary: '#EA580C',
      secondary: '#C2410C',
      accent: '#FFEDD5',
      bg: 'rgba(234, 88, 12, 0.15)'
    }
  },

  electro_wizard: {
    id: 'electro_wizard',
    name: 'Mago Eléctrico',
    title: 'Maestro de la Polaridad',
    role: 'control',
    rarity: 'epica',
    cost: 260,
    baseDamage: 45,
    baseRange: 140,
    baseAttackSpeed: 1.3,
    projectileType: 'laser',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_electro_wizard_1791557170088.jpg',
    description: 'Hechicero relampagueante que lanza rayos que electrocutan a los enemigos e interrumpen sus avances.',
    showdownName: 'Tormenta Galvánica',
    showdownDescription: 'Desata una colosal descarga en cadena que paraliza a todos los enemigos durante 3.5s y causa 480 de daño eléctrico.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Descarga Doble I',
        cost: 0,
        damage: 45,
        range: 140,
        attackSpeed: 1.3,
        description: 'Rayos voltaicos con 0.3s de micro-aturdimiento.'
      },
      {
        name: 'Arco Voltaico II',
        cost: 220,
        damage: 95,
        range: 165,
        attackSpeed: 1.6,
        description: 'Los rayos saltan a 2 objetivos adicionales cercanos.',
        bonusEffect: 'Encadenamiento + micro-aturdimiento'
      },
      {
        name: 'Sobrecarga Iónica III',
        cost: 440,
        damage: 195,
        range: 190,
        attackSpeed: 2.0,
        description: 'Descargas de alto voltaje que desestabilizan y ralentizan 60% a los enemigos.',
        bonusEffect: 'Parálisis constante en área'
      }
    ],
    colorTheme: {
      primary: '#0284C7',
      secondary: '#0369A1',
      accent: '#E0F2FE',
      bg: 'rgba(2, 132, 199, 0.15)'
    }
  },

  goblin_demolitionist: {
    id: 'goblin_demolitionist',
    name: 'Duende Demoledor',
    title: 'Experto en Dinamita',
    role: 'area',
    rarity: 'comun',
    cost: 125,
    baseDamage: 32,
    baseRange: 130,
    baseAttackSpeed: 1.1,
    projectileType: 'fireball',
    projectileColor: '#F97316',
    imageUrl: '/assets/images/hero_goblin_demo_1791557185759.jpg',
    description: 'Ingenioso artificiero que arroja barriles de dinamita que detonan en racimo causando gran daño de área.',
    showdownName: 'Bombardeo en Racimo',
    showdownDescription: 'Lanza 10 barriles de pólvora a lo largo del sendero infligiendo 420 de daño explosivo en cadena.',
    showdownCooldown: 26,
    tiers: [
      {
        name: 'Dinamita Casera I',
        cost: 0,
        damage: 32,
        range: 130,
        attackSpeed: 1.1,
        description: 'Explosión de 45px de radio con metralla.'
      },
      {
        name: 'Barril de Pólvora II',
        cost: 120,
        damage: 68,
        range: 150,
        attackSpeed: 1.4,
        description: 'Aumenta el radio a 65px y deja esquirlas incandescentes.',
        bonusEffect: 'Área expandida +20px'
      },
      {
        name: 'Megabomba Subterránea III',
        cost: 250,
        damage: 145,
        range: 175,
        attackSpeed: 1.75,
        description: 'Detonaciones masivas de 85px de radio que destruyen armaduras ligeras.',
        bonusEffect: 'Daño masivo a enjambres'
      }
    ],
    colorTheme: {
      primary: '#16A34A',
      secondary: '#15803D',
      accent: '#DCFCE7',
      bg: 'rgba(22, 163, 74, 0.15)'
    }
  },

  valkyrie_blade: {
    id: 'valkyrie_blade',
    name: 'Valquiria Torbellino',
    title: 'Guerrera del Hacha Rúnica',
    role: 'area',
    rarity: 'especial',
    cost: 195,
    baseDamage: 52,
    baseRange: 115,
    baseAttackSpeed: 1.2,
    projectileType: 'resonance',
    projectileColor: '#F59E0B',
    imageUrl: '/assets/images/hero_valkyrie_blade_1791557203925.jpg',
    description: 'Guerrera legendaria que ejecuta giros cortantes de 360 grados aniquilando hordas enteras de enemigos en su perímetro.',
    showdownName: 'Torbellino Inmortal',
    showdownDescription: 'Gira a hipervelocidad creando un vórtice cortante que barre el radio cercano infligiendo 560 de daño y aturdiendo 2s.',
    showdownCooldown: 28,
    tiers: [
      {
        name: 'Hachazo Circular I',
        cost: 0,
        damage: 52,
        range: 115,
        attackSpeed: 1.2,
        description: 'Corte giratorio que impacta a todos los enemigos a su alcance.'
      },
      {
        name: 'Doble Hacha Rúnica II',
        cost: 170,
        damage: 105,
        range: 135,
        attackSpeed: 1.5,
        description: 'Aumenta la cadencia y radio de giro a 135px.',
        bonusEffect: 'Velocidad de giro +25%'
      },
      {
        name: 'Danza de Valhalla III',
        cost: 340,
        damage: 220,
        range: 155,
        attackSpeed: 1.9,
        description: 'Vórtices de viento cortante que repelen ligeramente a los enemigos.',
        bonusEffect: 'Desgarro de armadura'
      }
    ],
    colorTheme: {
      primary: '#D97706',
      secondary: '#B45309',
      accent: '#FEF3C7',
      bg: 'rgba(217, 119, 6, 0.15)'
    }
  },

  lunar_huntress: {
    id: 'lunar_huntress',
    name: 'Cazadora Lunar',
    title: 'Saeta de la Medianoche',
    role: 'ataque',
    rarity: 'epica',
    cost: 290,
    baseDamage: 68,
    baseRange: 190,
    baseAttackSpeed: 1.25,
    projectileType: 'bullet',
    projectileColor: '#60A5FA',
    imageUrl: '/assets/images/hero_lunar_huntress_1791557218962.jpg',
    description: 'Arquera elfa con arco estelar de alcance masivo cuyas flechas perforan blindajes con precisión letal.',
    showdownName: 'Lluvia de Flechas Lunares',
    showdownDescription: 'Dispara una andanada de 8 saetas astrales que cruzan toda la pantalla aniquilando enemigos con 640 de daño penetrante.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Flecha Lunar I',
        cost: 0,
        damage: 68,
        range: 190,
        attackSpeed: 1.25,
        description: 'Tiro de precisión de larguísimo alcance.'
      },
      {
        name: 'Arco de Media Luna II',
        cost: 240,
        damage: 140,
        range: 220,
        attackSpeed: 1.55,
        description: 'Las flechas perforan al primer enemigo y dañan al siguiente.',
        bonusEffect: 'Penetración de 2 objetivos'
      },
      {
        name: 'Saeta del Eclipse III',
        cost: 480,
        damage: 290,
        range: 250,
        attackSpeed: 1.95,
        description: 'Tiros astrales cargados que causan un 50% de daño crítico garantizado.',
        bonusEffect: 'Golpes críticos cósmicos'
      }
    ],
    colorTheme: {
      primary: '#2563EB',
      secondary: '#1D4ED8',
      accent: '#DBEAFE',
      bg: 'rgba(37, 99, 235, 0.15)'
    }
  },

  golem_sentinel: {
    id: 'golem_sentinel',
    name: 'Centinela Gólem',
    title: 'Coloso de Cuarzo Rúnico',
    role: 'soporte',
    rarity: 'legendaria',
    cost: 385,
    baseDamage: 80,
    baseRange: 135,
    baseAttackSpeed: 0.8,
    projectileType: 'resonance',
    projectileColor: '#14B8A6',
    imageUrl: '/assets/images/hero_golem_sentinel_1791557242272.jpg',
    description: 'Titán viviente con núcleo de gema que potencia torres vecinas y emite pulsos sísmicos.',
    showdownName: 'Pulso Telúrico Cuántico',
    showdownDescription: 'Golpea la tierra con fuerza titánica provocando una onda que aturde a todos los enemigos por 4s y causa 820 de daño masivo.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Onda Cuántica I',
        cost: 0,
        damage: 80,
        range: 135,
        attackSpeed: 0.8,
        description: 'Pulso de resonancia y aura que otorga +15% daño a torres adyacentes.'
      },
      {
        name: 'Resonancia de Cuarzo II',
        cost: 320,
        damage: 165,
        range: 160,
        attackSpeed: 1.05,
        description: 'Aura incrementada a +25% de daño aliado y micro-aturdimiento sísmico.',
        bonusEffect: 'Aura táctica reforzada'
      },
      {
        name: 'Núcleo Geológico III',
        cost: 640,
        damage: 340,
        range: 185,
        attackSpeed: 1.35,
        description: 'Pulsos de choque gigantes que desaceleran 50% a todos los enemigos en rango.',
        bonusEffect: 'Ralentización sísmica continua'
      }
    ],
    colorTheme: {
      primary: '#0D9488',
      secondary: '#0F766E',
      accent: '#CCFBF1',
      bg: 'rgba(13, 148, 136, 0.15)'
    }
  },

  /* ================= CATEGORÍA DIVINIDAD (15 ARENAS) ================= */
  // Cada zona del juego cuenta con su Divinidad exclusiva, desbloqueable solo al alcanzar dicha Arena.
  // Regla Divina: Solo se puede colocar 1 Personaje Divino en el campo de batalla.

  // Arena 1: Valle Esmeralda
  aureon_sun_king: {
    id: 'aureon_sun_king',
    name: 'Aureon, el Rey Solar',
    title: 'Divinidad de la Arena 1 (Valle Esmeralda)',
    role: 'soporte',
    rarity: 'divinidad',
    arenaUnlockLevel: 1,
    cost: 450,
    baseDamage: 75,
    baseRange: 160,
    baseAttackSpeed: 1.2,
    projectileType: 'laser',
    projectileColor: '#F59E0B',
    imageUrl: '/assets/images/hero_aureon_sun_king.svg',
    showdownImageUrl: '/assets/images/attack_meteor_1791483757694.jpg',
    description: 'Divinidad del Valle Esmeralda. Emana rayos celestiales que bendicen y duplican la potencia de todas las defensas aliadas.',
    showdownName: 'Corona del Sol',
    showdownDescription: 'Duplica temporalmente (+100% daño y cadencia de fuego) la fuerza de todas las tropas aliadas durante 8 segundos.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Corona del Sol I',
        cost: 0,
        damage: 75,
        range: 160,
        attackSpeed: 1.2,
        description: 'Rayos de plasma radiante y aura que duplica la fuerza de aliados al activar su habilidad.'
      },
      {
        name: 'Esplendor de Helios II',
        cost: 380,
        damage: 155,
        range: 185,
        attackSpeed: 1.6,
        description: 'Mayor radio de apoyo. La bendición solar ahora añade daño térmico sagrado.',
        bonusEffect: 'Alcance de bendición +25px'
      },
      {
        name: 'Apoteosis Solar III',
        cost: 720,
        damage: 320,
        range: 210,
        attackSpeed: 2.1,
        description: 'Luz perpetua: la Corona del Sol otorga escudos de calor que incineran a los enemigos en rango.',
        bonusEffect: 'Duración de Corona +3s (11 segundos)'
      }
    ],
    colorTheme: {
      primary: '#F59E0B',
      secondary: '#B45309',
      accent: '#FEF3C7',
      bg: 'rgba(245, 158, 11, 0.25)'
    }
  },

  // Arena 2: Cañón de Magma
  vulcanox_magma_lord: {
    id: 'vulcanox_magma_lord',
    name: 'Vulcanox, el Titán de Magma',
    title: 'Divinidad de la Arena 2 (Cañón de Magma)',
    role: 'area',
    rarity: 'divinidad',
    arenaUnlockLevel: 2,
    cost: 470,
    baseDamage: 95,
    baseRange: 155,
    baseAttackSpeed: 0.95,
    projectileType: 'fireball',
    projectileColor: '#DC2626',
    imageUrl: '/assets/images/hero_vulcanox_magma_lord.svg',
    showdownImageUrl: '/assets/images/attack_supernova_1791483748936.jpg',
    description: 'Divinidad del Cañón de Magma. Abre calderas volcánicas que desatan ríos de roca fundida calcinando a toda la horda enemiga.',
    showdownName: 'Erupción Cataclísmica',
    showdownDescription: 'Inunda todo el sendero con lava incandescente durante 7s: inflige 120 DPS de quemadura continua y ralentiza el paso enemigo un 50%.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Caldera de Fuego I',
        cost: 0,
        damage: 95,
        range: 155,
        attackSpeed: 0.95,
        description: 'Lanza bólidos de magma fundido que explotan en un radio de 70px.'
      },
      {
        name: 'Manto Ígneo II',
        cost: 390,
        damage: 190,
        range: 175,
        attackSpeed: 1.25,
        description: 'Las explosiones dejan charcos de fuego en el suelo que queman a los enemigos que transitan.',
        bonusEffect: 'Charco ígneo: 35 DPS residual'
      },
      {
        name: 'Geiser del Cataclismo III',
        cost: 750,
        damage: 390,
        range: 205,
        attackSpeed: 1.6,
        description: 'Detonaciones gigantescas que pulverizan el blindaje enemigo e ignoran el 60% de armadura.',
        bonusEffect: 'Erupción Cataclísmica +3s de duración'
      }
    ],
    colorTheme: {
      primary: '#EF4444',
      secondary: '#991B1B',
      accent: '#FEE2E2',
      bg: 'rgba(239, 68, 68, 0.25)'
    }
  },

  // Arena 3: Bastión Cibernético
  cygnus_prime_ai: {
    id: 'cygnus_prime_ai',
    name: 'Cygnus-0, la IA Suprema',
    title: 'Divinidad de la Arena 3 (Bastión Cibernético)',
    role: 'control',
    rarity: 'divinidad',
    arenaUnlockLevel: 3,
    cost: 480,
    baseDamage: 80,
    baseRange: 165,
    baseAttackSpeed: 1.3,
    projectileType: 'laser',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_cygnus_prime_ai.svg',
    showdownImageUrl: '/assets/images/attack_orbital_beam_1791483770365.jpg',
    description: 'Divinidad de la red tecnológica. Computa fallas en tiempo real y desata pulsos de interferencia electromagnética absoluta.',
    showdownName: 'Sobrecarga EMP Global',
    showdownDescription: 'Desconecta los sistemas motrices de toda la horda enemiga: paraliza a todos los enemigos por 4.5s y anula el 100% de su armadura durante 8s.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Protocolo Cero I',
        cost: 0,
        damage: 80,
        range: 165,
        attackSpeed: 1.3,
        description: 'Haces láser cuánticos guiados por inteligencia artificial de precisión.'
      },
      {
        name: 'Matriz Nanotáctica II',
        cost: 410,
        damage: 165,
        range: 190,
        attackSpeed: 1.7,
        description: 'Dispara pulsos duales de micro-nanobots que ralentizan el objetivo un 40%.',
        bonusEffect: 'Penetración electromagnética'
      },
      {
        name: 'Singularidad Sintética III',
        cost: 770,
        damage: 340,
        range: 220,
        attackSpeed: 2.2,
        description: 'El EMP global ahora genera sobrecargas en cadena que dañan a cada enemigo afectado.',
        bonusEffect: 'EMP causa 500 de daño de descarga'
      }
    ],
    colorTheme: {
      primary: '#0EA5E9',
      secondary: '#0369A1',
      accent: '#E0F2FE',
      bg: 'rgba(14, 165, 233, 0.25)'
    }
  },

  // Arena 4: Desierto de Cronos
  chronax_time_guardian: {
    id: 'chronax_time_guardian',
    name: 'Chronax, el Guardián del Tiempo',
    title: 'Divinidad de la Arena 4 (Desierto de Cronos)',
    role: 'control',
    rarity: 'divinidad',
    arenaUnlockLevel: 4,
    cost: 500,
    baseDamage: 70,
    baseRange: 165,
    baseAttackSpeed: 1.1,
    projectileType: 'beam',
    projectileColor: '#F59E0B',
    imageUrl: '/assets/images/hero_chronax_time_guardian.svg',
    showdownImageUrl: '/assets/images/attack_orbital_beam_1791483770365.jpg',
    description: 'Divinidad del Desierto de Cronos. Controla el flujo de la eternidad y rebobina las arenas del tiempo.',
    showdownName: 'Tiempo Cero',
    showdownDescription: 'Detiene por completo a todos los enemigos durante 4s y rebobina su posición 130px hacia atrás por el camino.',
    showdownCooldown: 28,
    tiers: [
      {
        name: 'Estasis Temporal I',
        cost: 0,
        damage: 70,
        range: 165,
        attackSpeed: 1.1,
        description: 'Dispara haces cronales y activa Tiempo Cero para frenar y retroceder hordas.'
      },
      {
        name: 'Distorsión de Éter II',
        cost: 420,
        damage: 150,
        range: 190,
        attackSpeed: 1.45,
        description: 'La detención temporal aumenta a 5 segundos y los disparos cronales reducen la armadura.',
        bonusEffect: 'Tiempo Cero +1.0s de duración'
      },
      {
        name: 'Reloj del Infinito III',
        cost: 780,
        damage: 310,
        range: 220,
        attackSpeed: 1.85,
        description: 'Crono-congelación absoluta que colapsa proyectiles en el tiempo, multiplicando impactos.',
        bonusEffect: 'Retroceso temporal aumentado a 200px'
      }
    ],
    colorTheme: {
      primary: '#D97706',
      secondary: '#B45309',
      accent: '#FEF3C7',
      bg: 'rgba(217, 119, 6, 0.25)'
    }
  },

  // Arena 5: Coliseo del Eclipse
  eclipse_divided: {
    id: 'eclipse_divided',
    name: 'Eclipse, la Dualidad Suprema',
    title: 'Divinidad de la Arena 5 (Coliseo del Eclipse)',
    role: 'multiplicador',
    rarity: 'divinidad',
    arenaUnlockLevel: 5,
    cost: 520,
    baseDamage: 85,
    baseRange: 155,
    baseAttackSpeed: 1.25,
    projectileType: 'resonance',
    projectileColor: '#A855F7',
    imageUrl: '/assets/images/hero_eclipse_divided.svg',
    showdownImageUrl: '/assets/images/boss_eclipse_1791483718360.jpg',
    description: 'Divinidad del Coliseo del Eclipse. Al colocarse genera una réplica gemela y colapsa la paradoja en una detonación bipolar.',
    showdownName: 'Paradoja Luminar',
    showdownDescription: 'Se divide creando un clon con el 75% de poder al colocarse, y al activar su Showdown desata un haz estelar bipolar que inflige 1100 de daño puro cósmico.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Paradoja Cuántica I',
        cost: 0,
        damage: 85,
        range: 155,
        attackSpeed: 1.25,
        description: 'Se duplica al colocarse (copia al 75%). Dispara rayos estelares de daño bipolar.'
      },
      {
        name: 'Singularidad Binaria II',
        cost: 440,
        damage: 175,
        range: 180,
        attackSpeed: 1.6,
        description: 'Tanto el original como la copia disparan a mayor velocidad y resuenan entre sí.',
        bonusEffect: 'Copia incrementa a 85% de potencia'
      },
      {
        name: 'Horizonte de Sucesos III',
        cost: 790,
        damage: 360,
        range: 205,
        attackSpeed: 2.0,
        description: 'La dualidad distorsiona el espacio: los impactos causan desintegración gravitatoria.',
        bonusEffect: 'Daño de Showdown aumentado a 1600'
      }
    ],
    colorTheme: {
      primary: '#A855F7',
      secondary: '#6B21A8',
      accent: '#F3E8FF',
      bg: 'rgba(168, 85, 247, 0.25)'
    }
  },

  // Arena 6: Cumbres Glaciares
  ymir_frost_sovereign: {
    id: 'ymir_frost_sovereign',
    name: 'Ymir, Soberano del Hielo Eterno',
    title: 'Divinidad de la Arena 6 (Cumbres Glaciares)',
    role: 'control',
    rarity: 'divinidad',
    arenaUnlockLevel: 6,
    cost: 490,
    baseDamage: 78,
    baseRange: 160,
    baseAttackSpeed: 1.05,
    projectileType: 'ice',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_ymir_frost_sovereign.svg',
    showdownImageUrl: '/assets/images/attack_orbital_beam_1791483770365.jpg',
    description: 'Divinidad de las Cumbres Glaciares. Controla la temperatura del cero absoluto congelando glaciares sobre el campo.',
    showdownName: 'Cero Absoluto',
    showdownDescription: 'Desata una ventisca ártica colosal que congela a TODOS los enemigos del mapa durante 2.4s y les inflige 750 de daño de escarcha perforante.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Cencellada Sagrada I',
        cost: 0,
        damage: 78,
        range: 160,
        attackSpeed: 1.05,
        description: 'Lanza témpanos de hielo sagrado con 45% de ralentización continua.'
      },
      {
        name: 'Muralla Glacial II',
        cost: 410,
        damage: 160,
        range: 185,
        attackSpeed: 1.4,
        description: 'Los témpanos estallan en fragmentos gélidos que alcanzan a 3 enemigos secundarios.',
        bonusEffect: 'Ralentización aumentada a 60%'
      },
      {
        name: 'Invierno Eterno III',
        cost: 770,
        damage: 330,
        range: 215,
        attackSpeed: 1.8,
        description: 'La ventisca quebraja las armaduras congeladas: los enemigos reciben +40% de daño mientras estén congelados.',
        bonusEffect: 'Cero Absoluto dura 3.2 segundos'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#0284C7',
      accent: '#E0F2FE',
      bg: 'rgba(56, 189, 248, 0.25)'
    }
  },

  // Arena 7: Metrópolis Neón
  kira_synthwave_empress: {
    id: 'kira_synthwave_empress',
    name: 'Kira, la Emperatriz Synthwave',
    title: 'Divinidad de la Arena 7 (Metrópolis Neón)',
    role: 'ataque',
    rarity: 'divinidad',
    arenaUnlockLevel: 7,
    cost: 510,
    baseDamage: 110,
    baseRange: 165,
    baseAttackSpeed: 1.5,
    projectileType: 'laser',
    projectileColor: '#EC4899',
    imageUrl: '/assets/images/hero_kira_synthwave_empress.svg',
    showdownImageUrl: '/assets/images/attack_meteor_1791483757694.jpg',
    description: 'Divinidad de la Metrópolis Neón. Canaliza energía cibernética ultravioleta que se refracta a velocidades lumínicas.',
    showdownName: 'Sobrecarga Neón',
    showdownDescription: 'Emite una ráfaga continua de 16 haces láser prismáticos que rebotan entre todos los enemigos con 950 de daño total fulminante.',
    showdownCooldown: 29,
    tiers: [
      {
        name: 'Rayo Ultravioleta I',
        cost: 0,
        damage: 110,
        range: 165,
        attackSpeed: 1.5,
        description: 'Disparos láser continuos de alta cadencia con refracción óptica.'
      },
      {
        name: 'Hiperfrecuencia II',
        cost: 430,
        damage: 210,
        range: 190,
        attackSpeed: 1.95,
        description: 'Los láseres rebotan automáticamente hacia 2 objetivos adyacentes adicionales.',
        bonusEffect: 'Cadencia de ataque +30%'
      },
      {
        name: 'Pulso Synthwave III',
        cost: 790,
        damage: 420,
        range: 220,
        attackSpeed: 2.5,
        description: 'Sobrecarga máxima: cada impacto crítico genera una onda expansiva de color neón.',
        bonusEffect: 'Daño de Sobrecarga Neón +500'
      }
    ],
    colorTheme: {
      primary: '#EC4899',
      secondary: '#BE185D',
      accent: '#FCE7F3',
      bg: 'rgba(236, 72, 153, 0.25)'
    }
  },

  // Arena 8: Abismo del Vacío
  nacar_abyssal_fish: {
    id: 'nacar_abyssal_fish',
    name: 'Nácar, el Pez Abisal',
    title: 'Divinidad de la Arena 8 (Abismo del Vacío)',
    role: 'invocador',
    rarity: 'divinidad',
    arenaUnlockLevel: 8,
    cost: 480,
    baseDamage: 90,
    baseRange: 150,
    baseAttackSpeed: 1.0,
    projectileType: 'ice',
    projectileColor: '#06B6D4',
    imageUrl: '/assets/images/hero_nacar_abyssal_fish.svg',
    showdownImageUrl: '/assets/images/attack_orbital_beam_1791483770365.jpg',
    description: 'Divinidad del Abismo del Vacío. Abre fisuras oceánicas submarinas que succionan hordas enteras hacia la oscuridad abisal.',
    showdownName: 'Vórtice Abisal',
    showdownDescription: 'Abre un remolino abisal gravitatorio en el camino que atrae a los enemigos hacia atrás e inflige 1000 de daño de marejada profunda.',
    showdownCooldown: 34,
    tiers: [
      {
        name: 'Portal Oceánico I',
        cost: 0,
        damage: 90,
        range: 150,
        attackSpeed: 1.0,
        description: 'Dispara dardos de coral líquido y genera vórtices abisales.'
      },
      {
        name: 'Tormenta de Fosa II',
        cost: 410,
        damage: 180,
        range: 175,
        attackSpeed: 1.35,
        description: 'Las marejadas abisales ralentizan un 50% y drenan la velocidad de los tanques.',
        bonusEffect: 'Vórtice Abisal succiona 180px'
      },
      {
        name: 'Maelstrom del Abismo III',
        cost: 760,
        damage: 370,
        range: 200,
        attackSpeed: 1.7,
        description: 'Invoca a la Serpiente Abisal ancestral que engulle oleadas completas desde las sombras.',
        bonusEffect: 'Daño de marejada aumentado a 1500'
      }
    ],
    colorTheme: {
      primary: '#06B6D4',
      secondary: '#0E7490',
      accent: '#CFFAFE',
      bg: 'rgba(6, 182, 212, 0.25)'
    }
  },

  // Arena 9: Santuario Celestial
  seraphina_dawn_archon: {
    id: 'seraphina_dawn_archon',
    name: 'Seraphina, la Serafín de la Aurora',
    title: 'Divinidad de la Arena 9 (Santuario Celestial)',
    role: 'soporte',
    rarity: 'divinidad',
    arenaUnlockLevel: 9,
    cost: 510,
    baseDamage: 100,
    baseRange: 170,
    baseAttackSpeed: 1.15,
    projectileType: 'laser',
    projectileColor: '#FBBF24',
    imageUrl: '/assets/images/hero_seraphina_dawn_archon.svg',
    showdownImageUrl: '/assets/images/attack_supernova_1791483748936.jpg',
    description: 'Divinidad del Santuario Celestial. Heraldo de la luz de la creación que restaura la vitalidad del Núcleo y castiga a los invasores.',
    showdownName: 'Luz Trascendente',
    showdownDescription: 'Convoca 5 pilares celestiales que fulminan a los enemigos con 1250 de daño sagrado y regenera +35 HP a la base del Núcleo.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Rayo Sagrado I',
        cost: 0,
        damage: 100,
        range: 170,
        attackSpeed: 1.15,
        description: 'Rayos de luz dorada purificadora con bendición al Núcleo.'
      },
      {
        name: 'Halo de la Aurora II',
        cost: 440,
        damage: 195,
        range: 195,
        attackSpeed: 1.5,
        description: 'Aura protectora que incrementa el blindaje de la base y daña a enemigos en proximidad.',
        bonusEffect: 'Regeneración al Núcleo +15 HP'
      },
      {
        name: 'Gracia Divina III',
        cost: 800,
        damage: 390,
        range: 225,
        attackSpeed: 1.9,
        description: 'Los pilares celestiales queman a los objetivos con fuego sagrado que ignora defensas.',
        bonusEffect: 'Pilares celestiales infligen 1800 de daño'
      }
    ],
    colorTheme: {
      primary: '#FBBF24',
      secondary: '#D97706',
      accent: '#FEF3C7',
      bg: 'rgba(251, 191, 36, 0.25)'
    }
  },

  // Arena 10: Ciudadela de las Tormentas
  thorin_storm_overlord: {
    id: 'thorin_storm_overlord',
    name: 'Thorin, Señor del Trueno Primigenio',
    title: 'Divinidad de la Arena 10 (Ciudadela de las Tormentas)',
    role: 'area',
    rarity: 'divinidad',
    arenaUnlockLevel: 10,
    cost: 520,
    baseDamage: 115,
    baseRange: 160,
    baseAttackSpeed: 1.2,
    projectileType: 'resonance',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_thorin_storm_overlord.svg',
    showdownImageUrl: '/assets/images/attack_meteor_1791483757694.jpg',
    description: 'Divinidad de la Ciudadela de las Tormentas. Forjador de relámpagos cataclísmicos que fulminan ejércitos enteros.',
    showdownName: 'Tormenta Cataclísmica',
    showdownDescription: 'Descarga 8 relámpagos masivos continuos sobre el mapa que electrocutan a todos los enemigos por 1350 de daño y los paralizan 4s.',
    showdownCooldown: 31,
    tiers: [
      {
        name: 'Relámpago Fénix I',
        cost: 0,
        damage: 115,
        range: 160,
        attackSpeed: 1.2,
        description: 'Descargas eléctricas de alto voltaje que encadenan entre 4 objetivos.'
      },
      {
        name: 'Ión Voltaico II',
        cost: 450,
        damage: 220,
        range: 185,
        attackSpeed: 1.55,
        description: 'La electricidad encadena hasta 7 objetivos y causa micro-aturdimientos de 0.5s.',
        bonusEffect: 'Encadenamiento ampliado a 7 objetivos'
      },
      {
        name: 'Ira de Mjolnir III',
        cost: 820,
        damage: 440,
        range: 215,
        attackSpeed: 1.95,
        description: 'La tormenta se vuelve perpetua: descargas atmosféricas automáticas cada 3 segundos.',
        bonusEffect: 'Tormenta Cataclísmica inflige 1900 de daño'
      }
    ],
    colorTheme: {
      primary: '#60A5FA',
      secondary: '#2563EB',
      accent: '#EFF6FF',
      bg: 'rgba(96, 165, 250, 0.25)'
    }
  },

  // Arena 11: Selva Primordial
  gaia_world_heart: {
    id: 'gaia_world_heart',
    name: 'Gaia, el Corazón Primordial',
    title: 'Divinidad de la Arena 11 (Selva Primordial)',
    role: 'economia',
    rarity: 'divinidad',
    arenaUnlockLevel: 11,
    cost: 490,
    baseDamage: 85,
    baseRange: 155,
    baseAttackSpeed: 1.1,
    projectileType: 'coin',
    projectileColor: '#22C55E',
    imageUrl: '/assets/images/hero_gaia_world_heart.svg',
    showdownImageUrl: '/assets/images/attack_orbital_beam_1791483770365.jpg',
    description: 'Divinidad de la Selva Primordial. El espíritu vegetal de la Tierra que atrapa a los invasores y transmuta su fuerza en oro puro.',
    showdownName: 'Ira de la Tierra',
    showdownDescription: 'Hace brotar raíces gigantescas que inmovilizan a todos los enemigos por 6s y extrae +180 de oro inmediatamente de la vitalidad enemiga.',
    showdownCooldown: 33,
    tiers: [
      {
        name: 'Brote Ancestral I',
        cost: 0,
        damage: 85,
        range: 155,
        attackSpeed: 1.1,
        ecoYield: 60,
        description: 'Dispara espinas de esmeralda y cosecha 60 de oro por ronda completada.'
      },
      {
        name: 'Manto de Selva II',
        cost: 430,
        damage: 170,
        range: 180,
        attackSpeed: 1.45,
        ecoYield: 110,
        description: 'Las raíces ralentizan a los enemigos un 50% de forma pasiva y el oro por ronda sube a 110.',
        bonusEffect: 'Cosecha económica +50 oro'
      },
      {
        name: 'Yggdrasil Despierto III',
        cost: 790,
        damage: 350,
        range: 210,
        attackSpeed: 1.85,
        ecoYield: 180,
        description: 'Las raíces aplastan a los tanques enemigos extrayendo gemas que otorgan 180 de oro por ronda.',
        bonusEffect: 'Extracción de Ira de la Tierra +280 oro'
      }
    ],
    colorTheme: {
      primary: '#22C55E',
      secondary: '#15803D',
      accent: '#DCFCE7',
      bg: 'rgba(34, 197, 94, 0.25)'
    }
  },

  // Arena 12: Fragua Infernal
  ignis_tartarus_colossus: {
    id: 'ignis_tartarus_colossus',
    name: 'Ignis, el Coloso del Tártaro',
    title: 'Divinidad de la Arena 12 (Fragua Infernal)',
    role: 'ataque',
    rarity: 'divinidad',
    arenaUnlockLevel: 12,
    cost: 530,
    baseDamage: 125,
    baseRange: 150,
    baseAttackSpeed: 0.9,
    projectileType: 'fireball',
    projectileColor: '#F97316',
    imageUrl: '/assets/images/hero_ignis_tartarus_colossus.svg',
    showdownImageUrl: '/assets/images/attack_supernova_1791483748936.jpg',
    description: 'Divinidad de la Fragua Infernal. Titán de acero fundido que derrite la armadura de los enemigos más colosales con calor estelar.',
    showdownName: 'Fundición del Tártaro',
    showdownDescription: 'Bombardeo de 8 meteoros de metal fundido que infligen 850 de daño cada uno y derriten la armadura de TODOS los enemigos a 0 durante 10 segundos.',
    showdownCooldown: 34,
    tiers: [
      {
        name: 'Martillo de Fuego I',
        cost: 0,
        damage: 125,
        range: 150,
        attackSpeed: 0.9,
        description: 'Lanza masas de hierro candente que desintegran blindajes pesados.'
      },
      {
        name: 'Yunque Ígneo II',
        cost: 460,
        damage: 250,
        range: 175,
        attackSpeed: 1.2,
        description: 'Cada disparo crea una onda de choque sísmica que funde 8 puntos de armadura al objetivo.',
        bonusEffect: 'Fundición pasiva de armadura'
      },
      {
        name: 'Fragua Primordial III',
        cost: 830,
        damage: 490,
        range: 200,
        attackSpeed: 1.55,
        description: 'Calor nuclear: los meteoros de la Fundición causan quemaduras de 100 DPS durante 8s.',
        bonusEffect: 'Fundición del Tártaro destruye 100% armadura'
      }
    ],
    colorTheme: {
      primary: '#F97316',
      secondary: '#C2410C',
      accent: '#FFEDD5',
      bg: 'rgba(249, 115, 22, 0.25)'
    }
  },

  // Arena 13: Nexo Astral
  astrea_constellation_weaver: {
    id: 'astrea_constellation_weaver',
    name: 'Astrea, Tejedora Astral',
    title: 'Divinidad de la Arena 13 (Nexo Astral)',
    role: 'especial',
    rarity: 'divinidad',
    arenaUnlockLevel: 13,
    cost: 540,
    baseDamage: 130,
    baseRange: 175,
    baseAttackSpeed: 1.2,
    projectileType: 'resonance',
    projectileColor: '#818CF8',
    imageUrl: '/assets/images/hero_astrea_constellation_weaver.svg',
    showdownImageUrl: '/assets/images/attack_supernova_1791483748936.jpg',
    description: 'Divinidad del Nexo Astral. Conecta los hilos del firmamento para desatar la detonación de estrellas supernovas.',
    showdownName: 'Supernova Estelar',
    showdownDescription: 'Alinea 3 constelaciones estelares que colapsan en una supernova gigante, infligiendo 1600 de daño cósmico a todos los enemigos en pantalla.',
    showdownCooldown: 33,
    tiers: [
      {
        name: 'Hilo de Galaxia I',
        cost: 0,
        damage: 130,
        range: 175,
        attackSpeed: 1.2,
        description: 'Haces astrales resonantes que atraviesan a todos los enemigos en su línea.'
      },
      {
        name: 'Zodíaco Cósmico II',
        cost: 470,
        damage: 260,
        range: 200,
        attackSpeed: 1.55,
        description: 'Los disparos estelares marcan a los objetivos para recibir un 35% más de daño de todas las fuentes.',
        bonusEffect: 'Marca astral de vulnerabilidad'
      },
      {
        name: 'Colapso de Supercúmulo III',
        cost: 850,
        damage: 510,
        range: 235,
        attackSpeed: 1.95,
        description: 'La Supernova Estelar reinicia los enfriamientos de ataque de todas las torres aliadas.',
        bonusEffect: 'Supernova causa 2200 de daño estelar'
      }
    ],
    colorTheme: {
      primary: '#818CF8',
      secondary: '#4338CA',
      accent: '#E0E7FF',
      bg: 'rgba(129, 140, 248, 0.25)'
    }
  },

  // Arena 14: Cripta de las Sombras
  thanatos_underworld_herald: {
    id: 'thanatos_underworld_herald',
    name: 'Thanatos, Heraldo de las Sombras',
    title: 'Divinidad de la Arena 14 (Cripta de las Sombras)',
    role: 'especial',
    rarity: 'divinidad',
    arenaUnlockLevel: 14,
    cost: 550,
    baseDamage: 140,
    baseRange: 170,
    baseAttackSpeed: 1.1,
    projectileType: 'resonance',
    projectileColor: '#6B21A8',
    imageUrl: '/assets/images/hero_thanatos_underworld_herald.svg',
    showdownImageUrl: '/assets/images/attack_orbital_beam_1791483770365.jpg',
    description: 'Divinidad de la Cripta de las Sombras. El segador supremo que ejecuta almas debilitadas e inflige daño espectral devastador.',
    showdownName: 'Cosecha de Almas',
    showdownDescription: 'Ejecuta de inmediato a cualquier enemigo no-jefe con menos del 35% de vida, y desgarra a los jefes con 1800 de daño de sombra pura.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Guadaña Espectral I',
        cost: 0,
        damage: 140,
        range: 170,
        attackSpeed: 1.1,
        description: 'Disparos oscuros que ignoran completamente la armadura y el escudo enemigo.'
      },
      {
        name: 'Velo de la Parca II',
        cost: 480,
        damage: 280,
        range: 195,
        attackSpeed: 1.45,
        description: 'Cada enemigo derrotado cerca libera un ánima espectral que daña a enemigos contiguos.',
        bonusEffect: 'Ignora 100% de armadura'
      },
      {
        name: 'Sentencia Inexorable III',
        cost: 870,
        damage: 540,
        range: 225,
        attackSpeed: 1.85,
        description: 'La Cosecha de Almas incrementa su umbral de ejecución instantánea al 45% de vida máxima.',
        bonusEffect: 'Umbral de ejecución sube a 45% HP'
      }
    ],
    colorTheme: {
      primary: '#9333EA',
      secondary: '#581C87',
      accent: '#F3E8FF',
      bg: 'rgba(147, 51, 234, 0.25)'
    }
  },

  // Arena 15: Trono del Valhalla
  fenix_golden_phoenix: {
    id: 'fenix_golden_phoenix',
    name: 'Fénix Áureo, el Renacido',
    title: 'Divinidad Suprema de la Arena 15 (Trono del Valhalla)',
    role: 'economia',
    rarity: 'divinidad',
    arenaUnlockLevel: 15,
    cost: 560,
    baseDamage: 120,
    baseRange: 165,
    baseAttackSpeed: 1.2,
    projectileType: 'fireball',
    projectileColor: '#EAB308',
    imageUrl: '/assets/images/hero_fenix_golden_phoenix.svg',
    showdownImageUrl: '/assets/images/attack_supernova_1791483748936.jpg',
    description: 'Divinidad Suprema del Trono del Valhalla. Señor del renacimiento celestial que otorga inmensas riquezas, restaura el Núcleo y desata el fuego eterno.',
    showdownName: 'Resurrección del Valhalla',
    showdownDescription: 'Otorga +260 de oro masivo (+500 en jefes), restaura +30 HP al Núcleo y desata una llamarada purificadora de 1500 de daño a toda la arena.',
    showdownCooldown: 34,
    tiers: [
      {
        name: 'Ceniza de Oro I',
        cost: 0,
        damage: 120,
        range: 165,
        attackSpeed: 1.2,
        ecoYield: 90,
        description: 'Dispara plumas ígneas de oro sagrado y genera un gran tributo al final de cada ronda.'
      },
      {
        name: 'Plumaje del Valhalla II',
        cost: 500,
        damage: 250,
        range: 190,
        attackSpeed: 1.6,
        ecoYield: 160,
        description: 'Rendimiento económico de 160 de oro por ronda (+300 en rondas de jefe) y plumas cósmicas.',
        bonusEffect: 'Economía divina duplicada'
      },
      {
        name: 'Gloria Eterna III',
        cost: 900,
        damage: 520,
        range: 220,
        attackSpeed: 2.0,
        ecoYield: 250,
        description: 'El Fénix en su máxima magnificencia: 250 de oro por ronda (+600 en jefes) y fuego divino.',
        bonusEffect: 'Resurrección del Valhalla restaura +45 HP'
      }
    ],
    colorTheme: {
      primary: '#EAB308',
      secondary: '#CA8A04',
      accent: '#FEF08A',
      bg: 'rgba(234, 179, 8, 0.25)'
    }
  }
,

  espadachin_hierro: {
    id: 'espadachin_hierro',
    name: 'Espadachín de Hierro',
    title: 'Guardián del Acero Templado',
    role: 'ataque',
    rarity: 'comun',
    cost: 95,
    baseDamage: 26,
    baseRange: 105,
    baseAttackSpeed: 1.6,
    projectileType: 'slash',
    projectileColor: '#CBD5E1',
    imageUrl: '/assets/images/espadachin_hierro_1791739910528.jpg',
    description: 'Guerrero cuerpo a cuerpo que ataca con golpes ultrarrápidos de acero templado a los enemigos en su radio cercano.',
    showdownName: 'Tempestad de Acero',
    showdownDescription: 'Desata un torbellino de 12 tajos giratorios que infligen 340 de daño a todos los enemigos circundantes.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Hoja de Acero I',
        cost: 0,
        damage: 26,
        range: 105,
        attackSpeed: 1.6,
        description: 'Tajos rápidos de espada con cadencia veloz.'
      },
      {
        name: 'Doble Filo II',
        cost: 100,
        damage: 52,
        range: 115,
        attackSpeed: 2.0,
        description: '+100% daño y mayor velocidad de corte táctico.',
        bonusEffect: 'Velocidad de ataque +25%'
      },
      {
        name: 'Filo Vorpal III',
        cost: 210,
        damage: 115,
        range: 125,
        attackSpeed: 2.6,
        description: 'Cortes fulgurantes continuos que penetran defensas pesadas.',
        bonusEffect: 'Ignora 30% armadura física'
      }
    ],
    colorTheme: {
      primary: '#94A3B8',
      secondary: '#475569',
      accent: '#F1F5F9',
      bg: 'rgba(148, 163, 184, 0.15)'
    }
  },

  arquera_elfica: {
    id: 'arquera_elfica',
    name: 'Arquera Élfica',
    title: 'Saetera de los Bosques Sagrados',
    role: 'ataque',
    rarity: 'comun',
    cost: 110,
    baseDamage: 28,
    baseRange: 190,
    baseAttackSpeed: 1.3,
    projectileType: 'arrow',
    projectileColor: '#10B981',
    imageUrl: '/assets/images/arquera_elfica_1791739921640.jpg',
    description: 'Tiradora silvana que dispara flechas a larguísima distancia capaces de perforar y dañar a varios enemigos alineados.',
    showdownName: 'Lluvia Esmeralda',
    showdownDescription: 'Lanza una andanada de flechas sagradas que acribillan a los enemigos infligiendo 380 de daño en línea recta.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Arco de Roble I',
        cost: 0,
        damage: 28,
        range: 190,
        attackSpeed: 1.3,
        description: 'Flechas certeras de largo alcance.'
      },
      {
        name: 'Cuerda de Viento II',
        cost: 115,
        damage: 58,
        range: 215,
        attackSpeed: 1.6,
        description: 'Alcance francotirador aumentado y mayor daño crítico.',
        bonusEffect: 'Alcance +15%'
      },
      {
        name: 'Disparo Silvano III',
        cost: 230,
        damage: 125,
        range: 240,
        attackSpeed: 2.0,
        description: 'Flechas imbuidas de esencia esmeralda que perforan hasta 3 objetivos en fila.',
        bonusEffect: 'Perforación de línea alineada'
      }
    ],
    colorTheme: {
      primary: '#10B981',
      secondary: '#047857',
      accent: '#D1FAE5',
      bg: 'rgba(16, 185, 129, 0.15)'
    }
  },

  artillero_pesado: {
    id: 'artillero_pesado',
    name: 'Artillero Pesado',
    title: 'Especialista en Fuego Continuo',
    role: 'ataque',
    rarity: 'especial',
    cost: 150,
    baseDamage: 18,
    baseRange: 155,
    baseAttackSpeed: 3.2,
    projectileType: 'multishot',
    projectileColor: '#F97316',
    imageUrl: '/assets/images/hero_artillero_pesado_1794952269605.jpg',
    description: 'Soldado de infantería pesada con una ametralladora rotativa que dispara ráfagas incesantes contra un único objetivo.',
    showdownName: 'Sobrecarga de Tambor',
    showdownDescription: 'Dispara 30 proyectiles perforantes en 2 segundos infligiendo 620 de daño concentrado al objetivo prioritario.',
    showdownCooldown: 34,
    tiers: [
      {
        name: 'Gatling Estándar I',
        cost: 0,
        damage: 18,
        range: 155,
        attackSpeed: 3.2,
        description: 'Ráfagas continuas de alta cadencia de fuego.'
      },
      {
        name: 'Tambor Blindado II',
        cost: 145,
        damage: 36,
        range: 170,
        attackSpeed: 4.0,
        description: 'Cadencia de fuego devastadora que derrite objetivos individuales.',
        bonusEffect: 'Cadencia extrema +25%'
      },
      {
        name: 'Vulcano Pesado III',
        cost: 290,
        damage: 80,
        range: 185,
        attackSpeed: 5.0,
        description: '5 disparos por segundo con munición perforante de alto calibre.',
        bonusEffect: 'Micro-aturdimiento balístico'
      }
    ],
    colorTheme: {
      primary: '#F59E0B',
      secondary: '#B45309',
      accent: '#FEF3C7',
      bg: 'rgba(245, 158, 11, 0.15)'
    }
  },

  mago_fuego: {
    id: 'mago_fuego',
    name: 'Archimago de Ignición Ígnea',
    title: 'Maestro de la Llama Piroclástica',
    role: 'area',
    rarity: 'rara',
    cost: 180,
    baseDamage: 48,
    baseRange: 135,
    baseAttackSpeed: 0.95,
    projectileType: 'fireball',
    projectileColor: '#EA580C',
    imageUrl: '/assets/images/mago_fuego_infernal_1791739954131.jpg',
    description: 'Canalizador del fuego arcano que lanza orbes concentrados de ignición que estallan en un área amplia dejando llamas vivas.',
    showdownName: 'Vórtice Piroclástico',
    showdownDescription: 'Crea una tormenta de fuego giratoria que calcina la zona infligiendo 520 de daño masivo y 35 DPS de quemadura continua.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Ignición Arcana I',
        cost: 0,
        damage: 48,
        range: 135,
        attackSpeed: 0.95,
        description: 'Bolas de fuego con 55px de radio explosivo.'
      },
      {
        name: 'Llamarada Espiral II',
        cost: 165,
        damage: 94,
        range: 150,
        attackSpeed: 1.2,
        description: 'Incrementa el área de impacto e inflige quemadura persistente.',
        bonusEffect: 'Quemadura 25 DPS por 4s'
      },
      {
        name: 'Infierno Concentrado III',
        cost: 330,
        damage: 195,
        range: 170,
        attackSpeed: 1.45,
        description: 'Detonaciones solapadas que desintegran enjambres enteros de agresores.',
        bonusEffect: 'Radio de área máximo + daño residual'
      }
    ],
    colorTheme: {
      primary: '#EA580C',
      secondary: '#C2410C',
      accent: '#FFEDD5',
      bg: 'rgba(234, 88, 12, 0.15)'
    }
  },

  francotirador_fantasma: {
    id: 'francotirador_fantasma',
    name: 'Francotirador Fantasma',
    title: 'Ojo Espectral de Élite',
    role: 'ataque',
    rarity: 'epica',
    cost: 240,
    baseDamage: 155,
    baseRange: 255,
    baseAttackSpeed: 0.45,
    projectileType: 'beam',
    projectileColor: '#A855F7',
    imageUrl: '/assets/images/hero_francotirador_fantasma_1794952268932.jpg',
    description: 'Tirador de largo alcance con visión dimensional. Elimina enemigos individuales de un disparo certero desde distancias enormes.',
    showdownName: 'Disparo Espectral Mortal',
    showdownDescription: 'Dispara un haz espectral de penetración absoluta que causa 1600 de daño letal al enemigo más adelantado.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Mira Etérea I',
        cost: 0,
        damage: 155,
        range: 255,
        attackSpeed: 0.45,
        description: 'Disparos espectrales instantáneos de tremendo impacto unitario.'
      },
      {
        name: 'Bala Fantasmal II',
        cost: 220,
        damage: 310,
        range: 280,
        attackSpeed: 0.55,
        description: 'Duplica el daño y extiende el alcance a casi la totalidad del mapa.',
        bonusEffect: 'Daño crítico letal +50%'
      },
      {
        name: 'Anulación de Alma III',
        cost: 450,
        damage: 680,
        range: 310,
        attackSpeed: 0.7,
        description: 'Disparos de fase pura que aniquilan tanques y blindados al instante.',
        bonusEffect: 'Elimina enemigos débiles de un golpe'
      }
    ],
    colorTheme: {
      primary: '#A855F7',
      secondary: '#7E22CE',
      accent: '#F3E8FF',
      bg: 'rgba(168, 85, 247, 0.15)'
    }
  },

  ingeniero_mecanico: {
    id: 'ingeniero_mecanico',
    name: 'Ingeniero Mecánico',
    title: 'Artífice de Micro-Centinelas',
    role: 'invocador',
    rarity: 'rara',
    cost: 175,
    baseDamage: 24,
    baseRange: 140,
    baseAttackSpeed: 1.6,
    projectileType: 'laser',
    projectileColor: '#06B6D4',
    imageUrl: '/assets/images/hero_ingeniero_mecanico_1794952270220.jpg',
    description: 'Especialista en robótica bélica que despliega torretas automáticas compactas que vigilan el perímetro y acribillan a los enemigos.',
    showdownName: 'Despliegue de Centinelas',
    showdownDescription: 'Despliega 3 micro-torretas gemelas de plasma que disparan automáticamente infligiendo 450 de daño sostenido.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Micro-Torreta I',
        cost: 0,
        damage: 24,
        range: 140,
        attackSpeed: 1.6,
        description: 'Láseres rápidos apoyados por mecanismos automatizados.'
      },
      {
        name: 'Matriz Sentry II',
        cost: 160,
        damage: 48,
        range: 155,
        attackSpeed: 2.0,
        description: 'Añade sensores de rastreo de alta cadencia para interceptar velocistas.',
        bonusEffect: 'Velocidad de ataque +25%'
      },
      {
        name: 'Sobrecarga Robótica III',
        cost: 320,
        damage: 105,
        range: 175,
        attackSpeed: 2.5,
        description: 'Láseres duales de hiperfrecuencia con munición electromagnética.',
        bonusEffect: 'Cadencia máxima y torreta gemela'
      }
    ],
    colorTheme: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#CFFAFE',
      bg: 'rgba(6, 182, 212, 0.15)'
    }
  },

  medico_combate: {
    id: 'medico_combate',
    name: 'Médico de Combate',
    title: 'Cirujano de Primera Línea',
    role: 'soporte',
    rarity: 'especial',
    cost: 140,
    baseDamage: 12,
    baseRange: 130,
    baseAttackSpeed: 1.1,
    projectileType: 'resonance',
    projectileColor: '#10B981',
    imageUrl: '/assets/images/hero_medico_combate_1794952270691.jpg',
    description: 'Especialista táctico que emite ondas bióticas para restaurar la integridad del Núcleo y acelerar la cadencia de las torres aliadas.',
    showdownName: 'Inyección de Adrenalina',
    showdownDescription: 'Restaura +25 de salud al Núcleo y potencia la velocidad de ataque de todas las torres aliadas un +60% por 6s.',
    showdownCooldown: 38,
    tiers: [
      {
        name: 'Dardo Biótico I',
        cost: 0,
        damage: 12,
        range: 130,
        attackSpeed: 1.1,
        description: 'Disparos bio-energéticos que apoyan la línea defensiva.'
      },
      {
        name: 'Aura Estimulante II',
        cost: 130,
        damage: 24,
        range: 145,
        attackSpeed: 1.35,
        description: 'Aumenta un +25% la cadencia de fuego de las torres adyacentes.',
        bonusEffect: 'Buff pasivo de velocidad aliada'
      },
      {
        name: 'Nanobots Médicos III',
        cost: 270,
        damage: 55,
        range: 165,
        attackSpeed: 1.65,
        description: 'Cura continuamente el Núcleo (+5 HP al final de cada oleada) y sobrecarga a aliados.',
        bonusEffect: 'Regeneración de Núcleo +5 HP'
      }
    ],
    colorTheme: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#A7F3D0',
      bg: 'rgba(16, 185, 129, 0.15)'
    }
  },

  ninja_sombrio: {
    id: 'ninja_sombrio',
    name: 'Ninja Sombrío',
    title: 'Asesino de los Shurikens Ocultos',
    role: 'ataque',
    rarity: 'rara',
    cost: 190,
    baseDamage: 38,
    baseRange: 130,
    baseAttackSpeed: 2.1,
    projectileType: 'slash',
    projectileColor: '#9333EA',
    imageUrl: '/assets/images/hero_ninja_sombrio_1794952270855.jpg',
    description: 'Guerrero furtivo que arroja shurikens de sombra a velocidad relámpago, ignorando el 75% del blindaje y resistencia de los enemigos.',
    showdownName: 'Shuriken Umbrío Gigante',
    showdownDescription: 'Lanza un shuriken colosal que atraviesa todo el camino causando 580 de daño puro sin reducción de armadura.',
    showdownCooldown: 34,
    tiers: [
      {
        name: 'Shuriken Veloz I',
        cost: 0,
        damage: 38,
        range: 130,
        attackSpeed: 2.1,
        description: 'Lanza estrellas ninja que perforan el blindaje enemigo.'
      },
      {
        name: 'Hojas Envenenadas II',
        cost: 175,
        damage: 76,
        range: 145,
        attackSpeed: 2.6,
        description: 'Ignora el 75% de la armadura enemiga con daño punzante agudo.',
        bonusEffect: 'Penetración de armadura 75%'
      },
      {
        name: 'Danza de las Sombras III',
        cost: 350,
        damage: 160,
        range: 160,
        attackSpeed: 3.2,
        description: 'Cadencia vertiginosa con shurikens dobles que liquidan enemigos acorazados.',
        bonusEffect: 'Cadencia extrema + daño puro'
      }
    ],
    colorTheme: {
      primary: '#6366F1',
      secondary: '#4F46E5',
      accent: '#E0E7FF',
      bg: 'rgba(99, 102, 241, 0.15)'
    }
  },

  caballero_cristal: {
    id: 'caballero_cristal',
    name: 'Caballero de Cristal',
    title: 'Baluarte Prisma Resonante',
    role: 'control',
    rarity: 'especial',
    cost: 160,
    baseDamage: 36,
    baseRange: 110,
    baseAttackSpeed: 1.2,
    projectileType: 'stun',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_caballero_cristal_1794952272013.jpg',
    description: 'Paladín con armadura de cuarzo reflectante que resiste las embestidas y corta a los enemigos con filos de cristal ralentizantes.',
    showdownName: 'Bastión Prisma',
    showdownDescription: 'Erige un escudo cristalino que inmoviliza a los enemigos cercanos por 3.5 segundos y refleja 350 de daño.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Hoja Prismática I',
        cost: 0,
        damage: 36,
        range: 110,
        attackSpeed: 1.2,
        description: 'Golpes cortantes que aplican esquirlas ralentizantes.'
      },
      {
        name: 'Coraza de Cuarzo II',
        cost: 150,
        damage: 72,
        range: 125,
        attackSpeed: 1.5,
        description: 'Ralentiza a los agresores un 45% y desvía proyectiles.',
        bonusEffect: 'Ralentización +45%'
      },
      {
        name: 'Filo de Diamante III',
        cost: 310,
        damage: 150,
        range: 140,
        attackSpeed: 1.85,
        description: 'Tajos de cuarzo refractario que fracturan las armaduras enemigas.',
        bonusEffect: 'Desgarro de armadura cristalino'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#0284C7',
      accent: '#BAE6FD',
      bg: 'rgba(56, 189, 248, 0.15)'
    }
  },

  lanzacohetes: {
    id: 'lanzacohetes',
    name: 'Lanzacohetes de Asedio',
    title: 'Artillero de Explosivos Pesados',
    role: 'area',
    rarity: 'comun',
    cost: 135,
    baseDamage: 44,
    baseRange: 160,
    baseAttackSpeed: 0.75,
    projectileType: 'missile',
    projectileColor: '#EF4444',
    imageUrl: '/assets/images/lanzacohetes_artillery_1791739933641.jpg',
    description: 'Artillero equipado con un lanzamisiles guiado que dispara proyectiles de alta fragmentación para aniquilar grupos densos de enemigos.',
    showdownName: 'Bombardeo de Salva',
    showdownDescription: 'Descarga 8 micromisiles en abanico sobre la ruta causando 460 de daño en un radio masivo.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Ojiva Fragmentaria I',
        cost: 0,
        damage: 44,
        range: 160,
        attackSpeed: 0.75,
        description: 'Misiles pesados con radio de explosión amplio.'
      },
      {
        name: 'Propulsor Mejorado II',
        cost: 130,
        damage: 88,
        range: 175,
        attackSpeed: 0.95,
        description: 'Radio de detonación expandido un +40% para barrer aglomeraciones.',
        bonusEffect: 'Radio de área +40%'
      },
      {
        name: 'Misil Termobárico III',
        cost: 260,
        damage: 185,
        range: 195,
        attackSpeed: 1.2,
        description: 'Impacto devastador que aturde a los sobrevivientes por 1.5s.',
        bonusEffect: 'Aturdimiento por onda de choque'
      }
    ],
    colorTheme: {
      primary: '#F97316',
      secondary: '#C2410C',
      accent: '#FFEDD5',
      bg: 'rgba(249, 115, 22, 0.15)'
    }
  },

  druida_bosque: {
    id: 'druida_bosque',
    name: 'Druida del Bosque',
    title: 'Guardiana de las Raíces Eternas',
    role: 'control',
    rarity: 'rara',
    cost: 170,
    baseDamage: 26,
    baseRange: 145,
    baseAttackSpeed: 1.15,
    projectileType: 'spore',
    projectileColor: '#22C55E',
    imageUrl: '/assets/images/hero_druida_bosque_1794952271421.jpg',
    description: 'Canalizadora de la fuerza silvestre que hace brotar zarzas del suelo, reduciendo la velocidad enemiga un 50% con cada impacto.',
    showdownName: 'Enredo Milenario',
    showdownDescription: 'Invoca raíces gigantescas en todo el camino que detienen completamente a los enemigos por 4.0 segundos.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Zarzas Silvestres I',
        cost: 0,
        damage: 26,
        range: 145,
        attackSpeed: 1.15,
        description: 'Raíces que ralentizan a los enemigos impactados un 40%.'
      },
      {
        name: 'Espinas Vivas II',
        cost: 155,
        damage: 52,
        range: 160,
        attackSpeed: 1.4,
        description: 'Ralentización aumentada al 60% que afecta en área pequeña.',
        bonusEffect: 'Ralentización 60% en área'
      },
      {
        name: 'Madre Selva III',
        cost: 320,
        damage: 115,
        range: 180,
        attackSpeed: 1.7,
        description: 'Brotes permanentes en el sendero que envenenan e inmovilizan invasores.',
        bonusEffect: 'Inmovilización residual'
      }
    ],
    colorTheme: {
      primary: '#22C55E',
      secondary: '#15803D',
      accent: '#DCFCE7',
      bg: 'rgba(34, 197, 94, 0.15)'
    }
  },

  invocador_golems: {
    id: 'invocador_golems',
    name: 'Invocador de Golems',
    title: 'Hierofante de la Roca Viviente',
    role: 'invocador',
    rarity: 'epica',
    cost: 235,
    baseDamage: 62,
    baseRange: 135,
    baseAttackSpeed: 0.9,
    projectileType: 'bullet',
    projectileColor: '#D97706',
    imageUrl: '/assets/images/hero_invocador_golems_1794952271501.jpg',
    description: 'Conjurador de la tierra que despierta entidades de granito que marchan directamente por el sendero combatiendo a los invasores cara a cara.',
    showdownName: 'Monolito Despertado',
    showdownDescription: 'Desciende un titán colosal de roca que aplasta el sendero causando 650 de daño y aturdiendo por 3.5s.',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Gólem de Granito I',
        cost: 0,
        damage: 62,
        range: 135,
        attackSpeed: 0.9,
        description: 'Proyectiles de roca sólida que impactan y ralentizan.'
      },
      {
        name: 'Titán de Obsidiana II',
        cost: 215,
        damage: 125,
        range: 150,
        attackSpeed: 1.15,
        description: 'Mayor contundencia que rompe escudos y aturde a atacantes.',
        bonusEffect: 'Golpe sísmico aturdidor'
      },
      {
        name: 'Coloso Ancestral III',
        cost: 440,
        damage: 260,
        range: 170,
        attackSpeed: 1.45,
        description: 'Impactos telúricos devastadores que resquebrajan el camino.',
        bonusEffect: 'Daño masivo de aplastamiento'
      }
    ],
    colorTheme: {
      primary: '#D97706',
      secondary: '#92400E',
      accent: '#FEF3C7',
      bg: 'rgba(217, 119, 6, 0.15)'
    }
  },

  alquimista_dorado: {
    id: 'alquimista_dorado',
    name: 'Alquimista Dorado de Midas',
    title: 'Transmutador del Oro Fino',
    role: 'economia',
    rarity: 'rara',
    cost: 165,
    baseDamage: 20,
    baseRange: 125,
    baseAttackSpeed: 1.1,
    projectileType: 'coin',
    projectileColor: '#EAB308',
    imageUrl: '/assets/images/hero_alquimista_dorado_1794952272005.jpg',
    description: 'Erudito de la transmutación que rocía a los enemigos con elíxir dorado; cada enemigo derrotado bajo este efecto otorga oro adicional.',
    showdownName: 'Toque de Midas',
    showdownDescription: 'Convierte a los enemigos cercanos en estatuas de oro macizo y otorga +280 monedas de oro al instante.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Elíxir Áureo I',
        cost: 0,
        damage: 20,
        range: 125,
        attackSpeed: 1.1,
        ecoYield: 55,
        description: 'Frascos de oro líquido que generan 55 de oro al finalizar cada ronda.'
      },
      {
        name: 'Transmutación II',
        cost: 150,
        damage: 40,
        range: 140,
        attackSpeed: 1.35,
        ecoYield: 110,
        description: 'Rendimiento incrementado a 110 oro por ronda y +2 oro por enemigo abatido.',
        bonusEffect: '+2 oro por cada baja lograda'
      },
      {
        name: 'Crisol de Midas III',
        cost: 310,
        damage: 85,
        range: 160,
        attackSpeed: 1.65,
        ecoYield: 180,
        description: 'Genera 180 de oro por ronda y desata monedas explosivas que enriquecen las arcas.',
        bonusEffect: 'Oro supremo: +180/ronda'
      }
    ],
    colorTheme: {
      primary: '#EAB308',
      secondary: '#CA8A04',
      accent: '#FEF08A',
      bg: 'rgba(234, 179, 8, 0.15)'
    }
  },

  canonero_pirata: {
    id: 'canonero_pirata',
    name: 'Cañonero Pirata',
    title: 'Bombardero de los Siete Mares',
    role: 'area',
    rarity: 'especial',
    cost: 165,
    baseDamage: 52,
    baseRange: 140,
    baseAttackSpeed: 0.8,
    projectileType: 'bullet',
    projectileColor: '#B45309',
    imageUrl: '/assets/images/hero_canonero_pirata_1794952273250.jpg',
    description: 'Artillero corsario con cañón naval. Sus balas pesadas de hierro golpean en área y empujan a los agresores hacia atrás en el sendero.',
    showdownName: 'Andanada de Babor',
    showdownDescription: 'Dispara una andanada completa de cañones que empuja a todos los enemigos 80px e inflige 480 de daño explosivo.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Bala de Hierro I',
        cost: 0,
        damage: 52,
        range: 140,
        attackSpeed: 0.8,
        description: 'Balas de cañón que causan daño en área y ligero retroceso.'
      },
      {
        name: 'Pólvora Fuerte II',
        cost: 155,
        damage: 105,
        range: 155,
        attackSpeed: 1.05,
        description: 'Empuja a los enemigos 40px hacia atrás con cada impacto directo.',
        bonusEffect: 'Empuje hacia atrás reforzado'
      },
      {
        name: 'Metralla Volcánica III',
        cost: 320,
        damage: 220,
        range: 175,
        attackSpeed: 1.3,
        description: 'Balas de cañón dobles que barren el área y retrasan el avance invasor.',
        bonusEffect: 'Daño masivo y retroceso continuo'
      }
    ],
    colorTheme: {
      primary: '#B45309',
      secondary: '#78350F',
      accent: '#FDE68A',
      bg: 'rgba(180, 83, 9, 0.15)'
    }
  },

  guardian_hielo: {
    id: 'guardian_hielo',
    name: 'Centinela Glacial de Permafrost',
    title: 'Baluarte de las Tundras Eternas',
    role: 'control',
    rarity: 'rara',
    cost: 185,
    baseDamage: 32,
    baseRange: 115,
    baseAttackSpeed: 1.25,
    projectileType: 'ice',
    projectileColor: '#06B6D4',
    imageUrl: '/assets/images/hero_guardian_hielo_1794952273305.jpg',
    description: 'Guardián blindado con escudo de escarcha viva que desata ondas gélidas a corta distancia, congelando a los enemigos en seco por periodos breves.',
    showdownName: 'Ola de Frío Polar',
    showdownDescription: 'Desata un viento glacial que congela por completo a todos los enemigos en su radio por 1.5s y causa 420 de daño.',
    showdownCooldown: 38,
    tiers: [
      {
        name: 'Escudo Escarchado I',
        cost: 0,
        damage: 32,
        range: 115,
        attackSpeed: 1.25,
        description: 'Ondas gélidas que ralentizan a los enemigos cercanos un 45%.'
      },
      {
        name: 'Golpe de Permafrost II',
        cost: 170,
        damage: 65,
        range: 130,
        attackSpeed: 1.55,
        description: 'Congela a los enemigos durante 0.55 segundos con cada impacto directo.',
        bonusEffect: 'Congelación breve de 0.55s'
      },
      {
        name: 'Glaciación Total III',
        cost: 340,
        damage: 140,
        range: 145,
        attackSpeed: 1.9,
        description: 'Crea una zona de permafrost perenne que mantiene a los agresores casi inmóviles.',
        bonusEffect: 'Ralentización máxima + congelación periódica'
      }
    ],
    colorTheme: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#E0F2FE',
      bg: 'rgba(6, 182, 212, 0.15)'
    }
  },

  samurai_carmesi: {
    id: 'samurai_carmesi',
    name: 'Kenshi Carmesí de la Hoja Sangrante',
    title: 'Maestro del Iaijutsu Carmesí',
    role: 'ataque',
    rarity: 'epica',
    cost: 220,
    baseDamage: 55,
    baseRange: 110,
    baseAttackSpeed: 1.9,
    projectileType: 'slash',
    projectileColor: '#EF4444',
    imageUrl: '/assets/images/hero_samurai_carmesi_1794952274141.jpg',
    description: 'Espadachín de honor cuya katana sangrienta acelera y duplica su daño tras cada impacto consecutivo sobre el mismo grupo de agresores.',
    showdownName: 'Corte del Dragón Carmesí',
    showdownDescription: 'Desenvaina su hoja sagrada en un parpadeo, infligiendo 850 de daño letal y sangrado prolongado.',
    showdownCooldown: 38,
    tiers: [
      {
        name: 'Katana Sangrienta I',
        cost: 0,
        damage: 55,
        range: 110,
        attackSpeed: 1.9,
        description: 'Cortes certeros con incremento de daño consecutivo.'
      },
      {
        name: 'Combo Carmesí II',
        cost: 200,
        damage: 115,
        range: 125,
        attackSpeed: 2.4,
        description: 'Cada golpe consecutivo aumenta un +15% el daño y la cadencia.',
        bonusEffect: 'Acumulación de combo sangriento'
      },
      {
        name: 'Maestría Iaijutsu III',
        cost: 420,
        damage: 250,
        range: 140,
        attackSpeed: 3.0,
        description: 'Tajos a la velocidad de la luz que desmiembran oleadas enemigas con sangrado crítico.',
        bonusEffect: 'Cadencia 3.0/s y sangrado letal'
      }
    ],
    colorTheme: {
      primary: '#DC2626',
      secondary: '#991B1B',
      accent: '#FEE2E2',
      bg: 'rgba(220, 38, 38, 0.15)'
    }
  },

  cientifico_nuclear: {
    id: 'cientifico_nuclear',
    name: 'Científico Nuclear',
    title: 'Erudito de la Fisión Radiactiva',
    role: 'area',
    rarity: 'epica',
    cost: 245,
    baseDamage: 62,
    baseRange: 155,
    baseAttackSpeed: 1.0,
    projectileType: 'laser',
    projectileColor: '#22C55E',
    imageUrl: '/assets/images/cientifico_nuclear_rad_1791734640351.jpg',
    description: 'Científico con cañón de isótopos inestables. Lanza proyectiles nucleares que contaminan el suelo con radiación corrosiva de 30 DPS durante varios segundos.',
    showdownName: 'Colapso de Fisión',
    showdownDescription: 'Detona un núcleo de plutonio que irradia toda la zona, infligiendo 560 de daño y 65 DPS tóxico por 6s.',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Isótopo Verde I',
        cost: 0,
        damage: 62,
        range: 155,
        attackSpeed: 1.0,
        description: 'Disparos radiactivos que dejan charcos tóxicos en el sendero.'
      },
      {
        name: 'Fusión Corrosiva II',
        cost: 225,
        damage: 125,
        range: 170,
        attackSpeed: 1.3,
        description: 'La radiación dura 5s y anula la armadura de los enemigos afectados.',
        bonusEffect: 'Desintegración de blindaje'
      },
      {
        name: 'Masa Crítica III',
        cost: 460,
        damage: 270,
        range: 190,
        attackSpeed: 1.6,
        description: 'Detonaciones atómicas continuas que funden la vanguardia enemiga con radiación masiva.',
        bonusEffect: 'Radiación 65 DPS de área masiva'
      }
    ],
    colorTheme: {
      primary: '#22C55E',
      secondary: '#16A34A',
      accent: '#DCFCE7',
      bg: 'rgba(34, 197, 94, 0.15)'
    }
  },

  robot_centinela: {
    id: 'robot_centinela',
    name: 'Autómata Centinela TX-9',
    title: 'Unidad Táctica de Patrulla Láser',
    role: 'ataque',
    rarity: 'comun',
    cost: 105,
    baseDamage: 20,
    baseRange: 140,
    baseAttackSpeed: 1.8,
    projectileType: 'multishot',
    projectileColor: '#06B6D4',
    imageUrl: '/assets/images/hero_robot_centinela_1794952274448.jpg',
    description: 'Ciborg de vigilancia táctica con radar omnidireccional. Escanea automáticamente el sendero y dispara ráfagas de láser concentrado de alta precisión.',
    showdownName: 'Modo Tormenta Balística',
    showdownDescription: 'Sobrecarga sus turbinas para disparar al triple de velocidad durante 6 segundos causando 420 de daño total.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Láser de Patrulla I',
        cost: 0,
        damage: 20,
        range: 140,
        attackSpeed: 1.8,
        description: 'Pulsos rápidos de láser con adquisición automática.'
      },
      {
        name: 'Matriz Fotónica II',
        cost: 110,
        damage: 42,
        range: 155,
        attackSpeed: 2.3,
        description: 'Mayor cadencia y alcance gracias a miras infrarrojas avanzadas.',
        bonusEffect: 'Velocidad de ataque +25%'
      },
      {
        name: 'Hiperimpulso TX III',
        cost: 225,
        damage: 92,
        range: 175,
        attackSpeed: 2.9,
        description: 'Cargas de fotones concentrados con perforación de energía.',
        bonusEffect: 'Láser perforante de alta cadencia'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#0284C7',
      accent: '#E0F2FE',
      bg: 'rgba(56, 189, 248, 0.15)'
    }
  },

  chaman_electrico: {
    id: 'chaman_electrico',
    name: 'Chamán del Trueno Ancestral',
    title: 'Invocador de la Furia Voltaica',
    role: 'control',
    rarity: 'rara',
    cost: 180,
    baseDamage: 36,
    baseRange: 145,
    baseAttackSpeed: 1.3,
    projectileType: 'lightning',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/chaman_electrico_storm_1791739966404.jpg',
    description: 'Guardián místico que canaliza los relámpagos ancestrales; sus rayos saltan entre hasta 4 enemigos cercanos encadenando descargas y aturdimiento.',
    showdownName: 'Cólera del Rayo Esmeralda',
    showdownDescription: 'Desata una tormenta eléctrica masiva que electrocuta a todas las oleadas causando 540 de daño y salto voltaico.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Rayo Ancestral I',
        cost: 0,
        damage: 36,
        range: 145,
        attackSpeed: 1.3,
        description: 'Relámpagos que saltan entre 3 enemigos cercanos.'
      },
      {
        name: 'Arco Voltaico II',
        cost: 165,
        damage: 74,
        range: 160,
        attackSpeed: 1.6,
        description: 'Los rayos saltan a 5 objetivos y provocan micro-aturdimiento.',
        bonusEffect: 'Cadena de 5 saltos voltaicos'
      },
      {
        name: 'Sobrecarga Primordial III',
        cost: 330,
        damage: 160,
        range: 180,
        attackSpeed: 2.0,
        description: 'Tempestad continua que paraliza grupos enteros de agresores.',
        bonusEffect: 'Parálisis eléctrica + daño amplificado'
      }
    ],
    colorTheme: {
      primary: '#60A5FA',
      secondary: '#2563EB',
      accent: '#DBEAFE',
      bg: 'rgba(96, 165, 250, 0.15)'
    }
  },

  asesina_carmesi: {
    id: 'asesina_carmesi',
    name: 'Cazadora Sangrienta de Titanes',
    title: 'Ejecutora de Monstruos y Colosos',
    role: 'ataque',
    rarity: 'epica',
    cost: 230,
    baseDamage: 85,
    baseRange: 125,
    baseAttackSpeed: 1.4,
    projectileType: 'slash',
    projectileColor: '#F43F5E',
    imageUrl: '/assets/images/hero_asesina_carmesi_1794952275239.jpg',
    description: 'Cazadora letal armada con dagas ensangrentadas. Inflige un 75% más de daño contra enemigos con más de 1000 de vida y jefes.',
    showdownName: 'Sentencia Ejecutora',
    showdownDescription: 'Asesta un tajo demoledor al jefe o enemigo más fuerte en pantalla causando 1100 de daño letal directo.',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Dagas de Caza I',
        cost: 0,
        damage: 85,
        range: 125,
        attackSpeed: 1.4,
        description: 'Ataques rápidos diseñados para desgarrar blindaje pesado.'
      },
      {
        name: 'Caza-Colosos II',
        cost: 210,
        damage: 175,
        range: 140,
        attackSpeed: 1.8,
        description: 'Daño aumentado un +100% contra objetivos con gran vida o jefes.',
        bonusEffect: '+100% daño bonus vs tanques/jefes'
      },
      {
        name: 'Ejecución Sangrienta III',
        cost: 430,
        damage: 380,
        range: 155,
        attackSpeed: 2.3,
        description: 'Golpes letales que ejecutan de inmediato a enemigos debilitados.',
        bonusEffect: 'Ejecución letal a bajo porcentaje de vida'
      }
    ],
    colorTheme: {
      primary: '#991B1B',
      secondary: '#7F1D1D',
      accent: '#FEE2E2',
      bg: 'rgba(153, 27, 27, 0.15)'
    }
  },

  dragon_mecanico: {
    id: 'dragon_mecanico',
    name: 'Draco-Mecha Aserio',
    title: 'Dragón Titánico Ciber-Ígneo',
    role: 'area',
    rarity: 'legendaria',
    cost: 300,
    baseDamage: 88,
    baseRange: 140,
    baseAttackSpeed: 1.5,
    projectileType: 'fireball',
    projectileColor: '#EA580C',
    imageUrl: '/assets/images/dragon_mecanico_cyborg_1791734622163.jpg',
    description: 'Coloso cibernético alado que exhala un cono de napalm líquido a 2000 grados Celsius, calcinando a decenas de enemigos a la vez.',
    showdownName: 'Infierno Termonuclear',
    showdownDescription: 'Desata un bombardeo aéreo de napalm a lo largo del mapa, infligiendo 880 de daño e incinerando por 6s.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Turbina de Napalm I',
        cost: 0,
        damage: 88,
        range: 140,
        attackSpeed: 1.5,
        description: 'Llamaradas ciber-ígneas en abanico que dañan múltiples objetivos.'
      },
      {
        name: 'Alas de Titanio II',
        cost: 280,
        damage: 185,
        range: 160,
        attackSpeed: 1.9,
        description: 'Amplía el cono de fuego e inflige quemadura continua de 40 DPS.',
        bonusEffect: 'Quemadura 40 DPS por 5s'
      },
      {
        name: 'Apocalipsis Mecha III',
        cost: 560,
        damage: 390,
        range: 180,
        attackSpeed: 2.4,
        description: 'Fuego termonuclear implacable que disuelve armaduras y aniquila hordas completas.',
        bonusEffect: 'Napalm de plasma pesado continuo'
      }
    ],
    colorTheme: {
      primary: '#EA580C',
      secondary: '#9A3412',
      accent: '#FFEDD5',
      bg: 'rgba(234, 88, 12, 0.15)'
    }
  },

  rey_slimes: {
    id: 'rey_slimes',
    name: 'Rey de los Slimes',
    title: 'Soberano de la Gelatina Ácida',
    role: 'invocador',
    rarity: 'rara',
    cost: 175,
    baseDamage: 30,
    baseRange: 135,
    baseAttackSpeed: 1.2,
    projectileType: 'coin',
    projectileColor: '#10B981',
    imageUrl: '/assets/images/rey_slimes_acid_1791734630935.jpg',
    description: 'Monarca gelatinoso y viscoso que genera enjambres de pequeños slimes que persiguen a los atacantes en el camino y detonan al contacto.',
    showdownName: 'Inundación Gelatinosa',
    showdownDescription: 'Genera 8 mini-slimes ácidos en el camino que ralentizan a los enemigos un 60% y causan 480 de daño de disolución.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Gotas Ácidas I',
        cost: 0,
        damage: 30,
        range: 135,
        attackSpeed: 1.2,
        description: 'Lanza orbes de baba corrosiva que dañan y ralentizan.'
      },
      {
        name: 'Enjambre Pegajoso II',
        cost: 160,
        damage: 62,
        range: 150,
        attackSpeed: 1.55,
        description: 'Los slimes engendrados persiguen objetivos y explotan en 60px.',
        bonusEffect: 'Slimes rastreadores explosivos'
      },
      {
        name: 'Corona Gelatinosa III',
        cost: 325,
        damage: 135,
        range: 170,
        attackSpeed: 1.95,
        description: 'Reacción en cadena ácida: cada slime que estalla genera dos mini-slimes.',
        bonusEffect: 'División celular infinita'
      }
    ],
    colorTheme: {
      primary: '#10B981',
      secondary: '#059669',
      accent: '#D1FAE5',
      bg: 'rgba(16, 185, 129, 0.15)'
    }
  },

  domador_bestias: {
    id: 'domador_bestias',
    name: 'Domador de Bestias',
    title: 'Líder de la Manada Alfa',
    role: 'invocador',
    rarity: 'especial',
    cost: 155,
    baseDamage: 34,
    baseRange: 130,
    baseAttackSpeed: 1.1,
    projectileType: 'bullet',
    projectileColor: '#B45309',
    imageUrl: '/assets/images/hero_domador_bestias_1794952275346.jpg',
    description: 'Rastreador de los yermos que suelta feroces bestias de caza que corren por el sendero arrollando y mordiendo a los invasores a su paso.',
    showdownName: 'Carga de la Manada',
    showdownDescription: 'Libera una estampida de bestias colmilludas que recorren el camino causando 500 de daño de embestida.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Fiera de Caza I',
        cost: 0,
        damage: 34,
        range: 130,
        attackSpeed: 1.1,
        description: 'Envía bestias veloces a morder y desestabilizar la fila enemiga.'
      },
      {
        name: 'Manada Alfa II',
        cost: 145,
        damage: 70,
        range: 145,
        attackSpeed: 1.4,
        description: 'Bestias acorazadas que golpean a múltiples enemigos en el camino.',
        bonusEffect: 'Ataque penetrante de manada'
      },
      {
        name: 'Espíritu de la Selva III',
        cost: 300,
        damage: 150,
        range: 160,
        attackSpeed: 1.8,
        description: 'Bestias míticas gigantes que aturden a los invasores con poderosas mordidas.',
        bonusEffect: 'Aturdimiento por embestida salvaje'
      }
    ],
    colorTheme: {
      primary: '#B45309',
      secondary: '#78350F',
      accent: '#FEF3C7',
      bg: 'rgba(180, 83, 9, 0.15)'
    }
  },

  sacerdote_solar: {
    id: 'sacerdote_solar',
    name: 'Sacerdote Solar',
    title: 'Luminaria del Sol Naciente',
    role: 'soporte',
    rarity: 'rara',
    cost: 165,
    baseDamage: 15,
    baseRange: 135,
    baseAttackSpeed: 1.0,
    projectileType: 'resonance',
    projectileColor: '#FBBF24',
    imageUrl: '/assets/images/hero_sacerdote_solar_1794952276073.jpg',
    description: 'Sacerdote que bendice a las torres defensivas adyacentes, otorgándoles un halo solar que amplifica su alcance un +25% y su velocidad de ataque.',
    showdownName: 'Bendición del Astro Rey',
    showdownDescription: 'Canaliza la gracia solar sobre todas las defensas del mapa, otorgándoles +100% cadencia de fuego por 7s.',
    showdownCooldown: 38,
    tiers: [
      {
        name: 'Halo Solar I',
        cost: 0,
        damage: 15,
        range: 135,
        attackSpeed: 1.0,
        description: 'Aura que potencia ligeramente a las torres circundantes.'
      },
      {
        name: 'Fervor Sagrado II',
        cost: 155,
        damage: 30,
        range: 155,
        attackSpeed: 1.25,
        description: 'Aura solar: +30% alcance y +20% daño a las torres aliadas cercanas.',
        bonusEffect: 'Buff de alcance +30%'
      },
      {
        name: 'Resplandor Supremo III',
        cost: 310,
        damage: 70,
        range: 175,
        attackSpeed: 1.55,
        description: 'Todas las torres en su radio disparan con cadencia duplicada y rayos solares añadidos.',
        bonusEffect: 'Cadencia aliada duplicada'
      }
    ],
    colorTheme: {
      primary: '#FBBF24',
      secondary: '#D97706',
      accent: '#FEF9C3',
      bg: 'rgba(251, 191, 36, 0.15)'
    }
  },

  viajero_tiempo: {
    id: 'viajero_tiempo',
    name: 'Viajero del Tiempo',
    title: 'Crononauta del Multiverso',
    role: 'control',
    rarity: 'legendaria',
    cost: 275,
    baseDamage: 42,
    baseRange: 150,
    baseAttackSpeed: 1.2,
    projectileType: 'portal',
    projectileColor: '#818CF8',
    imageUrl: '/assets/images/hero_viajero_tiempo_1794952275720.jpg',
    description: 'Científico cronotemporal que proyecta campos de estasis temporal; los enemigos dentro del área sufren una ralentización masiva del 70%.',
    showdownName: 'Colapso del Tiempo',
    showdownDescription: 'Detiene por completo el tiempo para todos los invasores durante 4.5 segundos y los desplaza 100px hacia atrás.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Campo Cuántico I',
        cost: 0,
        damage: 42,
        range: 150,
        attackSpeed: 1.2,
        description: 'Haces de taquiones que distorsionan el flujo del tiempo.'
      },
      {
        name: 'Cronostasis II',
        cost: 250,
        damage: 90,
        range: 170,
        attackSpeed: 1.55,
        description: 'Zona de ralentización temporal del 65% permanente en su alcance.',
        bonusEffect: 'Ralentización masiva 65%'
      },
      {
        name: 'Paradoja Temporal III',
        cost: 510,
        damage: 195,
        range: 190,
        attackSpeed: 2.0,
        description: 'Los enemigos retroceden periódicamente en su avance y quedan congelados.',
        bonusEffect: 'Retroceso temporal y congelación'
      }
    ],
    colorTheme: {
      primary: '#818CF8',
      secondary: '#4F46E5',
      accent: '#E0E7FF',
      bg: 'rgba(129, 140, 248, 0.15)'
    }
  },

  reina_espinas: {
    id: 'reina_espinas',
    name: 'Reina de las Espinas',
    title: 'Soberana de la Selva Venenosa',
    role: 'area',
    rarity: 'especial',
    cost: 150,
    baseDamage: 32,
    baseRange: 125,
    baseAttackSpeed: 1.3,
    projectileType: 'spore',
    projectileColor: '#16A34A',
    imageUrl: '/assets/images/hero_reina_espinas_1794952276730.jpg',
    description: 'Reina de la flora carnívora que siembra trampas de zarzas ponzoñosas en los caminos que perforan y envenenan a quienes las pisen.',
    showdownName: 'Jardín Mortífero',
    showdownDescription: 'Brotan zarzas letales a lo largo de 200px del sendero que infligen 520 de daño y 40 DPS de veneno a los agresores.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Espinas Ponzoñosas I',
        cost: 0,
        damage: 32,
        range: 125,
        attackSpeed: 1.3,
        description: 'Lanza espinas en abanico que cubren los pasos del enemigo.'
      },
      {
        name: 'Zarzal Venenoso II',
        cost: 140,
        damage: 66,
        range: 140,
        attackSpeed: 1.65,
        description: 'Aplica toxina paralizante que reduce velocidad y causa daño residual.',
        bonusEffect: 'Veneno de 25 DPS por 4s'
      },
      {
        name: 'Corona de Espinas III',
        cost: 290,
        damage: 145,
        range: 160,
        attackSpeed: 2.1,
        description: 'Trampas mortíferas permanentes que laceran a todos los invasores.',
        bonusEffect: 'Laceración de camino permanente'
      }
    ],
    colorTheme: {
      primary: '#15803D',
      secondary: '#166534',
      accent: '#DCFCE7',
      bg: 'rgba(21, 128, 61, 0.15)'
    }
  },

  golem_magma: {
    id: 'golem_magma',
    name: 'Gólem de Magma Sísmico',
    title: 'Coloso de la Falla Volcánica',
    role: 'area',
    rarity: 'epica',
    cost: 240,
    baseDamage: 70,
    baseRange: 115,
    baseAttackSpeed: 0.85,
    projectileType: 'shockwave',
    projectileColor: '#EA580C',
    imageUrl: '/assets/images/hero_golem_magma_1794952277031.jpg',
    description: 'Coloso forjado en el núcleo terrestre que golpea el suelo con puños de basalto, creando ondas de choque volcánicas que revientan a todos los enemigos cercanos.',
    showdownName: 'Fisura Volcánica',
    showdownDescription: 'Abre una grieta sísmica en la tierra que aturde a todos los enemigos cercanos por 3.5s e inflige 680 de daño magmático.',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Puño de Basalto I',
        cost: 0,
        damage: 70,
        range: 115,
        attackSpeed: 0.85,
        description: 'Impactos telúricos que desatan explosiones sísmicas en área.'
      },
      {
        name: 'Onda Sísmica II',
        cost: 220,
        damage: 145,
        range: 130,
        attackSpeed: 1.1,
        description: 'Onda expansiva ampliada con fuego ardiente residual de 30 DPS.',
        bonusEffect: 'Onda sísmica + quemadura'
      },
      {
        name: 'Cataclismo Volcánico III',
        cost: 450,
        damage: 310,
        range: 150,
        attackSpeed: 1.4,
        description: 'Terremotos magmáticos que pulverizan la armadura de los colosos enemigos.',
        bonusEffect: 'Aplastamiento sísmico total'
      }
    ],
    colorTheme: {
      primary: '#B91C1C',
      secondary: '#991B1B',
      accent: '#FEE2E2',
      bg: 'rgba(185, 28, 28, 0.15)'
    }
  },

  hacker_cibernetico: {
    id: 'hacker_cibernetico',
    name: 'Hacker Cibernético',
    title: 'Especialista en Infiltración PEM',
    role: 'control',
    rarity: 'rara',
    cost: 185,
    baseDamage: 28,
    baseRange: 145,
    baseAttackSpeed: 1.4,
    projectileType: 'laser',
    projectileColor: '#06B6D4',
    imageUrl: '/assets/images/hero_hacker_cibernetico_1794952278222.jpg',
    description: 'Especialista en ciberguerra táctica. Emite pulsos que desactivan habilidades especiales enemigas, cancelan auras elementales y reducen a cero la armadura.',
    showdownName: 'Pulso Electromagnético Total (PEM)',
    showdownDescription: 'Emite un pulso PEM que desconecta las defensas enemigas, neutraliza escudos y reduce la armadura un 100% por 6s.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Inyección de Glitch I',
        cost: 0,
        damage: 28,
        range: 145,
        attackSpeed: 1.4,
        description: 'Pulsos de código corrupto que debilitan los sistemas del invasor.'
      },
      {
        name: 'Sobrecarga de Protocolo II',
        cost: 170,
        damage: 58,
        range: 160,
        attackSpeed: 1.75,
        description: 'Desactiva las auras elementales enemigas (Fuego, Cyber, Vacío) al impactar.',
        bonusEffect: 'Supresión de auras enemigas'
      },
      {
        name: 'Ciberataque Total III',
        cost: 345,
        damage: 125,
        range: 180,
        attackSpeed: 2.2,
        description: 'PEM continuo que elimina permanentemente el 100% de la armadura del objetivo.',
        bonusEffect: 'Anula 100% de armadura enemiga'
      }
    ],
    colorTheme: {
      primary: '#06B6D4',
      secondary: '#0891B2',
      accent: '#CFFAFE',
      bg: 'rgba(6, 182, 212, 0.15)'
    }
  },

  titan_tormenta: {
    id: 'titan_tormenta',
    name: 'Titán de la Tormenta Primordial',
    title: 'Soberano del Rayo Celeste',
    role: 'area',
    rarity: 'legendaria',
    cost: 310,
    baseDamage: 92,
    baseRange: 165,
    baseAttackSpeed: 1.25,
    projectileType: 'lightning',
    projectileColor: '#60A5FA',
    imageUrl: '/assets/images/titan_tormenta_storm_1791734611229.jpg',
    description: 'Guerrero titánico cargado con la energía del huracán primordial. Descarga rayos continuos sobre grupos enteros de agresores con furia desatada.',
    showdownName: 'Cataclismo del Relámpago',
    showdownDescription: 'Convoca 10 relámpagos devastadores del cielo que caen sobre los grupos enemigos causando 920 de daño total.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Trueno Ancestral I',
        cost: 0,
        damage: 92,
        range: 165,
        attackSpeed: 1.25,
        description: 'Rayos celestes continuos que golpean en área con gran daño.'
      },
      {
        name: 'Mjolnir Tempestuoso II',
        cost: 290,
        damage: 190,
        range: 185,
        attackSpeed: 1.6,
        description: 'La tormenta eléctrica encadena descargas continuas a todos los enemigos en rango.',
        bonusEffect: 'Cadena de rayos de hiper-voltaje'
      },
      {
        name: 'Ira del Olimpo III',
        cost: 580,
        damage: 410,
        range: 210,
        attackSpeed: 2.0,
        description: 'Huracán colosal que fulmina blindajes y paraliza oleadas enteras de invasores.',
        bonusEffect: 'Daño masivo de tormenta continua'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#0284C7',
      accent: '#E0F2FE',
      bg: 'rgba(56, 189, 248, 0.15)'
    }
  },

  kronos_dimensiones: {
    id: 'kronos_dimensiones',
    name: 'Kronos, Señor de las Dimensiones',
    title: 'Emperador del Tiempo y el Espacio',
    role: 'multiplicador',
    rarity: 'divinidad',
    arenaUnlockLevel: 15,
    cost: 450,
    baseDamage: 160,
    baseRange: 195,
    baseAttackSpeed: 1.4,
    projectileType: 'portal',
    projectileColor: '#C084FC',
    imageUrl: '/assets/images/kronos_dimensional_lord_1791734602131.jpg',
    description: 'Divinidad cósmica que gobierna todas las realidades. Abre portales dimensionales de atracción gravitatoria y dispara haces que pulverizan a múltiples objetivos a la vez.',
    showdownName: 'Fractura Multidimensional',
    showdownDescription: 'Abre una fisura cósmica que atrae a todos los invasores hacia el centro, infligiendo 1500 de daño masivo y congelando la realidad.',
    showdownCooldown: 45,
    tiers: [
      {
        name: 'Haz del Continuo I',
        cost: 0,
        damage: 160,
        range: 195,
        attackSpeed: 1.4,
        description: 'Haces cósmicos dimensionales que impactan instantáneamente.'
      },
      {
        name: 'Vórtice Interdimensional II',
        cost: 400,
        damage: 340,
        range: 220,
        attackSpeed: 1.8,
        description: 'Dispara haces múltiples a 4 enemigos simultáneamente con ralentización cuántica.',
        bonusEffect: 'Multidisparo a 4 objetivos'
      },
      {
        name: 'Colapso de Realidades III',
        cost: 850,
        damage: 750,
        range: 250,
        attackSpeed: 2.3,
        description: 'Desintegra la materia de los invasores con radiación dimensional pura.',
        bonusEffect: 'Poder divino: singularidad desintegradora'
      }
    ],
    colorTheme: {
      primary: '#C084FC',
      secondary: '#9333EA',
      accent: '#F3E8FF',
      bg: 'rgba(192, 132, 252, 0.25)'
    }
  },

  // =========================================================================
  // EXPANSIÓN 100 CARTAS (+33 NUEVAS CARTAS DISTRIBUIDAS EN TODAS LAS RAREZAS)
  // =========================================================================

  // --- 8 NUEVAS CARTAS COMUNES ---
  centinela_acero: {
    id: 'centinela_acero',
    name: 'Centinela de Acero',
    title: 'Guardia de Bastión',
    role: 'ataque',
    rarity: 'comun',
    cost: 85,
    baseDamage: 18,
    baseRange: 130,
    baseAttackSpeed: 1.35,
    projectileType: 'bullet',
    projectileColor: '#94A3B8',
    imageUrl: '/assets/images/hero_centinela_acero.svg',
    description: 'Soldado blindado con rifle balístico estándar. Defensa confiable y económica para contener las primeras oleadas.',
    showdownName: 'Ráfaga de Bastión',
    showdownDescription: 'Descarga fuego concentrado sobre todos los invasores en línea, infligiendo 240 de daño balístico.',
    showdownCooldown: 28,
    tiers: [
      {
        name: 'Carabina de Acero I',
        cost: 0,
        damage: 18,
        range: 130,
        attackSpeed: 1.35,
        description: 'Disparos rápidos y precisos de calibre táctico.'
      },
      {
        name: 'Munición Perforante II',
        cost: 95,
        damage: 36,
        range: 150,
        attackSpeed: 1.65,
        description: 'Aumenta la cadencia y perfora armaduras ligeras.',
        bonusEffect: 'Alcance táctico extendido'
      },
      {
        name: 'Torreta Reforzada III',
        cost: 210,
        damage: 78,
        range: 170,
        attackSpeed: 2.1,
        description: 'Ráfaga continua de alta velocidad para frenar hordas.',
        bonusEffect: 'Cadencia balística máxima'
      }
    ],
    colorTheme: {
      primary: '#94A3B8',
      secondary: '#475569',
      accent: '#E2E8F0',
      bg: 'rgba(148, 163, 184, 0.16)'
    }
  },

  ballestero_real: {
    id: 'ballestero_real',
    name: 'Ballestero Real',
    title: 'Tirador de Ciudadela',
    role: 'ataque',
    rarity: 'comun',
    cost: 95,
    baseDamage: 26,
    baseRange: 165,
    baseAttackSpeed: 1.0,
    projectileType: 'arrow',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_ballestero_real.svg',
    description: 'Armado con ballesta pesada de largo alcance que abate enemigos antes de que alcancen los muros.',
    showdownName: 'Andanada Real',
    showdownDescription: 'Dispara una lluvia de virotes pesados que infligen 290 de daño a todos los enemigos.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Virote Templado I',
        cost: 0,
        damage: 26,
        range: 165,
        attackSpeed: 1.0,
        description: 'Largo alcance con impacto sólido por disparo.'
      },
      {
        name: 'Ballesta Doble II',
        cost: 110,
        damage: 52,
        range: 185,
        attackSpeed: 1.25,
        description: 'Doble tensión mecánica con virotes de acero rúnico.',
        bonusEffect: 'Alcance ampliado a 185px'
      },
      {
        name: 'Virote Imperial III',
        cost: 230,
        damage: 110,
        range: 210,
        attackSpeed: 1.55,
        description: 'Disparos perforantes de altísima velocidad terminal.',
        bonusEffect: 'Precisión de francotirador'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#1D4ED8',
      accent: '#DBEAFE',
      bg: 'rgba(56, 189, 248, 0.15)'
    }
  },

  granadero_tactico: {
    id: 'granadero_tactico',
    name: 'Granadero Táctico',
    title: 'Especialista de Mortero',
    role: 'area',
    rarity: 'comun',
    cost: 110,
    baseDamage: 30,
    baseRange: 120,
    baseAttackSpeed: 0.85,
    projectileType: 'fireball',
    projectileColor: '#F97316',
    imageUrl: '/assets/images/hero_granadero_tactico.svg',
    description: 'Lanza granadas de fragmentación que explotan en área contra grupos compactos de exploradores y enjambres.',
    showdownName: 'Barrido de Fragmentación',
    showdownDescription: 'Detona cargas tácticas en todo el camino causando 310 de daño explosivo en área.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Granada MK-I',
        cost: 0,
        damage: 30,
        range: 120,
        attackSpeed: 0.85,
        description: 'Explosión de fragmentación en radio de 45px.'
      },
      {
        name: 'Carga Termita II',
        cost: 125,
        damage: 62,
        range: 135,
        attackSpeed: 1.05,
        description: 'Mayor radio de detonación y daño ígneo.',
        bonusEffect: 'Radio explosivo ampliado'
      },
      {
        name: 'Mortero de Asedio III',
        cost: 255,
        damage: 130,
        range: 155,
        attackSpeed: 1.3,
        description: 'Bombardeo continuo capaz de limpiar enjambres completos.',
        bonusEffect: 'Onda expansiva devastadora'
      }
    ],
    colorTheme: {
      primary: '#F97316',
      secondary: '#9A3412',
      accent: '#FFEDD5',
      bg: 'rgba(249, 115, 22, 0.15)'
    }
  },

  vigia_bosque: {
    id: 'vigia_bosque',
    name: 'Vigía del Bosque',
    title: 'Explorador de Esporas',
    role: 'control',
    rarity: 'comun',
    cost: 90,
    baseDamage: 15,
    baseRange: 145,
    baseAttackSpeed: 1.2,
    projectileType: 'spore',
    projectileColor: '#22C55E',
    imageUrl: '/assets/images/hero_vigia_bosque.svg',
    description: 'Arquero silvestre cuyas flechas impregnadas de savia ralentizan a los invasores velozmente.',
    showdownName: 'Niebla de Savia',
    showdownDescription: 'Envuelve el sendero en esporas relajantes que ralentizan un 55% a todos los enemigos por 4s e infligen 210 de daño.',
    showdownCooldown: 30,
    tiers: [
      {
        name: 'Dardos de Savia I',
        cost: 0,
        damage: 15,
        range: 145,
        attackSpeed: 1.2,
        description: 'Aplica ralentización leve al impactar.'
      },
      {
        name: 'Resina Pegajosa II',
        cost: 105,
        damage: 30,
        range: 165,
        attackSpeed: 1.45,
        description: 'Reduce la velocidad enemiga con mayor duración.',
        bonusEffect: 'Control de velocidad mejorado'
      },
      {
        name: 'Flechas de Enredadera III',
        cost: 220,
        damage: 66,
        range: 185,
        attackSpeed: 1.75,
        description: 'Disparos rápidos que frenan el avance de tanques.',
        bonusEffect: 'Frenado táctico continuo'
      }
    ],
    colorTheme: {
      primary: '#22C55E',
      secondary: '#15803D',
      accent: '#DCFCE7',
      bg: 'rgba(34, 197, 94, 0.15)'
    }
  },

  mercader_rondas: {
    id: 'mercader_rondas',
    name: 'Mercader de Rondas',
    title: 'Proveedor de Suministros',
    role: 'economia',
    rarity: 'comun',
    cost: 105,
    baseDamage: 10,
    baseRange: 110,
    baseAttackSpeed: 0.9,
    projectileType: 'coin',
    projectileColor: '#FACC15',
    imageUrl: '/assets/images/hero_mercader_rondas.svg',
    description: 'Unidad económica accesible que financia tu defensa aportando monedas de oro al final de cada ronda.',
    showdownName: 'Dividendo Táctico',
    showdownDescription: 'Entrega +70 monedas de oro de inmediato para desplegar refuerzos y aturde levemente 0.6s.',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Caravana I',
        cost: 0,
        damage: 10,
        range: 110,
        attackSpeed: 0.9,
        ecoYield: 12,
        description: 'Genera +12 oro garantizado al superar cada oleada.'
      },
      {
        name: 'Ruta Comercial II',
        cost: 115,
        damage: 20,
        range: 125,
        attackSpeed: 1.1,
        ecoYield: 24,
        description: 'Genera +24 oro por ronda.',
        bonusEffect: '+24 Oro por oleada'
      },
      {
        name: 'Gremio de Abasto III',
        cost: 235,
        damage: 42,
        range: 140,
        attackSpeed: 1.35,
        ecoYield: 40,
        description: 'Genera +40 oro por ronda para sostener mejoras tempranas.',
        bonusEffect: '+40 Oro por oleada'
      }
    ],
    colorTheme: {
      primary: '#FACC15',
      secondary: '#A16207',
      accent: '#FEF9C3',
      bg: 'rgba(250, 204, 21, 0.15)'
    }
  },

  soldado_plasma: {
    id: 'soldado_plasma',
    name: 'Soldado de Plasma',
    title: 'Infantería Fotónica',
    role: 'ataque',
    rarity: 'comun',
    cost: 100,
    baseDamage: 20,
    baseRange: 140,
    baseAttackSpeed: 1.5,
    projectileType: 'laser',
    projectileColor: '#06B6D4',
    imageUrl: '/assets/images/hero_soldado_plasma.svg',
    description: 'Infante futurista equipado con fusil de plasma rápido, ideal contra exploradores veloces.',
    showdownName: 'Descarga Fotónica',
    showdownDescription: 'Emite un barrido láser por toda la arena que inflige 260 de daño energético.',
    showdownCooldown: 29,
    tiers: [
      {
        name: 'Fusil Pulso I',
        cost: 0,
        damage: 20,
        range: 140,
        attackSpeed: 1.5,
        description: 'Disparos láser estables de alta velocidad.'
      },
      {
        name: 'Condensador Azul II',
        cost: 110,
        damage: 40,
        range: 160,
        attackSpeed: 1.85,
        description: 'Acelera el disparo un 25% y duplica la potencia.',
        bonusEffect: 'Cadencia láser acelerada'
      },
      {
        name: 'Rifle Hiperión III',
        cost: 240,
        damage: 88,
        range: 180,
        attackSpeed: 2.3,
        description: 'Fuego continuo de plasma ionizado.',
        bonusEffect: 'Alta penetración energética'
      }
    ],
    colorTheme: {
      primary: '#06B6D4',
      secondary: '#0E7490',
      accent: '#CFFAFE',
      bg: 'rgba(6, 182, 212, 0.15)'
    }
  },

  zapador_mina: {
    id: 'zapador_mina',
    name: 'Zapador de Minas',
    title: 'Ingeniero Explosivo',
    role: 'area',
    rarity: 'comun',
    cost: 105,
    baseDamage: 34,
    baseRange: 115,
    baseAttackSpeed: 0.8,
    projectileType: 'missile',
    projectileColor: '#F59E0B',
    imageUrl: '/assets/images/hero_zapador_mina.svg',
    description: 'Lanza cargas sísmicas de corto alcance que hacen tambalear a grupos blindados.',
    showdownName: 'Campo Minado',
    showdownDescription: 'Detona cargas subterráneas bajo todos los enemigos causando 300 de daño y empujándolos 55px atrás.',
    showdownCooldown: 33,
    tiers: [
      {
        name: 'Mina Táctica I',
        cost: 0,
        damage: 34,
        range: 115,
        attackSpeed: 0.8,
        description: 'Cargas de alto impacto en área.'
      },
      {
        name: 'Detonador Sísmico II',
        cost: 120,
        damage: 68,
        range: 130,
        attackSpeed: 1.0,
        description: 'Incrementa el daño explosivo contra tanques.',
        bonusEffect: 'Daño demoledor en área'
      },
      {
        name: 'Cinturón Demoledor III',
        cost: 245,
        damage: 140,
        range: 150,
        attackSpeed: 1.25,
        description: 'Explosiones masivas que abren brechas en armaduras.',
        bonusEffect: 'Demolición de blindados'
      }
    ],
    colorTheme: {
      primary: '#F59E0B',
      secondary: '#B45309',
      accent: '#FEF3C7',
      bg: 'rgba(245, 158, 11, 0.15)'
    }
  },

  escudero_luz: {
    id: 'escudero_luz',
    name: 'Escudero de Luz',
    title: 'Novicio del Alba',
    role: 'soporte',
    rarity: 'comun',
    cost: 95,
    baseDamage: 16,
    baseRange: 135,
    baseAttackSpeed: 1.2,
    projectileType: 'resonance',
    projectileColor: '#FDE047',
    imageUrl: '/assets/images/hero_escudero_luz.svg',
    description: 'Joven templario que proyecta pulsos de ánimo luminoso para reforzar la cadencia de torres aliadas.',
    showdownName: 'Fulgor del Alba',
    showdownDescription: 'Restaura +1 vida al Núcleo y aumenta +35% la cadencia de todas las torres por 5s.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Sello Luminoso I',
        cost: 0,
        damage: 16,
        range: 135,
        attackSpeed: 1.2,
        description: 'Ondas radiantes que atacan y alientan la línea.'
      },
      {
        name: 'Estandarte Blanco II',
        cost: 110,
        damage: 34,
        range: 155,
        attackSpeed: 1.45,
        description: 'Refuerza la resonancia táctica en mayor radio.',
        bonusEffect: 'Aura de apoyo luminoso'
      },
      {
        name: 'Guardia de la Aurora III',
        cost: 230,
        damage: 74,
        range: 175,
        attackSpeed: 1.8,
        description: 'Emite destellos continuos de gran alcance.',
        bonusEffect: 'Impulso de escuadra constante'
      }
    ],
    colorTheme: {
      primary: '#FDE047',
      secondary: '#CA8A04',
      accent: '#FEF9C3',
      bg: 'rgba(253, 224, 71, 0.15)'
    }
  },

  // --- 7 NUEVAS CARTAS ESPECIALES ---
  lancero_solar: {
    id: 'lancero_solar',
    name: 'Lancero Solar',
    title: 'Vanguardia Radiante',
    role: 'ataque',
    rarity: 'especial',
    cost: 145,
    baseDamage: 38,
    baseRange: 155,
    baseAttackSpeed: 1.25,
    projectileType: 'beam',
    projectileColor: '#FB923C',
    imageUrl: '/assets/images/hero_lancero_solar.svg',
    description: 'Atraviesa formaciones enteras con lanzas de plasma dorado de alta penetración.',
    showdownName: 'Lanza del Cenit',
    showdownDescription: 'Proyecta una lanza solar gigantesca que inflige 460 de daño a todos los enemigos y aplica quemadura.',
    showdownCooldown: 34,
    tiers: [
      {
        name: 'Pica Incandescente I',
        cost: 0,
        damage: 38,
        range: 155,
        attackSpeed: 1.25,
        description: 'Rayos dorados de alcance sólido.'
      },
      {
        name: 'Asta del Sol II',
        cost: 140,
        damage: 76,
        range: 175,
        attackSpeed: 1.55,
        description: 'Perforación térmica contra enemigos acorazados.',
        bonusEffect: 'Daño radiante duplicado'
      },
      {
        name: 'Justa Astral III',
        cost: 290,
        damage: 158,
        range: 200,
        attackSpeed: 1.9,
        description: 'Descargas fulminantes que calcinan blindajes pesados.',
        bonusEffect: 'Penetración solar total'
      }
    ],
    colorTheme: {
      primary: '#FB923C',
      secondary: '#C2410C',
      accent: '#FFEDD5',
      bg: 'rgba(251, 146, 60, 0.16)'
    }
  },

  cazador_sombras: {
    id: 'cazador_sombras',
    name: 'Cazador de Sombras',
    title: 'Acechador Nocturno',
    role: 'ataque',
    rarity: 'especial',
    cost: 150,
    baseDamage: 46,
    baseRange: 175,
    baseAttackSpeed: 1.1,
    projectileType: 'slash',
    projectileColor: '#8B5CF6',
    imageUrl: '/assets/images/hero_cazador_sombras.svg',
    description: 'Ejecuta cortes sombríos a distancia, priorizando objetivos con heridas o alta velocidad.',
    showdownName: 'Emboscada Umbría',
    showdownDescription: 'Asesta golpes letales desde las sombras: 650 de daño al enemigo más cercano al Núcleo y 300 a los demás.',
    showdownCooldown: 32,
    tiers: [
      {
        name: 'Hoja Nocturna I',
        cost: 0,
        damage: 46,
        range: 175,
        attackSpeed: 1.1,
        description: 'Tajos veloces de energía sombría.'
      },
      {
        name: 'Cacería Silenciosa II',
        cost: 145,
        damage: 94,
        range: 195,
        attackSpeed: 1.35,
        description: 'Mayor alcance y precisión letal.',
        bonusEffect: 'Críticos contra objetivos rápidos'
      },
      {
        name: 'Verdugo del Crepúsculo III',
        cost: 300,
        damage: 195,
        range: 220,
        attackSpeed: 1.65,
        description: 'Cortes abisales que aniquilan exploradores y élites.',
        bonusEffect: 'Letalidad máxima nocturna'
      }
    ],
    colorTheme: {
      primary: '#8B5CF6',
      secondary: '#5B21B6',
      accent: '#EDE9FE',
      bg: 'rgba(139, 92, 246, 0.16)'
    }
  },

  pirotecnico_brasa: {
    id: 'pirotecnico_brasa',
    name: 'Pirotécnico de Brasa',
    title: 'Artificiero Ígneo',
    role: 'area',
    rarity: 'especial',
    cost: 160,
    baseDamage: 42,
    baseRange: 130,
    baseAttackSpeed: 0.95,
    projectileType: 'fireball',
    projectileColor: '#EF4444',
    imageUrl: '/assets/images/hero_pirotecnico_brasa.svg',
    description: 'Dispara bengalas pirotécnicas que incendian a varios invasores simultáneamente.',
    showdownName: 'Fuegos de Guerra',
    showdownDescription: 'Lluvia de bengalas que causa 430 de daño y quema con 35 DPS durante 5s.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Bengala Viva I',
        cost: 0,
        damage: 42,
        range: 130,
        attackSpeed: 0.95,
        description: 'Detonación incendiaria en área.'
      },
      {
        name: 'Pólvora Carmesí II',
        cost: 150,
        damage: 85,
        range: 145,
        attackSpeed: 1.15,
        description: 'Quemaduras más intensas y mayor explosión.',
        bonusEffect: 'Quemadura continua en área'
      },
      {
        name: 'Festival Infernal III',
        cost: 310,
        damage: 175,
        range: 165,
        attackSpeed: 1.4,
        description: 'Bombardeo pirotécnico incesante.',
        bonusEffect: 'Ignición masiva en zona'
      }
    ],
    colorTheme: {
      primary: '#EF4444',
      secondary: '#991B1B',
      accent: '#FEE2E2',
      bg: 'rgba(239, 68, 68, 0.16)'
    }
  },

  torre_tesla_v2: {
    id: 'torre_tesla_v2',
    name: 'Torre Tesla V2',
    title: 'Generador Voltaico',
    role: 'control',
    rarity: 'especial',
    cost: 165,
    baseDamage: 28,
    baseRange: 140,
    baseAttackSpeed: 1.35,
    projectileType: 'lightning',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_torre_tesla_v2.svg',
    description: 'Bobina de alto voltaje que electrocuta objetivos cercanos con arcos paralizantes breves.',
    showdownName: 'Sobrecarga Tesla',
    showdownDescription: 'Descarga eléctrica global de 390 de daño que aturde brevemente por 0.8s (0.4s a jefes).',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Bobina MK-II',
        cost: 0,
        damage: 28,
        range: 140,
        attackSpeed: 1.35,
        description: 'Arcos voltaicos rápidos con micro-ralentización.'
      },
      {
        name: 'Condensador Arco II',
        cost: 155,
        damage: 58,
        range: 160,
        attackSpeed: 1.65,
        description: 'Potencia el choque eléctrico y su alcance.',
        bonusEffect: 'Descarga disruptiva'
      },
      {
        name: 'Núcleo Tormenta III',
        cost: 320,
        damage: 122,
        range: 185,
        attackSpeed: 2.0,
        description: 'Corriente continua de ultra tensión.',
        bonusEffect: 'Control voltaico superior'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#0369A1',
      accent: '#E0F2FE',
      bg: 'rgba(56, 189, 248, 0.16)'
    }
  },

  botanico_veneno: {
    id: 'botanico_veneno',
    name: 'Botánico de Veneno',
    title: 'Sabio de Esporas Ácidas',
    role: 'control',
    rarity: 'especial',
    cost: 145,
    baseDamage: 24,
    baseRange: 145,
    baseAttackSpeed: 1.2,
    projectileType: 'spore',
    projectileColor: '#84CC16',
    imageUrl: '/assets/images/hero_botanico_veneno.svg',
    description: 'Esparce toxinas corrosivas que debilitan el avance enemigo y corroen escudos lentamente.',
    showdownName: 'Floración Tóxica',
    showdownDescription: 'Libera esporas venenosas en todo el mapa: 330 de daño y 35 DPS de veneno por 6s.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Espora Ácida I',
        cost: 0,
        damage: 24,
        range: 145,
        attackSpeed: 1.2,
        description: 'Toxinas que dañan y frenan.'
      },
      {
        name: 'Nube Corrosiva II',
        cost: 140,
        damage: 48,
        range: 165,
        attackSpeed: 1.45,
        description: 'Aumenta la persistencia del veneno en ruta.',
        bonusEffect: 'Corrosión continua'
      },
      {
        name: 'Jardín Letal III',
        cost: 295,
        damage: 105,
        range: 185,
        attackSpeed: 1.75,
        description: 'Esporas concentradas altamente destructivas.',
        bonusEffect: 'Toxina de máximo espectro'
      }
    ],
    colorTheme: {
      primary: '#84CC16',
      secondary: '#4D7C0F',
      accent: '#ECFCCB',
      bg: 'rgba(132, 204, 22, 0.16)'
    }
  },

  banquero_crono: {
    id: 'banquero_crono',
    name: 'Banquero Crono',
    title: 'Custodio del Tesoro Temporal',
    role: 'economia',
    rarity: 'especial',
    cost: 140,
    baseDamage: 16,
    baseRange: 120,
    baseAttackSpeed: 1.0,
    projectileType: 'coin',
    projectileColor: '#FBBF24',
    imageUrl: '/assets/images/hero_banquero_crono.svg',
    description: 'Invierte energía temporal para multiplicar tus ganancias de oro al finalizar cada oleada.',
    showdownName: 'Bóveda Temporal',
    showdownDescription: 'Libera +135 monedas de oro inmediato y ralentiza un 35% a los enemigos por 3s.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Interés Crono I',
        cost: 0,
        damage: 16,
        range: 120,
        attackSpeed: 1.0,
        ecoYield: 20,
        description: 'Genera +20 oro garantizado al terminar cada ronda.'
      },
      {
        name: 'Reserva Dorada II',
        cost: 145,
        damage: 34,
        range: 135,
        attackSpeed: 1.25,
        ecoYield: 36,
        description: 'Genera +36 oro por ronda y refuerza su disparo áureo.',
        bonusEffect: '+36 Oro/ronda'
      },
      {
        name: 'Banco Imperial III',
        cost: 290,
        damage: 72,
        range: 155,
        attackSpeed: 1.55,
        ecoYield: 58,
        description: 'Genera +58 oro por ronda para financiar defensas legendarias.',
        bonusEffect: '+58 Oro/ronda garantizado'
      }
    ],
    colorTheme: {
      primary: '#FBBF24',
      secondary: '#B45309',
      accent: '#FEF3C7',
      bg: 'rgba(251, 191, 36, 0.16)'
    }
  },

  artillero_doble: {
    id: 'artillero_doble',
    name: 'Artillero Doble',
    title: 'Cañonero Gemelo',
    role: 'ataque',
    rarity: 'especial',
    cost: 155,
    baseDamage: 24,
    baseRange: 145,
    baseAttackSpeed: 1.9,
    projectileType: 'multishot',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_artillero_doble.svg',
    description: 'Opera cañones rotatorios gemelos con cadencia extrema para barrer oleadas rápidas.',
    showdownName: 'Fuego Cruzado Gemelo',
    showdownDescription: 'Dispara ráfagas continuas por toda la arena infligiendo 420 de daño rápido.',
    showdownCooldown: 31,
    tiers: [
      {
        name: 'Cañones Gemelos I',
        cost: 0,
        damage: 24,
        range: 145,
        attackSpeed: 1.9,
        description: 'Cadencia de disparo superior.'
      },
      {
        name: 'Tambor Dual II',
        cost: 150,
        damage: 48,
        range: 165,
        attackSpeed: 2.3,
        description: 'Velocidad de fuego demoledora contra enjambres.',
        bonusEffect: 'Supresión balística'
      },
      {
        name: 'Tormenta Rotatoria III',
        cost: 305,
        damage: 98,
        range: 185,
        attackSpeed: 2.8,
        description: 'Lluvia ininterrumpida de proyectiles de plasma.',
        bonusEffect: 'Cadencia de élite'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#0284C7',
      accent: '#E0F2FE',
      bg: 'rgba(56, 189, 248, 0.16)'
    }
  },

  // --- 8 NUEVAS CARTAS ÉPICAS ---
  paladin_estelar: {
    id: 'paladin_estelar',
    name: 'Paladín Estelar',
    title: 'Caballero del Cosmos',
    role: 'soporte',
    rarity: 'epica',
    cost: 220,
    baseDamage: 56,
    baseRange: 150,
    baseAttackSpeed: 1.25,
    projectileType: 'resonance',
    projectileColor: '#FDE047',
    imageUrl: '/assets/images/hero_paladin_estelar.svg',
    description: 'Campeón celestial cuya aura fortalece el Núcleo y potencia a las torres aliadas con luz estelar.',
    showdownName: 'Égida de Constelación',
    showdownDescription: 'Restaura +2 vidas al Núcleo, otorga +45% de cadencia a todas las torres por 6s y causa 540 de daño sagrado.',
    showdownCooldown: 38,
    tiers: [
      {
        name: 'Espada Astral I',
        cost: 0,
        damage: 56,
        range: 150,
        attackSpeed: 1.25,
        description: 'Golpes radiantes equilibrados.'
      },
      {
        name: 'Escudo de Orión II',
        cost: 205,
        damage: 115,
        range: 170,
        attackSpeed: 1.5,
        description: 'Incrementa potencia y alcance sagrado.',
        bonusEffect: 'Resonancia protectora'
      },
      {
        name: 'Campeón Estelar III',
        cost: 420,
        damage: 240,
        range: 195,
        attackSpeed: 1.85,
        description: 'Impactos estelares capaces de frenar élites.',
        bonusEffect: 'Inspiración táctica total'
      }
    ],
    colorTheme: {
      primary: '#FDE047',
      secondary: '#4F46E5',
      accent: '#FEF9C3',
      bg: 'rgba(253, 224, 71, 0.16)'
    }
  },

  asesino_espectral: {
    id: 'asesino_espectral',
    name: 'Asesino Espectral',
    title: 'Filo del Más Allá',
    role: 'ataque',
    rarity: 'epica',
    cost: 230,
    baseDamage: 88,
    baseRange: 175,
    baseAttackSpeed: 1.15,
    projectileType: 'slash',
    projectileColor: '#2DD4BF',
    imageUrl: '/assets/images/hero_asesino_espectral.svg',
    description: 'Espectro letal que ignora blindajes pesados para eliminar rápidamente a jefes y colosos.',
    showdownName: 'Ejecución Fantasmal',
    showdownDescription: 'Atraviesa al enemigo más fuerte con 1250 de daño espectral y 520 al resto.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Daga Etérea I',
        cost: 0,
        damage: 88,
        range: 175,
        attackSpeed: 1.15,
        description: 'Cortes precisos de alto daño individual.'
      },
      {
        name: 'Paso Fantasma II',
        cost: 215,
        damage: 178,
        range: 195,
        attackSpeed: 1.4,
        description: 'Doble potencia contra objetivos blindados.',
        bonusEffect: 'Perforación espectral'
      },
      {
        name: 'Segador Etéreo III',
        cost: 440,
        damage: 365,
        range: 220,
        attackSpeed: 1.75,
        description: 'Daño crítico devastador contra jefes.',
        bonusEffect: 'Ejecución de élites'
      }
    ],
    colorTheme: {
      primary: '#2DD4BF',
      secondary: '#0F766E',
      accent: '#CCFBF1',
      bg: 'rgba(45, 212, 191, 0.16)'
    }
  },

  criomante_abismo: {
    id: 'criomante_abismo',
    name: 'Criomante del Abismo',
    title: 'Tejedor de Escarcha Negra',
    role: 'control',
    rarity: 'epica',
    cost: 215,
    baseDamage: 40,
    baseRange: 155,
    baseAttackSpeed: 1.25,
    projectileType: 'ice',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_criomante_abismo.svg',
    description: 'Domina el hielo oscuro del abismo para ralentizar drásticamente a legiones enteras y quebrar su armadura.',
    showdownName: 'Invierno Abisal',
    showdownDescription: 'Inflige 560 de daño helado, reduce la armadura enemiga en 6 y paraliza por 1.2s (0.5s jefes).',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Escarcha Abisal I',
        cost: 0,
        damage: 40,
        range: 155,
        attackSpeed: 1.25,
        description: 'Ralentiza 45% en cada impacto.'
      },
      {
        name: 'Prisión Glacial II',
        cost: 200,
        damage: 82,
        range: 175,
        attackSpeed: 1.5,
        description: 'Frena oleadas enteras con hielo oscuro.',
        bonusEffect: 'Ralentización profunda'
      },
      {
        name: 'Cero del Vacío III',
        cost: 410,
        damage: 172,
        range: 195,
        attackSpeed: 1.8,
        description: 'Escarcha letal que combina control y alto DPS.',
        bonusEffect: 'Congelación táctica abisal'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#1E3A8A',
      accent: '#E0F2FE',
      bg: 'rgba(56, 189, 248, 0.16)'
    }
  },

  bombardero_orbital: {
    id: 'bombardero_orbital',
    name: 'Bombardero Orbital',
    title: 'Coordinador Satelital',
    role: 'area',
    rarity: 'epica',
    cost: 245,
    baseDamage: 74,
    baseRange: 185,
    baseAttackSpeed: 0.85,
    projectileType: 'missile',
    projectileColor: '#F97316',
    imageUrl: '/assets/images/hero_bombardero_orbital.svg',
    description: 'Marca blancos desde órbita para descargar misiles guiados de impacto explosivo masivo.',
    showdownName: 'Protocolo Órbita Cero',
    showdownDescription: 'Solicita un bombardeo satelital sobre todo el campo de 760 de daño explosivo.',
    showdownCooldown: 38,
    tiers: [
      {
        name: 'Mira Satelital I',
        cost: 0,
        damage: 74,
        range: 185,
        attackSpeed: 0.85,
        description: 'Misiles de amplio radio de explosión.'
      },
      {
        name: 'Ojiva Guiada II',
        cost: 225,
        damage: 152,
        range: 205,
        attackSpeed: 1.05,
        description: 'Aumenta el alcance orbital y radio explosivo.',
        bonusEffect: 'Impacto orbital ampliado'
      },
      {
        name: 'Aniquilación Orbital III',
        cost: 460,
        damage: 315,
        range: 230,
        attackSpeed: 1.3,
        description: 'Destrucción masiva de blindados y enjambres.',
        bonusEffect: 'Ojiva termobárica'
      }
    ],
    colorTheme: {
      primary: '#F97316',
      secondary: '#9A3412',
      accent: '#FFEDD5',
      bg: 'rgba(249, 115, 22, 0.16)'
    }
  },

  maestro_runas: {
    id: 'maestro_runas',
    name: 'Maestro de Runas',
    title: 'Archimago Rúnico',
    role: 'multiplicador',
    rarity: 'epica',
    cost: 235,
    baseDamage: 58,
    baseRange: 165,
    baseAttackSpeed: 1.35,
    projectileType: 'resonance',
    projectileColor: '#C084FC',
    imageUrl: '/assets/images/hero_maestro_runas.svg',
    description: 'Graba sigilos arcanos que amplifican el daño sufrido por los invasores y atacan a múltiples blancos.',
    showdownName: 'Círculo de Glifos',
    showdownDescription: 'Activa glifos arcanos que infligen 640 de daño y reducen la armadura enemiga en 10.',
    showdownCooldown: 37,
    tiers: [
      {
        name: 'Runa Menor I',
        cost: 0,
        damage: 58,
        range: 165,
        attackSpeed: 1.35,
        description: 'Descargas arcanas resonantes.'
      },
      {
        name: 'Sello Amplificador II',
        cost: 215,
        damage: 118,
        range: 185,
        attackSpeed: 1.65,
        description: 'Glifos de mayor potencia y cadencia.',
        bonusEffect: 'Debilitamiento rúnico'
      },
      {
        name: 'Códice Supremo III',
        cost: 445,
        damage: 250,
        range: 210,
        attackSpeed: 2.0,
        description: 'Energía pura que atraviesa escudos enemigos.',
        bonusEffect: 'Maestría arcana múltiple'
      }
    ],
    colorTheme: {
      primary: '#C084FC',
      secondary: '#7E22CE',
      accent: '#F3E8FF',
      bg: 'rgba(192, 132, 252, 0.16)'
    }
  },

  forjador_titanio: {
    id: 'forjador_titanio',
    name: 'Forjador de Titanio',
    title: 'Herrero de Guerra',
    role: 'especial',
    rarity: 'epica',
    cost: 225,
    baseDamage: 72,
    baseRange: 140,
    baseAttackSpeed: 1.05,
    projectileType: 'shockwave',
    projectileColor: '#FB923C',
    imageUrl: '/assets/images/hero_forjador_titanio.svg',
    description: 'Golpea el suelo con su martillo fundido liberando ondas sísmicas que fracturan armaduras.',
    showdownName: 'Yunque del Titán',
    showdownDescription: 'Forja un impacto sísmico de 680 de daño, derrite la armadura enemiga a 0 y aturde 1.1s.',
    showdownCooldown: 37,
    tiers: [
      {
        name: 'Martillo Caliente I',
        cost: 0,
        damage: 72,
        range: 140,
        attackSpeed: 1.05,
        description: 'Ondas de choque contundentes.'
      },
      {
        name: 'Forja de Titanio II',
        cost: 210,
        damage: 146,
        range: 160,
        attackSpeed: 1.3,
        description: 'Rompe placas blindadas en cada golpe.',
        bonusEffect: 'Fractura de armadura'
      },
      {
        name: 'Martillo Solar III',
        cost: 430,
        damage: 305,
        range: 180,
        attackSpeed: 1.6,
        description: 'Sacudidas imparables de área mediana.',
        bonusEffect: 'Impacto rompe-tanques'
      }
    ],
    colorTheme: {
      primary: '#FB923C',
      secondary: '#9A3412',
      accent: '#FFEDD5',
      bg: 'rgba(251, 146, 60, 0.16)'
    }
  },

  cazadora_viento: {
    id: 'cazadora_viento',
    name: 'Cazadora del Viento',
    title: 'Saeta del Vendaval',
    role: 'ataque',
    rarity: 'epica',
    cost: 215,
    baseDamage: 48,
    baseRange: 190,
    baseAttackSpeed: 1.7,
    projectileType: 'arrow',
    projectileColor: '#34D399',
    imageUrl: '/assets/images/hero_cazadora_viento.svg',
    description: 'Dispara flechas huracanadas a máxima velocidad que empujan ligeramente y barren rutas largas.',
    showdownName: 'Ciclón de Flechas',
    showdownDescription: 'Desata un vendaval de saetas que causa 580 de daño y empuja a todos los enemigos 90px atrás.',
    showdownCooldown: 35,
    tiers: [
      {
        name: 'Arco Céfiro I',
        cost: 0,
        damage: 48,
        range: 190,
        attackSpeed: 1.7,
        description: 'Largo alcance y cadencia veloz.'
      },
      {
        name: 'Ráfaga Borrascosa II',
        cost: 205,
        damage: 98,
        range: 210,
        attackSpeed: 2.1,
        description: 'Flechas supersónicas de altísima frecuencia.',
        bonusEffect: 'Cadencia ciclónica'
      },
      {
        name: 'Tifón Esmeralda III',
        cost: 420,
        damage: 205,
        range: 235,
        attackSpeed: 2.6,
        description: 'Cobertura casi total del mapa con ráfagas letales.',
        bonusEffect: 'Alcance y cadencia supremos'
      }
    ],
    colorTheme: {
      primary: '#34D399',
      secondary: '#047857',
      accent: '#D1FAE5',
      bg: 'rgba(52, 211, 153, 0.16)'
    }
  },

  alquimista_esmeralda: {
    id: 'alquimista_esmeralda',
    name: 'Alquimista Esmeralda',
    title: 'Maestra de Pociones',
    role: 'area',
    rarity: 'epica',
    cost: 220,
    baseDamage: 52,
    baseRange: 145,
    baseAttackSpeed: 1.15,
    projectileType: 'spore',
    projectileColor: '#10B981',
    imageUrl: '/assets/images/hero_alquimista_esmeralda.svg',
    description: 'Arroja frascos de ácido esmeralda que disuelven escuadrones enteros y generan daño continuo.',
    showdownName: 'Elixir Disolvente',
    showdownDescription: 'Inunda el campo con ácido esmeralda: 520 de daño, 60 DPS de veneno por 6s y -8 de armadura.',
    showdownCooldown: 36,
    tiers: [
      {
        name: 'Matraz Ácido I',
        cost: 0,
        damage: 52,
        range: 145,
        attackSpeed: 1.15,
        description: 'Ácido volátil en área.'
      },
      {
        name: 'Fórmula Corrosiva II',
        cost: 205,
        damage: 108,
        range: 165,
        attackSpeed: 1.4,
        description: 'Disuelve armaduras metálicas con rapidez.',
        bonusEffect: 'Ácido persistente'
      },
      {
        name: 'Gran Obra Esmeralda III',
        cost: 425,
        damage: 228,
        range: 185,
        attackSpeed: 1.7,
        description: 'Nubes químicas devastadoras en área extensa.',
        bonusEffect: 'Corrosión total en zona'
      }
    ],
    colorTheme: {
      primary: '#10B981',
      secondary: '#065F46',
      accent: '#D1FAE5',
      bg: 'rgba(16, 185, 129, 0.16)'
    }
  },

  // --- 8 NUEVAS CARTAS LEGENDARIAS ---
  emperador_rayo: {
    id: 'emperador_rayo',
    name: 'Emperador del Rayo',
    title: 'Soberano de Alto Voltaje',
    role: 'control',
    rarity: 'legendaria',
    cost: 320,
    baseDamage: 105,
    baseRange: 180,
    baseAttackSpeed: 1.55,
    projectileType: 'lightning',
    projectileColor: '#38BDF8',
    imageUrl: '/assets/images/hero_emperador_rayo.svg',
    description: 'Monarca electromagnético cuyos relámpagos imperiales fulminan múltiples enemigos con descargas encadenadas.',
    showdownName: 'Juicio del Relámpago',
    showdownDescription: 'Descarga rayos imperiales sobre todos los enemigos causando 1050 de daño y aturdimiento breve de 1.1s (0.5s jefes).',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Cetro Voltaico I',
        cost: 0,
        damage: 105,
        range: 180,
        attackSpeed: 1.55,
        description: 'Rayos de alta potencia y gran alcance.'
      },
      {
        name: 'Corona Tormenta II',
        cost: 290,
        damage: 215,
        range: 200,
        attackSpeed: 1.9,
        description: 'Multiplica la tensión eléctrica contra élites.',
        bonusEffect: 'Sobrecarga imperial'
      },
      {
        name: 'Trono del Trueno III',
        cost: 590,
        damage: 455,
        range: 225,
        attackSpeed: 2.35,
        description: 'Tormenta continua imparable de nivel legendario.',
        bonusEffect: 'Arco supremo incesante'
      }
    ],
    colorTheme: {
      primary: '#38BDF8',
      secondary: '#1D4ED8',
      accent: '#FEF08A',
      bg: 'rgba(56, 189, 248, 0.2)'
    }
  },

  senor_cenizas: {
    id: 'senor_cenizas',
    name: 'Señor de las Cenizas',
    title: 'Heraldo del Cataclismo',
    role: 'area',
    rarity: 'legendaria',
    cost: 335,
    baseDamage: 120,
    baseRange: 160,
    baseAttackSpeed: 1.15,
    projectileType: 'fireball',
    projectileColor: '#EF4444',
    imageUrl: '/assets/images/hero_senor_cenizas.svg',
    description: 'Entidad volcánica legendaria que incinera ejércitos completos con bolas de fuego apocalípticas.',
    showdownName: 'Lluvia de Ceniza Viva',
    showdownDescription: 'Calcina la arena entera infligiendo 1120 de daño ígneo y 85 DPS de quemadura por 7s.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Ascua Eterna I',
        cost: 0,
        damage: 120,
        range: 160,
        attackSpeed: 1.15,
        description: 'Explosiones magmáticas de gran radio.'
      },
      {
        name: 'Manto de Obsidiana II',
        cost: 300,
        damage: 245,
        range: 180,
        attackSpeed: 1.4,
        description: 'Llama abrasadora que derrite tanques.',
        bonusEffect: 'Quemadura severa'
      },
      {
        name: 'Erupción Apocalíptica III',
        cost: 610,
        damage: 510,
        range: 205,
        attackSpeed: 1.7,
        description: 'Incendio implacable de toda la zona de combate.',
        bonusEffect: 'Fuego cataclísmico'
      }
    ],
    colorTheme: {
      primary: '#EF4444',
      secondary: '#7F1D1D',
      accent: '#FED7AA',
      bg: 'rgba(239, 68, 68, 0.2)'
    }
  },

  arquitecto_vacio: {
    id: 'arquitecto_vacio',
    name: 'Arquitecto del Vacío',
    title: 'Geómetra Dimensional',
    role: 'multiplicador',
    rarity: 'legendaria',
    cost: 340,
    baseDamage: 110,
    baseRange: 185,
    baseAttackSpeed: 1.35,
    projectileType: 'portal',
    projectileColor: '#A855F7',
    imageUrl: '/assets/images/hero_arquitecto_vacio.svg',
    description: 'Manipula anomalías gravitatorias que atraen y desintegran a múltiples objetivos al mismo tiempo.',
    showdownName: 'Singularidad Invertida',
    showdownDescription: 'Rebobina a todos los invasores 130px hacia atrás y los golpea con 1050 de daño del vacío.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Fisura Menor I',
        cost: 0,
        damage: 110,
        range: 185,
        attackSpeed: 1.35,
        description: 'Proyectiles dimensionales precisos.'
      },
      {
        name: 'Matriz del Vacío II',
        cost: 310,
        damage: 230,
        range: 205,
        attackSpeed: 1.65,
        description: 'Distorsiona la trayectoria y armadura enemiga.',
        bonusEffect: 'Gravedad anómala'
      },
      {
        name: 'Horizonte de Eventos III',
        cost: 620,
        damage: 485,
        range: 230,
        attackSpeed: 2.0,
        description: 'Desgarra la realidad bajo los invasores.',
        bonusEffect: 'Colapso dimensional'
      }
    ],
    colorTheme: {
      primary: '#A855F7',
      secondary: '#581C87',
      accent: '#F3E8FF',
      bg: 'rgba(168, 85, 247, 0.2)'
    }
  },

  valquiria_aurora: {
    id: 'valquiria_aurora',
    name: 'Valquiria de la Aurora',
    title: 'Justiciera Boreal',
    role: 'soporte',
    rarity: 'legendaria',
    cost: 315,
    baseDamage: 95,
    baseRange: 170,
    baseAttackSpeed: 1.5,
    projectileType: 'slash',
    projectileColor: '#2DD4BF',
    imageUrl: '/assets/images/hero_valquiria_aurora.svg',
    description: 'Guerrera legendaria que combina cortes radiantes devastadores con bendiciones de velocidad y curación.',
    showdownName: 'Danza de la Aurora',
    showdownDescription: 'Restaura +2 vidas al Núcleo, potencia +75% la cadencia aliada por 7s y causa 820 de daño boreal.',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Lanza Boreal I',
        cost: 0,
        damage: 95,
        range: 170,
        attackSpeed: 1.5,
        description: 'Tajos veloces de energía polar.'
      },
      {
        name: 'Alas de Luz II',
        cost: 285,
        damage: 195,
        range: 190,
        attackSpeed: 1.85,
        description: 'Aumenta velocidad de ataque y soporte.',
        bonusEffect: 'Aura boreal protectora'
      },
      {
        name: 'Furia Celestial III',
        cost: 575,
        damage: 410,
        range: 215,
        attackSpeed: 2.25,
        description: 'Embestida luminosa implacable.',
        bonusEffect: 'Cadencia y apoyo legendarios'
      }
    ],
    colorTheme: {
      primary: '#2DD4BF',
      secondary: '#0F766E',
      accent: '#ECFEFF',
      bg: 'rgba(45, 212, 191, 0.2)'
    }
  },

  coloso_obsidiana: {
    id: 'coloso_obsidiana',
    name: 'Coloso de Obsidiana',
    title: 'Titán Indestructible',
    role: 'invocador',
    rarity: 'legendaria',
    cost: 345,
    baseDamage: 145,
    baseRange: 150,
    baseAttackSpeed: 0.95,
    projectileType: 'shockwave',
    projectileColor: '#A855F7',
    imageUrl: '/assets/images/hero_coloso_obsidiana.svg',
    description: 'Gigante ancestral forjado en vidrio volcánico que pulveriza blindajes con ondas telúricas.',
    showdownName: 'Sismo de Obsidiana',
    showdownDescription: 'Golpea la tierra causando 1180 de daño brutal, rompe 12 de armadura y aturde 1.2s (0.5s jefes).',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Puño Basáltico I',
        cost: 0,
        damage: 145,
        range: 150,
        attackSpeed: 0.95,
        description: 'Impactos pesados demoledores.'
      },
      {
        name: 'Coraza Magmática II',
        cost: 310,
        damage: 295,
        range: 165,
        attackSpeed: 1.15,
        description: 'Ondas sísmicas de enorme alcance.',
        bonusEffect: 'Aplastamiento pesado'
      },
      {
        name: 'Monolito Supremo III',
        cost: 630,
        damage: 615,
        range: 185,
        attackSpeed: 1.4,
        description: 'Cada impacto equivale a un meteorito en ruta.',
        bonusEffect: 'Fuerza titánica máxima'
      }
    ],
    colorTheme: {
      primary: '#A855F7',
      secondary: '#3B0764',
      accent: '#FB923C',
      bg: 'rgba(168, 85, 247, 0.2)'
    }
  },

  francotirador_pulsar: {
    id: 'francotirador_pulsar',
    name: 'Francotirador Púlsar',
    title: 'Ojo de Estrella de Neutrones',
    role: 'ataque',
    rarity: 'legendaria',
    cost: 330,
    baseDamage: 190,
    baseRange: 250,
    baseAttackSpeed: 0.9,
    projectileType: 'beam',
    projectileColor: '#22D3EE',
    imageUrl: '/assets/images/hero_francotirador_pulsar.svg',
    description: 'Cobertura casi global con haces de púlsar concentrados diseñados para destruir jefes a distancia.',
    showdownName: 'Disparo Púlsar Crítico',
    showdownDescription: 'Impacta al jefe o enemigo más fuerte con 2400 de daño puro y 700 a todos los demás.',
    showdownCooldown: 39,
    tiers: [
      {
        name: 'Mira Cuántica I',
        cost: 0,
        damage: 190,
        range: 250,
        attackSpeed: 0.9,
        description: 'Alcance masivo y daño letal.'
      },
      {
        name: 'Cañón Neutrónico II',
        cost: 300,
        damage: 385,
        range: 275,
        attackSpeed: 1.1,
        description: 'Destruye objetivos blindados de un solo haz.',
        bonusEffect: 'Alcance de 275px'
      },
      {
        name: 'Singularidad Púlsar III',
        cost: 615,
        damage: 810,
        range: 310,
        attackSpeed: 1.35,
        description: 'Aniquilación instantánea a lo largo de toda la arena.',
        bonusEffect: 'Cobertura total anti-jefes'
      }
    ],
    colorTheme: {
      primary: '#22D3EE',
      secondary: '#0E7490',
      accent: '#CFFAFE',
      bg: 'rgba(34, 211, 238, 0.2)'
    }
  },

  invocador_fenix: {
    id: 'invocador_fenix',
    name: 'Invocador del Fénix',
    title: 'Guardián de Llama Eterna',
    role: 'invocador',
    rarity: 'legendaria',
    cost: 325,
    baseDamage: 108,
    baseRange: 170,
    baseAttackSpeed: 1.4,
    projectileType: 'fireball',
    projectileColor: '#F59E0B',
    imageUrl: '/assets/images/hero_invocador_fenix.svg',
    description: 'Conjura espíritus ígneos renacientes que bombardean las líneas invasoras con llamas doradas.',
    showdownName: 'Renacer Ígneo',
    showdownDescription: 'Llamarada fénix de 1050 de daño, +120 de oro extra y +1 vida al Núcleo.',
    showdownCooldown: 42,
    tiers: [
      {
        name: 'Pluma Dorada I',
        cost: 0,
        damage: 108,
        range: 170,
        attackSpeed: 1.4,
        description: 'Llamaradas continuas de alta energía.'
      },
      {
        name: 'Vuelo del Fénix II',
        cost: 295,
        damage: 220,
        range: 190,
        attackSpeed: 1.7,
        description: 'Fuego sagrado de amplio impacto.',
        bonusEffect: 'Abrasamiento dorado'
      },
      {
        name: 'Inmortalidad Solar III',
        cost: 595,
        damage: 465,
        range: 215,
        attackSpeed: 2.1,
        description: 'Tormenta de aves de fuego implacables.',
        bonusEffect: 'Llama eterna legendaria'
      }
    ],
    colorTheme: {
      primary: '#F59E0B',
      secondary: '#B91C1C',
      accent: '#FEF3C7',
      bg: 'rgba(245, 158, 11, 0.2)'
    }
  },

  maestro_tormenta: {
    id: 'maestro_tormenta',
    name: 'Maestro de la Tormenta',
    title: 'Señor del Huracán',
    role: 'control',
    rarity: 'legendaria',
    cost: 320,
    baseDamage: 98,
    baseRange: 175,
    baseAttackSpeed: 1.5,
    projectileType: 'lightning',
    projectileColor: '#60A5FA',
    imageUrl: '/assets/images/hero_maestro_tormenta.svg',
    description: 'Controla vientos y relámpagos combinados para desordenar y castigar hordas enteras.',
    showdownName: 'Ojo del Huracán',
    showdownDescription: 'Empuja 100px atrás a todos los enemigos, ralentiza 55% por 5s e inflige 940 de daño eléctrico.',
    showdownCooldown: 40,
    tiers: [
      {
        name: 'Viento Eléctrico I',
        cost: 0,
        damage: 98,
        range: 175,
        attackSpeed: 1.5,
        description: 'Descargas rápidas con presión atmosférica.'
      },
      {
        name: 'Borrasca Eléctrica II',
        cost: 290,
        damage: 202,
        range: 195,
        attackSpeed: 1.85,
        description: 'Tormenta intensa contra oleadas densas.',
        bonusEffect: 'Control climático de élite'
      },
      {
        name: 'Cataclismo Tifón III',
        cost: 585,
        damage: 430,
        range: 220,
        attackSpeed: 2.25,
        description: 'Relámpagos huracanados de área dominante.',
        bonusEffect: 'Dominio total de tormenta'
      }
    ],
    colorTheme: {
      primary: '#60A5FA',
      secondary: '#1E40AF',
      accent: '#DBEAFE',
      bg: 'rgba(96, 165, 250, 0.2)'
    }
  },

  // --- 2 NUEVAS CARTAS DIVINIDADES ---
  helios_celestial: {
    id: 'helios_celestial',
    name: 'Helios Celestial',
    title: 'Deidad del Astro Supremo',
    role: 'area',
    rarity: 'divinidad',
    arenaUnlockLevel: 12,
    cost: 420,
    baseDamage: 155,
    baseRange: 195,
    baseAttackSpeed: 1.45,
    projectileType: 'beam',
    projectileColor: '#FACC15',
    imageUrl: '/assets/images/hero_helios_celestial.svg',
    description: 'Divinidad solar suprema que irradia luz purificadora, derritiendo armaduras e iluminando el sendero con fuego estelar.',
    showdownName: 'Amanecer Divino',
    showdownDescription: 'Desciende la corona del sol: inflige 1650 de daño radiante global, elimina armaduras, aplica 90 DPS y restaura +2 vidas.',
    showdownCooldown: 45,
    tiers: [
      {
        name: 'Corona Solar I',
        cost: 0,
        damage: 155,
        range: 195,
        attackSpeed: 1.45,
        description: 'Haces solares divinos de amplio espectro.'
      },
      {
        name: 'Fulgor Inmortal II',
        cost: 375,
        damage: 325,
        range: 220,
        attackSpeed: 1.8,
        description: 'Calcina escuadrones completos con radiación astral.',
        bonusEffect: 'Fuego solar divino'
      },
      {
        name: 'Trono del Sol III',
        cost: 790,
        damage: 710,
        range: 245,
        attackSpeed: 2.25,
        description: 'Poder absoluto del Astro Rey sobre el campo de batalla.',
        bonusEffect: 'Supremacía solar celestial'
      }
    ],
    colorTheme: {
      primary: '#FACC15',
      secondary: '#D97706',
      accent: '#FEF9C3',
      bg: 'rgba(250, 204, 21, 0.24)'
    }
  },

  nyx_abismo_eterno: {
    id: 'nyx_abismo_eterno',
    name: 'Nyx, Abismo Eterno',
    title: 'Diosa de la Noche Primordial',
    role: 'multiplicador',
    rarity: 'divinidad',
    arenaUnlockLevel: 14,
    cost: 440,
    baseDamage: 165,
    baseRange: 200,
    baseAttackSpeed: 1.4,
    projectileType: 'portal',
    projectileColor: '#C084FC',
    imageUrl: '/assets/images/hero_nyx_abismo_eterno.svg',
    description: 'Deidad ancestral de la noche cósmica que consume la esencia vital de los invasores y altera el flujo de la realidad.',
    showdownName: 'Eclipse Primordial',
    showdownDescription: 'Sumerge la arena en oscuridad eterna: ejecuta enemigos con <35% HP, causa 1750 de daño a jefes y congela 1.5s.',
    showdownCooldown: 46,
    tiers: [
      {
        name: 'Velo Nocturno I',
        cost: 0,
        damage: 165,
        range: 200,
        attackSpeed: 1.4,
        description: 'Orbes abisales de energía primordial.'
      },
      {
        name: 'Manto del Eclipse II',
        cost: 390,
        damage: 345,
        range: 225,
        attackSpeed: 1.75,
        description: 'Desgarra la resistencia de colosos y jefes.',
        bonusEffect: 'Penetración del eclipse'
      },
      {
        name: 'Noche Eterna III',
        cost: 820,
        damage: 760,
        range: 255,
        attackSpeed: 2.2,
        description: 'Poder divino absoluto que consume toda amenaza invasora.',
        bonusEffect: 'Supremacía primordial del abismo'
      }
    ],
    colorTheme: {
      primary: '#C084FC',
      secondary: '#4C1D95',
      accent: '#F3E8FF',
      bg: 'rgba(192, 132, 252, 0.25)'
    }
  }

};

export const UNIT_LIST = Object.values(UNITS);

/**
 * Returns the exclusive Divine character associated with a specific Arena (Level 1 to 15).
 */
export function getDivinityForArena(arenaLevel: number): UnitBlueprint | undefined {
  return UNIT_LIST.find((u) => u.rarity === 'divinidad' && u.arenaUnlockLevel === arenaLevel);
}

/**
 * Returns all Divine characters sorted by Arena level (1 to 15).
 */
export function getAllDivinities(): UnitBlueprint[] {
  return UNIT_LIST.filter((u) => u.rarity === 'divinidad').sort(
    (a, b) => (a.arenaUnlockLevel || 1) - (b.arenaUnlockLevel || 1)
  );
}

/**
 * Checks if a card is locked because the player has not yet reached its required arena.
 */
export function isCardLockedByArena(card: UnitBlueprint, highestArenaUnlocked: number): boolean {
  if (!card.arenaUnlockLevel) return false;
  return card.arenaUnlockLevel > highestArenaUnlocked;
}

const ARENA_GIFT_POOL: Record<number, string[]> = {
  2: ['golem_magma', 'mago_fuego', 'pirotecnico_brasa', 'inferno_dragon'],
  3: ['hacker_cibernetico', 'torre_tesla_v2', 'soldado_plasma', 'ingeniero_mecanico'],
  4: ['viajero_tiempo', 'banquero_crono', 'chrono_guardian', 'alquimista_dorado'],
  5: ['lunar_huntress', 'cazador_sombras', 'shadow_assassin', 'francotirador_fantasma'],
  6: ['guardian_hielo', 'criomante_abismo', 'caballero_cristal', 'lanzacohetes'],
  7: ['chaman_electrico', 'emperador_rayo', 'electro_wizard', 'plasma_gunner'],
  8: ['void_sniper', 'arquitecto_vacio', 'arcane_witch', 'cientifico_nuclear'],
  9: ['sacerdote_solar', 'paladin_estelar', 'paladin_aegis', 'medico_combate'],
  10: ['titan_tormenta', 'maestro_tormenta', 'valkyrie_storm', 'valquiria_aurora'],
  11: ['reina_espinas', 'botanico_veneno', 'alquimista_esmeralda', 'druida_bosque'],
  12: ['mecha_artillery', 'bombardero_orbital', 'forjador_titanio', 'artillero_pesado'],
  13: ['resonator', 'maestro_runas', 'invocador_golems', 'coloso_obsidiana'],
  14: ['asesina_carmesi', 'asesino_espectral', 'francotirador_pulsar', 'ninja_sombrio'],
  15: ['samurai_carmesi', 'invocador_fenix', 'dragon_mecanico', 'cazadora_viento']
};

/**
 * Picks 1 brand-new unowned character to gift the player when arriving at a newly unlocked Arena.
 */
export function getArenaGiftCharacter(arenaLevel: number, unlockedCardIds: string[]): UnitBlueprint | null {
  const candidates = ARENA_GIFT_POOL[arenaLevel] || [];
  for (const id of candidates) {
    if (UNITS[id] && !unlockedCardIds.includes(id)) {
      return UNITS[id];
    }
  }
  // Fallback to any unowned non-divinity hero
  const anyNonDivine = UNIT_LIST.find((u) => u.rarity !== 'divinidad' && !unlockedCardIds.includes(u.id));
  if (anyNonDivine) return anyNonDivine;

  // Final fallback: any unowned unit unlocked at or below this arena
  const anyUnowned = UNIT_LIST.find(
    (u) => (!u.arenaUnlockLevel || u.arenaUnlockLevel <= arenaLevel) && !unlockedCardIds.includes(u.id)
  );
  return anyUnowned || null;
}
