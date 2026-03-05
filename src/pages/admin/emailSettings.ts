export type AdminEmailSettings = {
  senderGmail: string;
  subjectTemplate: string;
  bodyTemplate: string;
};

export const SETTINGS_STORAGE_KEY = "adminEmailSettings";

export const defaultAdminEmailSettings: AdminEmailSettings = {
  senderGmail: "",
  subjectTemplate: "Your Doctor Portal Login Credentials",
  bodyTemplate:
    "Hello Dr. {{doctorName}},\n\nYour account has been created.\nUsername: {{username}}\nPassword: {{password}}\n\nPlease log in and change your password after first login.\n\nRegards,\nAdmin"
};

export const getAdminEmailSettings = (): AdminEmailSettings => {
  try {
    const rawSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!rawSettings) {
      return defaultAdminEmailSettings;
    }

    const parsedSettings = JSON.parse(rawSettings) as Partial<AdminEmailSettings>;

    return {
      senderGmail: parsedSettings.senderGmail ?? defaultAdminEmailSettings.senderGmail,
      subjectTemplate: parsedSettings.subjectTemplate ?? defaultAdminEmailSettings.subjectTemplate,
      bodyTemplate: parsedSettings.bodyTemplate ?? defaultAdminEmailSettings.bodyTemplate
    };
  } catch {
    return defaultAdminEmailSettings;
  }
};
