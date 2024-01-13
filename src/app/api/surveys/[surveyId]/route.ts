import prisma from "@/lib/prisma";
import Survey from "@/schemas/Survey";
import { NextRequest, NextResponse } from "next/server";

type ApiHandlerContext = {
  params: {
    surveyId: string;
  };
};

export async function GET(request: NextRequest, context: ApiHandlerContext) {
  const { surveyId } = context.params;
  try {
    const survey = await prisma.survey.findUniqueOrThrow({
      where: {
        id: surveyId,
      },
    });
    return NextResponse.json({
      data: survey,
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json(
        {
          error: e.message,
        },
        {
          status: 500,
        }
      );
    }
    return NextResponse.json(
      {
        error: "Unknown error occured",
      },
      {
        status: 500,
      }
    );
  }
}

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
