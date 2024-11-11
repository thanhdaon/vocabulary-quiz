"use client";

import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "~/trpc/routes";

export const api = createTRPCReact<AppRouter>();
