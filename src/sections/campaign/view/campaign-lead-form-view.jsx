import { useEffect, useState } from "react";

import { Container, Typography, Stack, Card, Box } from "@mui/material";

import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  fetchCampaignDetailRequest,
  fetchFormTemplateDetailRequest,
} from "src/redux/actions";
import {
  selectCampaignNoAuthState,
  selectFormTemplateState,
} from "src/redux/selectors";

import { CampaignLeadForm } from "../campaign-lead-form";
import { CampaignLeadFormSkeleton } from "../campaign-skeleton";

import { axiosInstance } from "src/lib";
// import { decrypt } from "src/helper/encrypt";
import { fetchCampaignDetailWithoutAuth } from "src/api";
import { fetchCampaignDetailRequestNoAuth } from "src/redux/actions/campaign-noauth-actions";
import { CONFIG } from "src/global-config";

// ----------------------------------------------------------------------

export function CampaignLeadFormView({ id }) {
  const dispatch = useAppDispatch();
  const [decryptedId, setDecryptedId] = useState(null);

  const {
    campaignDetailNoAuth,
    isLoading: campaignDetailLoading,
    error: campaignDetailError,
  } = useAppSelector(selectCampaignNoAuthState);

  const { formTemplateDetail, isLoading: formTemplateDetailLoading } =
    useAppSelector(selectFormTemplateState);

  const {
    form_template_id,
    terms_and_conditions,
    organization,
    name,
    description,
  } = campaignDetailNoAuth || {};

  const { fields } = formTemplateDetail || {};

  const isLoading = campaignDetailLoading || formTemplateDetailLoading;

  const isLeadFormAvailable = !isLoading && !campaignDetailError;

  // const setOrganizationToken = () => {
  //   axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  // };

  // useEffect(() => {
  //   if (!isLogin) return;

  //   setOrganizationToken();
  // }, [isLogin]);

  // useEffect(() => {
  //   if (!id) return;

  //   async function decryptId() {
  //     try {
  //       const decodedId = decodeURIComponent(id);
  //       const decrypted = await decrypt(decodedId);
  //       if (decrypted) {
  //         setDecryptedId(decrypted);
  //       } else {
  //         console.error("Failed to decrypt campaign ID");
  //       }
  //     } catch (error) {
  //       console.error("Error while decrypting:", error);
  //     }
  //   }

  //   decryptId();
  // }, [id]);

  useEffect(() => {
    if (!id) return;
    dispatch(fetchCampaignDetailRequestNoAuth(id));

    // const getCampaignDetail = async () => {
    //   try {
    //     const response = await fetchCampaignDetailWithoutAuth(decryptedId);
    //     console.log("this is response from campaign detail", response);
    //   } catch (error) {
    //     console.error("Failed to fetch campaign detail:", error);
    //   }
    // };

    // getCampaignDetail();
  }, [id]);

  useEffect(() => {
    if (!form_template_id) return;

    dispatch(fetchFormTemplateDetailRequest(form_template_id));
  }, [form_template_id]);

  const renderLoading = () => <CampaignLeadFormSkeleton />;

  const renderLeadForm = () => (
    <>
      <Stack spacing={2}>
        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderTop: "8px solid #9c27b0",
          }}
        >
          <Stack spacing={3}>
            {/* Organization Branding */}
            {organization && (
              <Stack direction="column" alignItems="center" spacing={1}>
                {organization.logo_url && (
                  <Box
                    sx={{
                      width: 70,
                      height: 70,
                      borderRadius: "50%",
                      overflow: "hidden",
                      border: "2px dashed #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 1,
                    }}
                  >
                    <img
                      src={CONFIG.assetsDir + organization.logo_url}
                      alt={organization.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        objectPosition: "center",
                      }}
                    />
                  </Box>
                )}

                <Typography variant="subtitle1" fontWeight="bold">
                  {organization.name}
                </Typography>
              </Stack>
            )}
            <Box>
              <Typography variant="h4">{name}</Typography>

              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {description}
              </Typography>
            </Box>
            {formTemplateDetail?.featured_image && (
              <Box
                sx={{
                  width: "100%",
                  // borderRadius: 2,
                  // border: "1px solid",
                  // borderColor: "divider",
                  overflow: "auto",
                }}
              >
                <img
                  src={`${CONFIG.assetsDir}${formTemplateDetail.featured_image}`}
                  alt={formTemplateDetail.name}
                  style={{
                    maxWidth: 400,
                    width: "100%",
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}

            {/* <CampaignLeadForm
      campaignId={id}
      fields={fields || []}
      termsAndConditions={campaignDetailNoAuth?.terms_and_conditions}
      organization={campaignDetailNoAuth?.organization}
    /> */}
          </Stack>
        </Card>

        <Card
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderLeft: "8px solid #4285F4",
          }}
        >
          <Stack spacing={3}>
            <CampaignLeadForm
              campaignId={id}
              fields={fields || []}
              termsAndConditions={campaignDetailNoAuth?.terms_and_conditions}
              organization={campaignDetailNoAuth?.organization}
            />
          </Stack>
        </Card>
      </Stack>
    </>
  );

  return (
    <Container component="section" sx={{ mt: 5, mb: 10 }}>
      {isLoading && renderLoading()}

      {isLeadFormAvailable && renderLeadForm()}
    </Container>
  );
}
