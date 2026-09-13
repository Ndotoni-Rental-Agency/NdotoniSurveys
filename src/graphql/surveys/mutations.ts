export const submitSelfReport = /* GraphQL */ `
  mutation SubmitSelfReport($cycleMonth: String, $summary: String!, $blockers: String) {
    submitSelfReport(cycleMonth: $cycleMonth, summary: $summary, blockers: $blockers) {
      reportId
      userId
      cycleMonth
      title
      status
      summary
      blockers
      dueDate
      createdAt
      updatedAt
      submittedAt
    }
  }
`;

export const giveFeedback = /* GraphQL */ `
  mutation GiveFeedback(
    $toUserId: ID!
    $ratings: [FeedbackRatingInput!]!
    $strengths: String!
    $improvements: String!
    $additionalFeedback: String
  ) {
    giveFeedback(
      toUserId: $toUserId
      ratings: $ratings
      strengths: $strengths
      improvements: $improvements
      additionalFeedback: $additionalFeedback
    ) {
      feedbackId
      fromUserId
      toUserId
      ratings {
        category
        score
      }
      strengths
      improvements
      additionalFeedback
      createdAt
    }
  }
`;
