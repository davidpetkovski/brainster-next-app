import { Survey } from "@prisma/client";
import { GenericApiResponse } from "./GenericApiResponse";

export type SurveyDTO = GenericApiResponse<Survey>;
