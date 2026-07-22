import { SidebarContent } from "./SidebarContent";

export function Sidebar() {
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col bg-[#151515] text-white lg:flex">
      <SidebarContent />
    </aside>
  );
}