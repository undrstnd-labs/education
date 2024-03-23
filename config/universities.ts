import { TranslationFunction, EmailOption } from "@/types";

// #TODO: Create an API & NPM package for list of universities
export function getEmailOptions() {
  return [
    "isimm.u-monastir.tn",
    "ensi.rnu.tn",
    "insat.rnu.tn",
    "fst.rnu.tn",
    "ipeit.rnu.tn",
    "ihec.rnu.tn",
    "ipeis.rnu.tn",
    "ipest.rnu.tn",
    "iset.rnu.tn",
    "isetn.rnu.tn",
    "issatso.rnu.tn",
    "esstt.rnu.tn",
    "enit.rnu.tn",
  ];
}

export function getTranslatedEmailOptions(
  t: TranslationFunction
): EmailOption[] {
  return [
    {
      label: t("options.isimm"),
      abbrev: "ISIMM",
      value: "isimm.u-monastir.tn",
      email: "mail@isimm.com",
      phone: "+216 73 460 000",
      avatarUrl: "https://placehold.co/600x400?text=ISIMM",
    },
    {
      label: t("options.ensi"),
      abbrev: "ENSI",
      value: "ensi.rnu.tn",
      email: "mail@ensi.com",
      phone: "+216 71 600 000",
      avatarUrl: "https://placehold.co/600x400?text=ENSI",
    },
    {
      label: t("options.insat"),
      abbrev: "INSAT",
      value: "insat.rnu.tn",
      email: "mail@insat.com",
      phone: "+216 71 600 000",
      avatarUrl: "https://placehold.co/600x400?text=INSAT",
    },
    {
      label: t("options.fst"),
      abbrev: "FST",
      value: "fst.rnu.tn",
      email: "mail@fst.com",
      phone: "+216 71 600 000",
      avatarUrl: "https://placehold.co/600x400?text=FST",
    },
    {
      label: t("options.ipeit"),
      abbrev: "IPEIT",
      value: "ipeit.rnu.tn",
      email: "mail@epit.com",
      phone: "+216 71 600 000",
      avatarUrl: "https://placehold.co/600x400?text=IPEIT",
    },
    {
      label: t("options.ihec"),
      abbrev: "IHEC",
      value: "ihec.rnu.tn",
      email: "mail@ihec.com",
      phone: "+216 71 600 000",
      avatarUrl: "https://placehold.co/600x400?text=IHEC",
    },
    {
      label: t("options.ipeis"),
      abbrev: "IPEIS",
      value: "ipeis.rnu.tn",
      email: "mail@ipeis.com",
      phone: "+216 71 600 000",
      avatarUrl: "https://placehold.co/600x400?text=IPEIS",
    },
    {
      label: t("options.ipest"),
      abbrev: "IPEST",
      value: "ipest.rnu.tn",
      email: "mail@ipest.com",
      phone: "+216 71 600 000",
      avatarUrl: "https://placehold.co/600x400?text=IPEST",
    },
    {
      label: t("options.iset"),
      abbrev: "ISET",
      value: "iset.rnu.tn",
      phone: "+216 71 600 000",
      email: "mail@iset.com",
      avatarUrl: "https://placehold.co/600x400?text=ISET",
    },
    {
      label: t("options.isetn"),
      abbrev: "ISETN",
      value: "isetn.rnu.tn",
      phone: "+216 71 600 000",
      email: "mail@isetn.com",
      avatarUrl: "https://placehold.co/600x400?text=ISETN",
    },
    {
      label: t("options.issatso"),
      abbrev: "ISSATSO",
      value: "issatso.rnu.tn",
      phone: "+216 71 600 000",
      email: "issatso@mail.com",
      avatarUrl: "https://placehold.co/600x400?text=ISSATSO",
    },
    {
      label: t("options.esstt"),
      abbrev: "ESSTT",
      value: "esstt.rnu.tn",
      phone: "+216 71 600 000",
      email: "mail@esstt.com",
      avatarUrl: "https://placehold.co/600x400?text=ESSTT",
    },
    {
      label: t("options.enit"),
      abbrev: "ENIT",
      value: "enit.rnu.tn",
      phone: "+216 71 600 000",
      email: "enit@mail.com",
      avatarUrl: "https://placehold.co/600x400?text=ENIT",
    },
  ];
}

export function fetchUniversityData({
  email,
  t,
}: {
  email: string;
  t: TranslationFunction;
}): EmailOption {
  return getTranslatedEmailOptions(t).find((option) => option.value === email)!;
}
