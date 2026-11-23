import { z } from "zod";
import { Role } from "@prisma/client";

export const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: z.nativeEnum(Role),
});