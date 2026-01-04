import * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  homeHref?: string
  separator?: React.ReactNode
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ className, items, homeHref = "/", separator, ...props }, ref) => {
    const Separator = separator || <ChevronRight size={16} className="text-gray-500" />
    
    return (
      <nav
        ref={ref}
        aria-label="Breadcrumb"
        className={cn("flex items-center space-x-2 text-sm", className)}
        {...props}
      >
        <Link
          href={homeHref}
          className="text-gray-400 hover:text-[#FF0000] transition-colors duration-250 flex items-center"
          aria-label="Home"
        >
          <Home size={16} />
        </Link>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          
          return (
            <React.Fragment key={index}>
              <span className="text-gray-500" aria-hidden="true">
                {Separator}
              </span>
              {isLast ? (
                <span className="text-white font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-[#FF0000] transition-colors duration-250"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-400">{item.label}</span>
              )}
            </React.Fragment>
          )
        })}
      </nav>
    )
  }
)
Breadcrumb.displayName = "Breadcrumb"

export { Breadcrumb }
