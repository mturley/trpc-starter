// @filename: server.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.create();

const router = t.router;
const publicProcedure = t.procedure;

interface User {
  id: string;
  name: string;
}

const userList: User[] = [
  {
    id: '1',
    name: 'KATT',
  },
];

const appRouter = router({
  userById: publicProcedure
    // The input is unknown at this time.
    // A client could have sent us anything
    // so we won't assume a certain data type.
    .input((val: unknown) => {
      // If the value is of type string, return it.
      // TypeScript now knows that this value is a string.
      if (typeof val === 'string') return val;
      // Uh oh, looks like that input wasn't a string.
      // We will throw an error instead of running the procedure.
      throw new Error(`Invalid input: ${typeof val}`);
    })
    .query((req) => {
      const { input } = req;
      const user = userList.find((u) => u.id === input);
      return user;
    }),

  userCreate: publicProcedure.input(z.object({ name: z.string() })).mutation((req) => {
    const id = `${Math.random()}`;

    const user: User = {
      id,
      name: req.input.name,
    };

    userList.push(user);

    return user;
  }),
});

export type AppRouter = typeof appRouter;
