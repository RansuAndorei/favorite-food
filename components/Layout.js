import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import AuthModal from "./AuthModal";
import DetailsModal from "./DetailsModal";
import { Menu, Transition } from "@headlessui/react";
import {
  HeartIcon,
  CakeIcon,
  LogoutIcon,
  PlusIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";

const menuItems = [
  {
    label: "List a new food",
    icon: PlusIcon,
    href: "/create",
  },
  {
    label: "My foods",
    icon: CakeIcon,
    href: "/my-foods",
  },
  {
    label: "Favorites",
    icon: HeartIcon,
    href: "/favorites",
  },
  {
    label: "Logout",
    icon: LogoutIcon,
    onClick: () => signOut(),
  },
];

const Layout = ({ children = null }) => {
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoadingUser = status === "loading";

  const router = useRouter();

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  return (
    <>
      <Head>
        <title>FavoriteFoods</title>
        <meta
          name="title"
          content="Learn how to Build a Fullstack App with Next.js, PlanetScale & Prisma"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col min-h-screen">
        <header className="w-full h-16 shadow-md">
          <div className="container h-full mx-auto">
            <div className="flex items-center justify-between h-full px-4 space-x-4">
              <Link href="/">
                <a className="flex items-center space-x-1">
                  <CakeIcon className="w-8 h-8 shrink-0 text-rose-500" />
                  <span className="text-xl font-semibold tracking-wide">
                    Favorite<span className="text-rose-600">Foods</span>
                  </span>
                </a>
              </Link>
              <div className="flex items-center space-x-4">
                <button
                  id="addFoodButton"
                  onClick={() => {
                    session?.user ? router.push("/create") : openModal();
                  }}
                  className="hidden px-3 py-1 transition rounded-md sm:block hover:bg-gray-200"
                >
                  <a className="hidden px-3 py-1 transition rounded-md sm:block hover:bg-gray-200">
                    List your Favorite Food
                  </a>
                </button>
                {isLoadingUser ? (
                  <div className="h-8 w-[75px] bg-gray-200 animate-pulse rounded-md" />
                ) : user ? (
                  <Menu as="div" className="relative z-50">
                    <Menu.Button className="flex items-center space-x-px group">
                      <div
                        className="relative flex items-center justify-center overflow-hidden bg-gray-200 rounded-full shrink-0 w-9 h-9"
                        id="dropdown"
                      >
                        {user?.image ? (
                          <Image
                            src={user?.image}
                            alt={user?.name || "Avatar"}
                            layout="fill"
                          />
                        ) : (
                          <UserIcon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <ChevronDownIcon className="w-5 h-5 text-gray-500 shrink-0 group-hover:text-current" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 mt-1 overflow-hidden origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg w-72 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="flex items-center px-4 py-4 mb-2 space-x-2">
                          <div className="relative flex items-center justify-center overflow-hidden bg-gray-200 rounded-full shrink-0 w-9 h-9">
                            {user?.image ? (
                              <Image
                                src={user?.image}
                                alt={user?.name || "Avatar"}
                                layout="fill"
                              />
                            ) : (
                              <UserIcon className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex flex-col truncate">
                            <span>{user?.name}</span>
                            <span className="text-sm text-gray-500">
                              {user?.email}
                            </span>
                          </div>
                        </div>

                        <div className="py-2">
                          {menuItems.map(
                            ({ label, href, onClick, icon: Icon }) => (
                              <div
                                key={label}
                                className="px-2 last:border-t last:pt-2 last:mt-2"
                                id={label}
                              >
                                <Menu.Item>
                                  {href ? (
                                    <Link href={href}>
                                      <a className="flex items-center px-4 py-2 space-x-2 rounded-md hover:bg-gray-100">
                                        <Icon className="w-5 h-5 text-gray-500 shrink-0" />
                                        <span>{label}</span>
                                      </a>
                                    </Link>
                                  ) : (
                                    <button
                                      className="flex items-center w-full px-4 py-2 space-x-2 rounded-md hover:bg-gray-100"
                                      onClick={onClick}
                                      id="dropDown"
                                    >
                                      <Icon className="w-5 h-5 text-gray-500 shrink-0" />
                                      <span>{label}</span>
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            )
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <button
                    id="loginButton"
                    type="button"
                    onClick={openModal}
                    className="px-4 py-1 ml-4 text-white transition rounded-md bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-4 focus:ring-rose-500 focus:ring-opacity-50"
                  >
                    Log in
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="container flex-grow mx-auto">
          <div className="px-4 py-12">
            {typeof children === "function" ? children(openModal) : children}
          </div>
        </main>

        <AuthModal show={showModal} onClose={closeModal} />
        {session && !session.user.username && <DetailsModal show={true} />}
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
};

export default Layout;
