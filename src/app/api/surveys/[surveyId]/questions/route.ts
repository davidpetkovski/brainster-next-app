import routeHandler from "@/lib/routeHandler";
import Question from "@/schemas/Question";
import prisma from "@/lib/prisma";

export const POST = routeHandler(async (request, context) => {
  const { surveyId } = context.params;
  const survey = await prisma?.survey.findUniqueOrThrow({
    where: {
      id: surveyId,
    },
    include: {
      questions: true,
    },
  });

  const body = await request.json();
  const validation = await Question.safeParseAsync(body);

  if (!validation.success) {
    throw validation.error;
  }

  const { data } = validation;
  const surveyWithQuestions = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      questions: {
        create: {
          ...data,
          position: survey.questions.length,
        },
      },
    },
    include: {
      questions: true,
    },
  });

  return surveyWithQuestions;
});
