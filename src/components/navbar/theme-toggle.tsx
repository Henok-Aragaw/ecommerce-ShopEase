import React from "react";
import { useDispatch } from "react-redux";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

interface Props {
  dark: boolean;
}

export const ThemeToggle: React.FC<Props> = ({ dark }) => {
  const dispatch = useDispatch();
  return (
    <Button variant="ghost" onClick={() => dispatch(toggleTheme())} className={`p-2.5 rounded-lg transition-all duration-300 ${dark ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"}`}>
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 transition-all duration-300 ${dark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`} />
        <Moon className={`absolute inset-0 transition-all duration-300 ${dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`} />
      </div>
    </Button>
  );
};
