import * as migration_20261107_000540_inicial from './20261107_000540_inicial';
import * as migration_20261107_000600_mundos_iniciales from './20261107_000600_mundos_iniciales';

export const migrations = [
  {
    up: migration_20261107_000540_inicial.up,
    down: migration_20261107_000540_inicial.down,
    name: '20261107_000540_inicial'
  },
  {
    up: migration_20261107_000600_mundos_iniciales.up,
    down: migration_20261107_000600_mundos_iniciales.down,
    name: '20261107_000600_mundos_iniciales'
  },
];
