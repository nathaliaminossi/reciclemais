import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./components/app-sidebar"
import { NavLink, Outlet } from "react-router"
import { BookOpen, Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { navigationItems } from "../src/types/Navigation"
import { Link } from "react-router"
import { ModeToggle } from "./components/mode-toggle"
import { Button } from "./components/ui/button"
import { UserMenu } from "./components/userMenu";
import LogoR from './imgs/logo.png'



export default function Layout() {
  return (
    <SidebarProvider>
      <main className="h-full w-full">
       <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200">
  <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

    {/* Logo */}
    <div className="flex items-center gap-3">
<img
   src={LogoR}
   className="h-14 w-auto object-contain"
/>
      <div>
        <h1 className="font-display text-xl font-bold text-green-700">
          Recicle+
        </h1>
        <p className="text-xs text-zinc-500">
          Sustentabilidade inteligente
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

      <ModeToggle />

      <UserMenu />

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
