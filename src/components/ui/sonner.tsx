"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-[#22C55E]" />,
        info: <InfoIcon className="size-4 text-[#3B82F6]" />,
        warning: <TriangleAlertIcon className="size-4 text-[#F59E0B]" />,
        error: <OctagonXIcon className="size-4 text-[#EF4444]" />,
        loading: <Loader2Icon className="size-4 animate-spin text-[#D97706]" />,
      }}
      toastOptions={{
        className: "font-mono text-sm",
        style: {
          background: "#252525",
          border: "1px solid #333",
          color: "#E5E5E5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
