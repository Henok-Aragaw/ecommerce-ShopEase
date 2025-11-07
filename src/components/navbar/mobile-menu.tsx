import React from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Heart } from "lucide-react";
import { Product } from "@/types/product";
import { ThemeToggle } from "./theme-toggle";
import Image from "next/image";

interface Props {
  dark: boolean;
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
}

export const MobileMenu: React.FC<Props> = ({ dark, menuOpen, setMenuOpen }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
  };

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ${
        menuOpen ? "max-h-[90vh] opacity-100" : "max-h-0 opacity-0"
      } ${dark ? "bg-gray-950 border-t border-gray-800" : "bg-white border-t border-gray-200"}`}
    >
      <div className="px-4 py-4 space-y-4">
       
        <Link
          href="/products"
          className={`block text-sm font-medium transition-all duration-300 py-2 px-3 rounded-lg ${
            dark
              ? "text-gray-300 hover:text-white hover:bg-gray-800"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Products
        </Link>

       
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full flex items-center justify-start gap-2 p-2 rounded-lg transition-all duration-300 ${
                dark
                  ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Favorites</span>
              {Object.keys(favorites).length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {Object.keys(favorites).length}
                </span>
              )}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className={`w-80 sm:w-96 transition-colors ${
              dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
            }`}
          >
            <SheetHeader>
              <SheetTitle className="text-lg font-bold">Your Favorites</SheetTitle>
            </SheetHeader>

            <div className="mt-4 space-y-4 overflow-y-auto max-h-[75vh]">
              {Object.values(favorites).length === 0 ? (
                <p
                  className={`text-center mt-10 ${
                    dark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  No favorites yet
                </p>
              ) : (
                Object.values(favorites).map((item: Product) => (
                  <SheetClose asChild key={item.id}>
                    <Link
                      href={`/products/${item.id}`}
                      className={`flex items-center gap-3 p-2 rounded-md transition-all ${
                        dark
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Image
                        src={item.thumbnail!}
                        alt={item.title}
                        className="w-12 h-12 rounded-md object-cover"
                      />
                      <div>
                        <p
                          className={`font-semibold ${
                            dark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p
                          className={`text-sm ${
                            dark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          ${item.price}
                        </p>
                      </div>
                    </Link>
                  </SheetClose>
                ))
              )}
            </div>
          </SheetContent>
        </Sheet>

        
        {auth.token ? (
          <div className="flex flex-col gap-2 mt-2">
            <span
              className={`text-sm font-medium ${
                dark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Hi, {auth.user?.name || "User"}
            </span>
            <Button
              variant="default"
              onClick={handleLogout}
              className={`w-full text-sm px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                dark
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-red-500 text-white hover:bg-red-600"
              } flex items-center justify-center gap-2`}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/sign-in">
            <Button
              className={`w-full text-sm px-4 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                dark
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Button>
          </Link>
        )}

       
        <div className="pt-2 border-t mt-2 border-gray-300 dark:border-gray-700">
          <ThemeToggle dark={dark} />
        </div>
      </div>
    </div>
  );
};
