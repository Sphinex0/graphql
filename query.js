export const QUERY = `#graphql
{
  user(where: {events: {event: {path: {_like: "%module"}}}}) {
    login
    firstName
    lastName
    email
    xp: transactions_aggregate(
      where: {type: {_eq: "xp"}, event: {path: {_like: "%module"}}}
    ) {
      aggregate {
        sum {
          amount
        }
      }
    }
    level: transactions(
      where: {type: {_eq: "level"}, event: {path: {_like: "%module"}}}
      order_by: {amount: desc}
      limit: 1
    ) {
      amount
    }
  }
  skills: transaction(distinct_on: type, where: {type: {_like: "skill%"}}) {
    type
    transaction_type {
      transactions_aggregate {
        aggregate {
          max {
            amount
          }
        }
      }
    }
  }
  XPOverTime: transaction(
    order_by: {createdAt: asc}
    where: {event: {path: {_like: "%module"}}, type: {_eq: "xp"}}
  ) {
    amount
    createdAt
  }
  AuditsRatio: user {
    auditRatio
    totalUp
    totalUpBonus
    totalDown
  }
}
`