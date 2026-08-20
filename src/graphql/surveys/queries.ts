export const listMySurveyAssignments = /* GraphQL */ `
  query ListMySurveyAssignments($status: SurveyAssignmentStatus) {
    listMySurveyAssignments(status: $status) {
      assignments {
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
      count
    }
  }
`;

export const getSurveyResponsesForReviewee = /* GraphQL */ `
  query GetSurveyResponsesForReviewee($revieweeId: ID!) {
    getSurveyResponsesForReviewee(revieweeId: $revieweeId) {
      responses {
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
      count
    }
  }
`;

export const getSurveyResponsesForAssignment = /* GraphQL */ `
  query GetSurveyResponsesForAssignment($assignmentId: ID!) {
    getSurveyResponsesForAssignment(assignmentId: $assignmentId) {
      responses {
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
      count
    }
  }
`;

export const getSurveyStats = /* GraphQL */ `
  query GetSurveyStats($cycleMonth: String) {
    getSurveyStats(cycleMonth: $cycleMonth) {
      totalAssignments
      completed
      inProgress
      pending
      completionRate
    }
  }
`;
