import { useQuery, gql } from "@apollo/client";
import { useEffect } from "react";

const GET_APP = gql`
 query GetDashboard {
  dashboard {
    total_leads
    total_campaigns
    total_form_templates
    total_users
    balance
    total_rewarded
    average_leads_per_campaign
    total_leads_today
    current_campaigns {
      id
      name
      start_date
      end_date
      total_leads
      total_converted_leads
      total_lost_leads
      total_rewarded_leads
      remaining_time
      average_cost_per_lead
      rewarded_amount
    }
    sliders{
      id
      title
      description
      featured_image
      button_text
      url
      created_at
    }
  }
}
`;

export function useGetAppData(authToken) {
  const { loading, error, data, refetch } = useQuery(GET_APP,{
    skip: !authToken,
  });
  useEffect(() => {
    if (authToken) {
      refetch();
    }
  }, [authToken, refetch]);
  return {
    loading,
    error,
    app: data?.dashboard || {},
  };
}