import { z } from 'zod';

const KeyOps = z.union([
  z.tuple([z.literal('encrypt'), z.literal('decrypt')]),
  z.tuple([z.literal('decrypt'), z.literal('encrypt')]),
]);

const Key = z.object({
  alg: z.literal('A256GCM'),
  ext: z.literal(true),
  k: z.string(),
  key_ops: KeyOps,
  kty: z.literal('oct'),
});

const Iv = z.array(z.number()).length(12);

export const Secret = z.object({
  key: Key,
  iv: Iv,
});
