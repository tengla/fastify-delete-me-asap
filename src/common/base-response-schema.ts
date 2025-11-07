import Type, { type Static } from "typebox";

export const baseResponseSchema = {
  400: Type.Object(
    {
      message: Type.String(),
    },
    { description: "Bad Request" }
  ),
  401: Type.Object(
    {
      message: Type.String(),
    },
    { description: "Unauthorized" }
  ),
  500: Type.Object(
    {
      message: Type.String(),
    },
    { description: "Internal Server Error" }
  ),
};

export type BaseResponseSchema = Static<typeof baseResponseSchema>;
