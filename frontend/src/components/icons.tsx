import {
  Loader2,
  Mail,
  ChevronLeft,
  ChevronRight,


  User,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  Menu,
  X,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

export const Icons = {
  spinner: Loader2,
  gitHub: (props: any) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),

  google: (props: any) => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.172-1.128 1.128-2.8 2.392-5.912 2.392-5.416 0-9.728-4.392-9.728-9.8s4.312-9.8 9.728-9.8c2.936 0 5.168 1.168 6.744 2.648l2.32-2.32C19.392 1.256 16.32 0 12.48 0 5.856 0 0 5.376 0 12s5.856 12 12.48 12c3.552 0 6.232-1.176 8.352-3.376 2.192-2.192 2.88-5.32 2.88-7.792 0-.768-.064-1.504-.192-2.208h-11.04z" />
    </svg>
  ),
  mail: Mail,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  user: User,
  settings: Settings,
  logout: LogOut,
  plus: Plus,
  search: Search,
  bell: Bell,
  menu: Menu,
  close: X,
  check: Check,
  error: AlertCircle,
  eye: Eye,
  eyeOff: EyeOff,
};
