import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"

export function Toaster({ ...props }) {
  return (
    <ToastPrimitives.Provider>
      <ToastPrimitives.Viewport />
    </ToastPrimitives.Provider>
  )
}
