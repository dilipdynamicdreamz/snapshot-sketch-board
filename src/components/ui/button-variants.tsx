import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

// Hero button with gradient and glow
export const HeroButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn(
      "bg-gradient-primary hover:shadow-glow transition-all duration-300",
      "border-0 font-medium text-white shadow-lg hover:scale-105",
      className
    )}
    {...props}
  >
    {children}
  </Button>
));

// Tool button for the editor
export const ToolButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & { active?: boolean }
>(({ className, active, children, ...props }, ref) => (
  <Button
    ref={ref}
    variant={active ? "default" : "secondary"}
    size="sm"
    className={cn(
      "h-10 w-10 p-0 transition-all duration-200",
      active && "bg-gradient-primary shadow-glow scale-105",
      !active && "hover:bg-secondary/80 hover:scale-105",
      className
    )}
    {...props}
  >
    {children}
  </Button>
));

// Floating action button
export const FloatingButton = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, children, ...props }, ref) => (
  <Button
    ref={ref}
    className={cn(
      "rounded-full shadow-floating hover:shadow-glow",
      "bg-gradient-primary hover:scale-110 transition-all duration-300",
      "border-0 text-white",
      className
    )}
    {...props}
  >
    {children}
  </Button>
));

HeroButton.displayName = "HeroButton";
ToolButton.displayName = "ToolButton";
FloatingButton.displayName = "FloatingButton";