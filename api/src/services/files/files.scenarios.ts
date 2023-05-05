import type { Prisma, File } from '@prisma/client';
import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.FileCreateArgs>({
  file: {
    one: { data: { owner: 'String', data: 'String', type: 'String' } },
    two: { data: { owner: 'String', data: 'String', type: 'String' } },
  },
});

export type StandardScenario = ScenarioData<File, 'file'>;
