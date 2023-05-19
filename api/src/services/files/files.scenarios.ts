import type { Prisma, File } from '@prisma/client';
import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.FileCreateArgs>({
  file: {
    one: { data: { data: 'String', Album: { create: { owner: 'String' } } } },
    two: { data: { data: 'String', Album: { create: { owner: 'String' } } } },
  },
});

export type StandardScenario = ScenarioData<File, 'file'>;
