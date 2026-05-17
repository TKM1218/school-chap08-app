export type ContactPayload = {
  name: string;
  email: string;
  content: string;
};

export type ContactResponse = {
  message: string;
  data: ContactPayload;
};
