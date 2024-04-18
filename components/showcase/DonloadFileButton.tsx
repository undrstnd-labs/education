"use client";

import { downloadFileFromUrl } from "@/lib/storage";
import { DropdownMenuItem } from "../ui/DropdownMenu";
import { Icons } from "../icons/Lucide";
import { useTranslations } from "next-intl";
import { File } from "@prisma/client";

interface FileCardProps {
  file: File;
}

const DonloadFileButton = ({ file }: FileCardProps) => {
  const t = useTranslations("Pages.Classroom");
  return (
    <DropdownMenuItem
      className="flex items-center gap-2 hover:cursor-pointer"
      onClick={() => downloadFileFromUrl(file.url)}
    >
      <Icons.downloadFile className="h-4 w-4" /> {t("downloadFile")}
    </DropdownMenuItem>
  );
};

export default DonloadFileButton;
