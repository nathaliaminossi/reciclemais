import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { NavLink, Outlet } from "react-router"
import { BookOpen, Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { navigationItems } from "../src/types/Navigation"
import { Link } from "react-router"
import { ModeToggle } from "./components/mode-toggle"
import { Button } from "./components/ui/button"
import { UserMenu } from "./components/userMenu";
import LogoR from './imgs/logo2.png'



export default function Layout() {
  return (
    <SidebarProvider>
      <main className="h-full w-full">
        
<header className="sticky top-0 z-50 w-full">
<div
  className="
    mx-auto
    mt-4
    flex
    h-16
    max-w-7xl
    items-center
    justify-between
    rounded-2xl
    border
    border-border/60
    bg-background/80
    px-6
    backdrop-blur-xl
    shadow-lg
  "
>
    {/* Logo */}
    
    <div className="flex items-center gap-3">
<img
   src={LogoR}
   className="h-11 w-auto object-contain"
/>
      <div>
       <h1 className="font-display text-lg font-bold">
    Recicle+
</h1>

<p className="text-[11px] text-muted-foreground">
    Plataforma sustentável
</p>
      </div>
    </div>

    {/* Menu */}
    <nav className="hidden md:flex items-center gap-10">
      {navigationItems.map(({ title, url }) => (
       <NavLink
    to={url}
    className={({ isActive }) =>
        `relative text-sm uppercase tracking-wide transition
        ${
            isActive
                ? "text-green-700 font-semibold after:w-full"
                : "text-zinc-600 hover:text-green-700 after:w-0"
        }
        after:absolute after:left-0 after:-bottom-2
        after:h-[2px] after:bg-green-600 after:transition-all`
    }
>
    {title}
</NavLink>
      ))}
    </nav>

    {/* Direita */}
    <div className="flex items-center gap-3">
<ModeToggle/>

<div className="h-6 w-px bg-border"/>

<UserMenu/>

      <div className="md:hidden">
        <SidebarTrigger />
      </div>

    </div>
  </div>
</header>

        {/* SIDEBAR MOBILE */}
        <div className="md:hidden ">
          <AppSidebar />
        </div>

        <Outlet />
      </main>
    </SidebarProvider>
  )
}
