import { TranslationFunction, EmailOption } from "@/types";

export function getEmailOptions(t: TranslationFunction): EmailOption[] {
  return [
    {
      label: t("options.isimm"),
      abbrev: "ISIMM",
      value: "@isimm.edu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ISIMM",
    },
    {
      label: t("options.ensi"),
      abbrev: "ENSI",
      value: "@ensi.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ENSI",
    },
    {
      label: t("options.insat"),
      abbrev: "INSAT",
      value: "@insat.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=INSAT",
    },
    {
      label: t("options.fst"),
      abbrev: "FST",
      value: "@fst.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=FST",
    },
    {
      label: t("options.ipeit"),
      abbrev: "IPEIT",
      value: "@ipeit.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=IPEIT",
    },
    {
      label: t("options.ihec"),
      abbrev: "IHEC",
      value: "@ihec.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=IHEC",
    },
    {
      label: t("options.ipeis"),
      abbrev: "IPEIS",
      value: "@ipeis.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=IPEIS",
    },
    {
      label: t("options.ipest"),
      abbrev: "IPEST",
      value: "@ipest.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=IPEST",
    },
    {
      label: t("options.iset"),
      abbrev: "ISET",
      value: "@iset.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ISET",
    },
    {
      label: t("options.isetn"),
      abbrev: "ISETN",
      value: "@isetn.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ISETN",
    },
    {
      label: t("options.issatso"),
      abbrev: "ISSATSO",
      value: "@issatso.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ISSATSO",
    },
    {
      label: t("options.esstt"),
      abbrev: "ESSTT",
      value: "@esstt.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ESSTT",
    },
    {
      label: t("options.enit"),
      abbrev: "ENIT",
      value: "@enit.rnu.tn",
      avatarUrl: "https://placehold.co/600x400?text=ENIT",
    },
  ];
}
