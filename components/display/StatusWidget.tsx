import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";
import { getStatus } from "@openstatus/react";

export async function StatusWidget() {
  const t = useTranslations("Components.Display.StatusWidget");
  const res = await getStatus("undrstnd");

  const { status } = res;

  const getStatusLevel = (level: string) => {
    return {
      operational: {
        label: t("operational"),
        color: "bg-green-500",
        color2: "bg-green-400",
      },
      degraded_performance: {
        label: t("degraded-performance"),
        color: "bg-yellow-500",
        color2: "bg-yellow-400",
      },
      partial_outage: {
        label: t("partial-outage"),
        color: "bg-yellow-500",
        color2: "bg-yellow-400",
      },
      major_outage: {
        label: t("major-outage"),
        color: "bg-red-500",
        color2: "bg-red-400",
      },
      unknown: {
        label: t("unknown"),
        color: "bg-gray-500",
        color2: "bg-gray-400",
      },
      incident: {
        label: t("incident"),
        color: "bg-yellow-500",
        color2: "bg-yellow-400",
      },
      under_maintenance: {
        label: t("under-maintenance"),
        color: "bg-gray-500",
        color2: "bg-gray-400",
      },
    }[level];
  };

  const level = getStatusLevel(status)!;

  return (
    <a
      className="flex justify-between items-center w-full"
      href="https://undrstnd.openstatus.dev"
      target="_blank"
      rel="noreferrer"
    >
      <div>
        <p className="text-sm">{level.label}</p>
      </div>

      <span className="relative ml-auto flex h-2 w-2">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            level.color2
          )}
        />
        <span
          className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            level.color
          )}
        />
      </span>
    </a>
  );
}
