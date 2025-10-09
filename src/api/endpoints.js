export const endpoints = {
  auth: {
    signIn: "login",
    signUp: "register",
    signOut: "logout",
    country: "country",
  },

  profile: {
    get: "organization/show",
    update: "organization/updateOrganization",
  },

  employee: {
    list: "/user",
    create: "user/store",
    detail: (id) => `user/show/${id}`,
    update: (id) => `user/update/${id}`,
  },

  campaign: {
    create: "campaign/store",
    list: "campaign",
    detail: (id) => `campaign/show/${id}`,
    authDetail: (id) => `lead-campaign/show/${id}`,
    update: (id) => `campaign/update/${id}`,
    sendEmail: "/campaign/send-email",
    sendSms: "/campaign/send-sms",
    exportLeadList: (id) => `campaigns/${id}/export`,
    exportLeadTemplate: (id) => `campaigns/${id}/lead-import-template`,
    importLeadList: (id) => `campaign/import-leads/${id}`,
  },

  telecommunication: {
    providers: "/telcos",
    dataPack: {
      ncell: "data-pack/ncell",
      ntc: "data-pack/ntc",
    },
    topUpAmount: "top-amount",
  },



  topUpAmount: "top-amount",

  formTemplate: {
    create: "form-template/store",
    list: "form-template",
    detail: (id) => `form-template/show/${id}`,
    update: (id) => `form-template/update/${id}`,
    validationRule: "validation-rule",
  },

  lead: {
    create: "lead/store",
    list: "lead",
    detail: (id) => `lead/show/${id}`,
    updateStatus: (id) => `lead/update-status/${id}`,
    createActivity: (id) => `lead/activity/store/${id}`,
    activityList: (id) => `lead/activity/${id}`,
    createNotes: (id) => `lead/note/store/${id}`,
    updateNotes: (id) => `lead/note/update/${id}`,
    rewardLeads: (id) => `lead/re-reward-lead/${id}`,
    followupLeads: (id) => `lead/followup/store/${id}`,
  },

  transaction: {
    list: "organization-transaction",
  },

  permission: {
    allPermission: "navigation-menu",
    currentUserPermission: "navigation-menu/permissions",
    selectedEmployeePermission: (id) =>
      `navigation-menu/user-permissions/${id}`,
    updateSelectedEmployeePermission: "navigation-menu/permissions/edit",
  },

  appointment: {
    list: "appointment",

    category: {
      create: "appointment-category/store",
      list: "appointment-category",
      detail: (id) => `appointment-category/show/${id}`,
      update: (id) => `appointment-category/update/${id}`,
    },

    timeSlot: {
      create: "appointment-slot/store",
      list: "appointment-slot",
      detail: (id) => `appointment-slot/show/${id}`,
      update: (id) => `appointment-slot/update/${id}`,
    },
  },

  creditLogs: {
    list: "organization-credit-log",
  },

  public: {
    key: "rsa/public-key",
  },

  siteSettings: {
    get: "site-setting",
  },

  hr:{
    nepaliDates:"nepali-date",
    attendance:"monthly-report"
  },
  reports:{
    teamReports:"report/team",
    transactions:"report/transaction",
    sms:"report/sms",
    topup:"report/topup",
    package:"report/package",
    credit:"report/credits",
  }
};
