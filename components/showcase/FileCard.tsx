import { File } from "@prisma/client";
import { Card } from "../ui/Card";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Button } from "../ui/Button";
import { Icons } from "../icons/Lucide";
import DownloadFile from "./DownloadFile";
import { useTranslations } from "next-intl";

interface FileCardProps {
  file: File;
}

const FileCard = ({ file }: FileCardProps) => {
  const t = useTranslations("Pages.Classroom");
  return (
    <Card className="mt-2">
      <div className=" flex flex-col p-2 gap-3 group">
        <Link
          href={`https://owevajnqzufpffslceev.supabase.co/storage/v1/object/public/files/${file.url}`}
        >
          <div
            className="bg-cover bg-center bg-no-repeat w-full h-[120px] rounded-[20px]"
            style={{
              backgroundImage: `url(${
                file.type.startsWith("image/")
                  ? "https://placehold.co/600x230?text=Image"
                  : file.type.includes("application/pdf")
                    ? "https://placehold.co/600x220?text=PDF"
                    : ""
              })`,
            }}
          />
        </Link>
        <div className="flex  justify-between px-2 items-center">
          <div className="flex flex-col gap-1 max-w-[80%]">
            <Link
              href={`https://owevajnqzufpffslceev.supabase.co/storage/v1/object/public/files/${file.url}`}
            >
              <div
                className="text-xs xl:text-sm text-foreground font-semibold truncate
               hover:underline hover:underline-offset-2 group-hover:underline group-hover:underline-offset-2"
              >
                {file.name}
              </div>
            </Link>
            <div className="text-foreground text-xs font-medium">
              {(file.size / (1024 * 1024)).toFixed(2)}{" "}
              <span className="text-lime-900">MB</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 max-sm:h-6 max-sm:w-6"
              >
                <Icons.moreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle options of File</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("fileOptions")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link
                href={`https://owevajnqzufpffslceev.supabase.co/storage/v1/object/public/files/${file.url}`}
              >
                <DropdownMenuItem className="flex gap-2 items-center hover:cursor-pointer">
                  <Icons.watchFile className="h-4 w-4" /> {t("fileCardSeeFile")}
                </DropdownMenuItem>
              </Link>
              <DownloadFile fileUrl={file.url} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </Card>
  );
};

export default FileCard;
