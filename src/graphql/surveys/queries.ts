export const listMySelfReports = /* GraphQL */ `
  query ListMySelfReports($status: SelfReportStatus) {
    listMySelfReports(status: $status) {
      reports {
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
      count
    }
  }
`;

export const getSelfReportStats = /* GraphQL */ `
  query GetSelfReportStats($cycleMonth: String) {
    getSelfReportStats(cycleMonth: $cycleMonth) {
      totalReports
      submitted
      pending
      completionRate
    }
  }
`;

export const getFeedbackAboutUser = /* GraphQL */ `
  query GetFeedbackAboutUser($userId: ID!) {
    getFeedbackAboutUser(userId: $userId) {
      feedback {
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
      count
    }
  }
`;

export const getFeedbackIGave = /* GraphQL */ `
  query GetFeedbackIGave {
    getFeedbackIGave {
      feedback {
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
      count
    }
  }
`;
