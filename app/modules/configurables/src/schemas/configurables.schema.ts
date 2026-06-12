/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 150,
    },
    {
      fieldName: "heroTitle",
      type: "string",
      required: false,
      label: "Hero Title",
      maxLength: 100,
    },
    {
      fieldName: "heroSubtitle",
      type: "string",
      required: false,
      label: "Hero Subtitle",
      maxLength: 200,
    },
    {
      fieldName: "ctaLabel",
      type: "string",
      required: false,
      label: "CTA Button Label",
      maxLength: 50,
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "scoreLabels",
      type: "object",
      required: false,
      label: "Score Labels",
      fields: [
        { fieldName: "high", type: "string", required: false, label: "High Score Label" },
        { fieldName: "medium", type: "string", required: false, label: "Medium Score Label" },
        { fieldName: "low", type: "string", required: false, label: "Low Score Label" },
      ],
    },
    {
      fieldName: "maxSessionsPerPage",
      type: "number",
      required: false,
      label: "Sessions Per Page",
      min: 5,
      max: 50,
    },
    {
      fieldName: "enablePublicSignup",
      type: "boolean",
      required: false,
      label: "Enable Public Signup",
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
      maxLength: 200,
    },
  ],
};