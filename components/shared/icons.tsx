import { type SVGProps } from "react"
import Image from "next/image"
import {
  AlertTriangle,
  ArchiveRestore,
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpDown,
  BookCopy,
  BookOpenText,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Command,
  Copy,
  CornerDownLeft,
  CreditCard,
  Download,
  EditIcon,
  ExternalLink,
  Eye,
  File,
  FileText,
  Github,
  Heart,
  HelpCircle,
  Home,
  ImageIcon,
  Laptop,
  LayoutDashboardIcon,
  Loader2,
  LoaderIcon,
  LucideIcon,
  MailIcon,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  MoreHorizontal,
  MoreVertical,
  PanelLeft,
  PanelRight,
  Paperclip,
  PencilIcon,
  PhoneIcon,
  Pizza,
  Plus,
  RefreshCw,
  Reply,
  RotateCcw,
  RotateCw,
  Search,
  Settings,
  Share,
  Share2,
  SlashIcon,
  SunMedium,
  ThumbsDown,
  ThumbsUp,
  Trash2Icon,
  TrashIcon,
  Upload,
  UserCircleIcon,
  UserCogIcon,
  X,
  XCircle,
} from "lucide-react"
import {
  AiFillBell,
  AiFillDatabase,
  AiFillFilePdf,
  AiFillMobile,
  AiFillQuestionCircle,
  AiFillWechat,
} from "react-icons/ai"
import { FaRegLightbulb, FaSurprise } from "react-icons/fa"
import { FaHandsClapping } from "react-icons/fa6"
import { GoSignOut } from "react-icons/go"
import { TiTick } from "react-icons/ti"

export type Icon = LucideIcon

function ChevronUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function LogoPNG(
  { className }: { className?: string } = { className: "" }
) {
  return (
    <Image
      src="/images/logos/Rounded.png"
      alt="Undrstnd Logo"
      width={798}
      height={798}
      className={className}
    />
  )
}

export function LogoText(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 659.66 191.16" {...props}>
      <g id="Layer_1">
        <circle
          cx="85.59"
          cy="102.92"
          r="79.59"
          fill="#0ea5e9"
          stroke="#0ea5e9"
          strokeMiterlimit="10"
          strokeWidth="12"
        />
        <text
          transform="translate(29.39 97.27) rotate(45) scale(.86 1)"
          fill="#0ea5e9"
          fontFamily="MyriadPro-Regular, 'Myriad Pro'"
          fontSize="164.35"
        >
          <tspan x="0" y="0">
            U
          </tspan>
        </text>
        <path
          d="m85.68,25.59h45.78v91.46c0,12.63-10.26,22.89-22.89,22.89h0c-12.63,0-22.89-10.26-22.89-22.89V25.59h0Z"
          transform="translate(90.32 -52.53) rotate(45)"
          fill="#111827"
        />
      </g>
      <g id="Layer_2">
        <text
          transform="translate(250.34 144.06)"
          fill="#f2f2f2"
          fontFamily="Roboto-Medium, Roboto"
          fontSize="100"
          fontWeight="500"
        >
          <tspan x="0" y="0">
            Undrstnd
          </tspan>
        </text>
      </g>
    </svg>
  )
}

export const Icons = {
  logo: Command,
  menu: Menu,
  close: X,
  spinner: Loader2,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash2Icon,
  post: FileText,
  page: File,
  media: ImageIcon,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: UserCircleIcon,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  search: Search,
  gitHub: Github,
  twitter: X,
  check: Check,
  orderbook: BookOpenText,
  pdf: AiFillFilePdf,
  chat: AiFillWechat,
  storage: AiFillDatabase,
  questions: AiFillQuestionCircle,
  notifications: AiFillBell,
  mobile: AiFillMobile,
  chevronsUpDown: ChevronsUpDown,
  phone: PhoneIcon,
  mail: MailIcon,
  pencil: PencilIcon,
  student: PencilIcon,
  teacher: UserCogIcon,
  monitor: Monitor,
  moreHorizontal: MoreHorizontal,
  editClassroom: EditIcon,
  archiveClassroom: ArchiveRestore,
  deleteClassroom: TrashIcon,
  download: Download,
  copy: Copy,
  arrowDown: ArrowDown,
  ArrowUpDown: ArrowUpDown,
  refresh: RefreshCw,
  share: Share,
  stop: XCircle,
  enter: CornerDownLeft,
  slash: SlashIcon,
  panelLeft: PanelLeft,
  panelRight: PanelRight,
  leaveClassroom: GoSignOut,
  shareClassroom: Share2,
  shareClassroomTaked: TiTick,
  watchFile: Eye,
  downloadFile: ArrowDownToLine,
  replyComment: Reply,
  reactionLike: ThumbsUp,
  reactionDislike: ThumbsDown,
  reactionLove: Heart,
  reactionApplause: FaHandsClapping,
  reactionWow: FaSurprise,
  reactionInsightul: FaRegLightbulb,
  upload: Upload,
  paperclip: Paperclip,
  down: ChevronDown,
  up: ChevronUp,
  rotateCw: RotateCw,
  rotateCcw: RotateCcw,
  external: ExternalLink,
  home: Home,
  books: BookCopy,
  messages: MessageSquare,
  dashboard: LayoutDashboardIcon,
  chevronUp: ChevronUpIcon,
}
