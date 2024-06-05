type LucideReactionIcon = {
  Icon: LucideIcon
  color: string
  value: string
}

type ReactReactionIcon = {
  Icon: React.ComponentType<React.ComponentProps<typeof FaRegLightbulb>>
  color: string
  value: string
}

export type ReactionIcon = LucideReactionIcon | ReactReactionIcon
