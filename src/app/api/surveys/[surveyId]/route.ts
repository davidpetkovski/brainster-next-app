import prisma from "@/lib/prisma";
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
