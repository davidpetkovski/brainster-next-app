import routeHandler from "@/lib/routeHandler";
import prisma from "@/lib/prisma";

export const DELETE = routeHandler(async (request, context) => {
  const { surveyId, questionId } = context.params;

  const deletedQuestion = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
  });

  // Update the position counters for the remaining questions
  const updatedResponse = await prisma.question.updateMany({
    where: {
      surveyId: surveyId,
      position: { gt: deletedQuestion.position }, // Select questions after the deleted question
    },
    data: {
      position: {
        decrement: 1,
      },
    },
  });

  const { questions } = await prisma.survey.update({
    where: {
      id: surveyId,
    },
    data: {
      questions: {
        delete: {
          id: questionId,
        },
      },
    },
    include: {
      questions: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  return questions;
});
