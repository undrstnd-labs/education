import { customType } from "@/lib/types";

import {
  DeviceNotificationIcon,
  DeviceTouchIcon,
  DeviceUserIcon,
} from "@/components/icons/Overall";

import {
  InviteScreen,
  StocksScreen,
  InvestScreen,
} from "@/components/sections/easy-steps/Screens";

export const PrimaryFeaures = {
  maxZIndex: 2147483647,
  features: [
    {
      name: "Upload and Dynamic View of Your Document",
      description:
        "Upload your documents and immediately experience dynamic viewing. Our platform transforms the way you interact with your documents, making your academic journey more engaging than ever.",
      icon: DeviceUserIcon,
      screen: InviteScreen,
    },
    {
      name: "Instant Document Messaging",
      description:
        "As soon as your document finishes uploading, start a real-time conversation.",
      icon: DeviceNotificationIcon,
      screen: StocksScreen,
    },
    {
      name: "Unlimited Document Storage and Chat",
      description:
        "Store and chat without limits. Enjoy limitless document storage and instant communication at your convenience.",
      icon: DeviceTouchIcon,
      screen: InvestScreen,
    },
  ],
  headerAnimation: {
    initial: { opacity: 0, transition: { duration: 0.3 } },
    animate: { opacity: 1, transition: { duration: 0.3, delay: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  },
  bodyAnimation: {
    initial: "initial",
    animate: "animate",
    exit: "exit",
    variants: {
      initial: (custom: customType) =>
        custom.isForwards
          ? PrimaryFeaures.bodyVariantForwards(custom)
          : PrimaryFeaures.bodyVariantBackwards,
      animate: (custom: customType) => ({
        y: "0%",
        opacity: 1,
        scale: 1,
        zIndex: PrimaryFeaures.maxZIndex / 2 - custom.changeCount,
        filter: "blur(0px)",
        transition: { duration: 0.4 },
      }),
      exit: (custom: customType) =>
        custom.isForwards
          ? PrimaryFeaures.bodyVariantBackwards
          : PrimaryFeaures.bodyVariantForwards(custom),
    },
  },
  bodyVariantForwards: (custom: customType) => ({
    y: "100%",
    zIndex: PrimaryFeaures.maxZIndex - custom.changeCount,
    transition: { duration: 0.4 },
  }),
  bodyVariantBackwards: {
    opacity: 0.4,
    scale: 0.8,
    zIndex: 0,
    filter: "blur(4px)",
    transition: { duration: 0.4 },
  },
};
