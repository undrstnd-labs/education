import { Heart, ThumbsDown, ThumbsUp } from "lucide-react"
import { FaRegLightbulb, FaSurprise } from "react-icons/fa"
import { FaHandsClapping } from "react-icons/fa6"

export const emojis = [
  { Icon: ThumbsUp, color: "#2033ff", value: "LIKE" },
  { Icon: ThumbsDown, color: "#f70808", value: "DISLIKE" },
  { Icon: Heart, color: "#ff2f64", value: "LOVE" },
  { Icon: FaHandsClapping, color: "#f4e07b", value: "APPLAUSE" },
  { Icon: FaSurprise, color: "#dab218", value: "WOW" },
  { Icon: FaRegLightbulb, color: "#9d18af", value: "INSIGHTFUL" },
]
