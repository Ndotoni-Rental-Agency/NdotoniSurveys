export const startSurveyAssignment = /* GraphQL */ `
  mutation StartSurveyAssignment($assignmentId: ID!) {
    startSurveyAssignment(assignmentId: $assignmentId) {
      assignmentId
      reviewerId
      cycleMonth
      title
      status
      requiredRevieweeIds
      completedRevieweeIds
      dueDate
      createdAt
      updatedAt
    }
  }
`;

export const submitSurveyResponse = /* GraphQL */ `
  mutation SubmitSurveyResponse(
    $assignmentId: ID!
    $revieweeId: ID!
    $ratings: [SurveyRatingInput!]!
    $strengths: String!
    $improvements: String!
    $additionalFeedback: String
  ) {
    submitSurveyResponse(
      assignmentId: $assignmentId
      revieweeId: $revieweeId
      ratings: $ratings
      strengths: $strengths
      improvements: $improvements
      additionalFeedback: $additionalFeedback
    ) {
      assignmentId
      reviewerId
      revieweeId
      cycleMonth
      ratings {
        category
        score
      }
      strengths
      improvements
      additionalFeedback
      submittedAt
    }
  }
`;
