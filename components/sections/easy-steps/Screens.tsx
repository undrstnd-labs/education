import { customType } from "@/types"
import { motion } from "framer-motion"

import { PrimaryFeaures } from "@/lib/consts"
import { cn } from "@/lib/utils"

import { AppScreen } from "@/components/icons/AppScreen"
import {
  DiageoLogo,
  LaravelLogo,
  MirageLogo,
  ReversableLogo,
  StatamicLogo,
  StaticKitLogo,
  TransistorLogo,
  TupleLogo,
} from "@/components/icons/StockLogos"

const MotionAppScreenHeader = motion(AppScreen.Header)
const MotionAppScreenBody = motion(AppScreen.Body)

export function InviteScreen({
  custom,
  animated = false,
}: {
  custom: customType
  animated: boolean
}) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader
        {...(animated ? PrimaryFeaures.headerAnimation : {})}
      >
        <AppScreen.Title>Invite people</AppScreen.Title>
        <AppScreen.Subtitle>
          Get tips <span className="text-white">5s sooner</span> for every
          invite.
        </AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody
        {...(animated ? { ...PrimaryFeaures.bodyAnimation, custom } : {})}
      >
        <div className="px-4 py-6">
          <div className="space-y-6">
            {[
              { label: "Full name", value: "Albert H. Wiggin" },
              { label: "Email address", value: "awiggin@chase.com" },
            ].map((field) => (
              <div key={field.label}>
                <div className="text-sm text-gray-500">{field.label}</div>
                <div className="mt-2 border-b border-gray-200 pb-2 text-sm text-gray-900">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-lg px-3 py-2 text-center text-sm font-semibold text-white">
            Invite person
          </div>
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  )
}

export function StocksScreen({
  custom,
  animated = false,
}: {
  custom: customType
  animated: boolean
}) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader
        {...(animated ? PrimaryFeaures.headerAnimation : {})}
      >
        <AppScreen.Title>Stocks</AppScreen.Title>
        <AppScreen.Subtitle>March 9, 2022</AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody
        {...(animated ? { ...PrimaryFeaures.bodyAnimation, custom } : {})}
      >
        <div className="divide-y divide-gray-100">
          {[
            {
              name: "Laravel",
              price: "4,098.01",
              change: "+4.98%",
              color: "#F9322C",
              logo: LaravelLogo,
            },
            {
              name: "Tuple",
              price: "5,451.10",
              change: "-3.38%",
              color: "#5A67D8",
              logo: TupleLogo,
            },
            {
              name: "Transistor",
              price: "4,098.41",
              change: "+6.25%",
              color: "#2A5B94",
              logo: TransistorLogo,
            },
            {
              name: "Diageo",
              price: "250.65",
              change: "+1.25%",
              color: "#3320A7",
              logo: DiageoLogo,
            },
            {
              name: "StaticKit",
              price: "250.65",
              change: "-3.38%",
              color: "#2A3034",
              logo: StaticKitLogo,
            },
            {
              name: "Statamic",
              price: "5,040.85",
              change: "-3.11%",
              color: "#0EA5E9",
              logo: StatamicLogo,
            },
            {
              name: "Mirage",
              price: "140.44",
              change: "+9.09%",
              color: "#16A34A",
              logo: MirageLogo,
            },
            {
              name: "Reversable",
              price: "550.60",
              change: "-1.25%",
              color: "#8D8D8D",
              logo: ReversableLogo,
            },
          ].map((stock) => (
            <div key={stock.name} className="flex items-center gap-4 px-4 py-3">
              <div
                className="flex-none rounded-full"
                style={{ backgroundColor: stock.color }}
              >
                <stock.logo className="size-10" />
              </div>
              <div className="flex-auto text-sm text-gray-900">
                {stock.name}
              </div>
              <div className="flex-none text-right">
                <div className="text-sm font-medium text-gray-900">
                  {stock.price}
                </div>
                <div
                  className={cn(
                    "text-xs leading-5",
                    stock.change.startsWith("+")
                      ? "text-sky-500"
                      : "text-gray-500"
                  )}
                >
                  {stock.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  )
}

export function InvestScreen({
  custom,
  animated = false,
}: {
  custom: customType
  animated: boolean
}) {
  return (
    <AppScreen className="w-full">
      <MotionAppScreenHeader
        {...(animated ? PrimaryFeaures.headerAnimation : {})}
      >
        <AppScreen.Title>Buy $LA</AppScreen.Title>
        <AppScreen.Subtitle>
          <span className="text-white">$34.28</span> per share
        </AppScreen.Subtitle>
      </MotionAppScreenHeader>
      <MotionAppScreenBody
        {...(animated ? { ...PrimaryFeaures.bodyAnimation, custom } : {})}
      >
        <div className="px-4 py-6">
          <div className="space-y-4">
            {[
              { label: "Number of shares", value: "100" },
              {
                label: "Current market price",
                value: (
                  <div className="flex">
                    $34.28
                    <svg viewBox="0 0 24 24" fill="none" className="size-6">
                      <path
                        d="M17 15V7H9M17 7 7 17"
                        stroke="#06B6D4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                ),
              },
              { label: "Estimated cost", value: "$3,428.00" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between border-b border-gray-100 pb-4"
              >
                <div className="text-sm text-gray-500">{item.label}</div>
                <div className="text-sm font-semibold text-gray-900">
                  {item.value}
                </div>
              </div>
            ))}
            <div className="rounded-lg px-3 py-2 text-center text-sm font-semibold text-white">
              Buy shares
            </div>
          </div>
        </div>
      </MotionAppScreenBody>
    </AppScreen>
  )
}
