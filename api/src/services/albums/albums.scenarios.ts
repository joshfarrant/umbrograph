import type { Prisma, Album } from '@prisma/client';
import type { ScenarioData } from '@redwoodjs/testing/api';

export const standard = defineScenario<Prisma.AlbumCreateArgs>({
  album: {
    one: { data: { owner: 'String' } },
    two: { data: { owner: 'String' } },
  },
});

export type StandardScenario = ScenarioData<Album, 'album'>;
