import * as z from 'zod';

export type TIdentity = {
  keys: {
    public: {
      signing: CryptoKey;
    };
    private: {
      encryption: {
        key: CryptoKey;
        iv: Uint8Array;
      };
      signing: CryptoKey;
    };
  };
};

// TODO Define the properties of the `JsonWebKey` type
const JsonWebKeySchema = z.any();

export const JsonIdentitySchema = z.object({
  version: z.literal('v1'),
  keys: z.object({
    public: z.object({
      signing: JsonWebKeySchema,
    }),
    private: z.object({
      encryption: z.object({
        key: JsonWebKeySchema,
        iv: z.array(z.number()),
      }),
      signing: JsonWebKeySchema,
    }),
  }),
});

export type TJsonIdentity = z.infer<typeof JsonIdentitySchema>;
