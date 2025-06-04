"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlay = React.forwardRef(function AlertDialogOverlay(props, ref) {
  return (
    <AlertDialogPrimitive.Overlay
      ref={ref}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      {...props}
    />
  );
});

const AlertDialogContent = React.forwardRef(function AlertDialogContent(props, ref) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 grid w-full max-w-lg scale-100 gap-4 border bg-white p-6 shadow-lg sm:rounded-lg",
          "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
        )}
        {...props}
      />
    </AlertDialogPortal>
  );
});

const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);

const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

const AlertDialogTitle = React.forwardRef(function AlertDialogTitle(props, ref) {
  return (
    <AlertDialogPrimitive.Title
      ref={ref}
      className="text-lg font-semibold text-gray-900"
      {...props}
    />
  );
});

const AlertDialogDescription = React.forwardRef(function AlertDialogDescription(props, ref) {
  return (
    <AlertDialogPrimitive.Description
      ref={ref}
      className="text-sm text-gray-500"
      {...props}
    />
  );
});

const AlertDialogAction = React.forwardRef(function AlertDialogAction(props, ref) {
  return (
    <AlertDialogPrimitive.Action
      ref={ref}
      className={cn(buttonVariants())}
      {...props}
    />
  );
});

const AlertDialogCancel = React.forwardRef(function AlertDialogCancel(props, ref) {
  return (
    <AlertDialogPrimitive.Cancel
      ref={ref}
      className={cn(buttonVariants({ variant: "outline" }))}
      {...props}
    />
  );
});

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
