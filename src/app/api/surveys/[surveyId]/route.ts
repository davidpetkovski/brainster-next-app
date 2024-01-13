import prisma from "@/lib/prisma";
import routeHandler from "@/lib/routeHandler";
import Survey from "@/schemas/Survey";
import { NextRequest, NextResponse } from "next/server";

type ApiHandlerContext = {
  params: {
    surveyId: string;
  };
};

export const GET = routeHandler(async (request, context) => {
  const { surveyId } = context.params;
  const survey = await prisma.survey.findUniqueOrThrow({
    where: {
      id: surveyId,
    },
    include: {
      questions: true,
    },
  });

  return survey;
});

export const PATCH = routeHandler(async (request, context) => {
  const { surveyId } = context.params;
  const body = await request.json();

  const validation = await Survey.safeParseAsync(body);
  if (!validation.success) {
    throw validation.error;
  }
  const { data } = validation;
  const survey = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data,
  });

  return survey;
});
