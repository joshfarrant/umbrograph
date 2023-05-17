import type { Prisma, File } from '@prisma/client';

import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.FileCreateArgs>({
  file: {
    one: { data: { albumId: 'String', data: 'String' } },
    two: { data: { albumId: 'String', data: 'String' } },
  },
});

export type StandardScenario = ScenarioData<File, 'file'>;
