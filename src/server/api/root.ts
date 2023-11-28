import { userRouter } from "@/server/api/routers/user";
import { daillyRouter } from "@/server/api/routers/dailly";
import { instalationRouter } from "./routers/instalation";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  dailly: daillyRouter,
  installation: instalationRouter
});

export type AppRouter = typeof appRouter;
