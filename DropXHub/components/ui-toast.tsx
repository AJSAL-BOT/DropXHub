"use client"
import { useToast as useToastHook } from "@/hooks/use-toast"

import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToastHook()

  return (
    <ToastProvider>
      {toasts.map(({ ...props }) => (
        <Toast key={props.id} {...props}>
          <div className="grid gap-1">
            {props.title && <ToastTitle>{props.title}</ToastTitle>}
            {props.description && <ToastDescription>{props.description}</ToastDescription>}
          </div>
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}

