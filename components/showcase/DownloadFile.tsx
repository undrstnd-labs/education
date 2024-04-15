"use client";

import { downloadFileFromUrl } from "@/lib/storage";
import { DropdownMenuItem } from "../ui/DropdownMenu";
import { Icons } from "../icons/Lucide";
import { useTranslations } from "next-intl";

interface DownloadFileProps {
  fileUrl: string;
}

const DownloadFile = ({ fileUrl }: DownloadFileProps) => {
  const t = useTranslations("Pages.Classroom");
  return (
    <DropdownMenuItem
      className="flex gap-2 items-center hover:cursor-pointer"
      onClick={() => downloadFileFromUrl(fileUrl)}
    >
      <Icons.downloadFile className="h-4 w-4" /> {t("downloadFile")}
    </DropdownMenuItem>
  );
};

export default DownloadFile;
