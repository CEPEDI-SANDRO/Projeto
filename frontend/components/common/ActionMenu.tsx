"use client";

import { useEffect, useRef, useState } from "react";
import { Eye, MoreVertical, Pencil, Trash2 } from "lucide-react";

interface ActionMenuProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ActionMenu({
  onView,
  onEdit,
  onDelete,
}: ActionMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div className="relative flex justify-end" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="rounded-lg p-2 transition hover:bg-slate-100"
      >
        <MoreVertical className="h-5 w-5 text-slate-500" />
      </button>

      {open && (
        <div
          className="
            absolute
            right-0
            top-10
            z-50
            w-44
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-xl
            animate-in
            fade-in
            zoom-in-95
            duration-150
          "
        >
          {onView && (
            <MenuItem
              icon={<Eye size={17} />}
              label="Visualizar"
              onClick={() => {
                setOpen(false);
                onView();
              }}
            />
          )}

          {onEdit && (
            <MenuItem
              icon={<Pencil size={17} />}
              label="Editar"
              onClick={() => {
                setOpen(false);
                onEdit();
              }}
            />
          )}

          {onDelete && (
            <MenuItem
              danger
              icon={<Trash2 size={17} />}
              label="Excluir"
              onClick={() => {
                setOpen(false);
                onDelete();
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}

function MenuItem({
  icon,
  label,
  danger,
  onClick,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        w-full
        items-center
        gap-3
        px-4
        py-3
        text-sm
        transition
        ${
          danger
            ? "text-red-600 hover:bg-red-50"
            : "text-slate-700 hover:bg-slate-50"
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}