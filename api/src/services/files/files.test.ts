import type { File } from '@prisma/client';

import { files, file, createFile, updateFile, deleteFile } from './files';
import type { StandardScenario } from './files.scenarios';

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('files', () => {
  scenario('returns all files', async (scenario: StandardScenario) => {
    const result = await files();

    expect(result.length).toEqual(Object.keys(scenario.file).length);
  });

  scenario('returns a single file', async (scenario: StandardScenario) => {
    const result = await file({ id: scenario.file.one.id });

    expect(result).toEqual(scenario.file.one);
  });

  scenario('creates a file', async (scenario: StandardScenario) => {
    const result = await createFile({
      input: { data: 'String', albumId: scenario.file.two.albumId },
    });

    expect(result.data).toEqual('String');
    expect(result.albumId).toEqual(scenario.file.two.albumId);
  });

  scenario('updates a file', async (scenario: StandardScenario) => {
    const original = (await file({ id: scenario.file.one.id })) as File;
    const result = await updateFile({
      id: original.id,
      input: { data: 'String2' },
    });

    expect(result.data).toEqual('String2');
  });

  scenario('deletes a file', async (scenario: StandardScenario) => {
    const original = (await deleteFile({ id: scenario.file.one.id })) as File;
    const result = await file({ id: original.id });

    expect(result).toEqual(null);
  });
});
