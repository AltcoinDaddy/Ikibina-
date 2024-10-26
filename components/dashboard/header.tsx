import { ModeToggle } from "./mode-toggle";
import { Notifications } from "./notifications";
import { UserNav } from "./user-nav";


export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <Notifications />
          <UserNav />
        </div>
      </div>
    </header>
  )
}