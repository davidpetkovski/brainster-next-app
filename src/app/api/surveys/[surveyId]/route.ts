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

export async function PATCH(request: NextRequest, context: ApiHandlerContext) {
  const { surveyId } = context.params;
  const body = await request.json();
  try {
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

    return NextResponse.json({
      data: survey,
    });
  } catch (e) {
    return NextResponse.json(
      {
        error: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
}
