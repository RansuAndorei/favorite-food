import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import { Formik, Form } from "formik";
import { Dialog, Transition } from "@headlessui/react";
import { CakeIcon } from "@heroicons/react/outline";
import Input from "./Input";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

const SignInSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  username: Yup.string().trim().required("Username is required"),
  password: Yup.string().trim().required("Password is required"),
});

const DetailsModal = ({ show = false, onClose = () => null }) => {
  const { data: session } = useSession();
  const [disabled, setDisabled] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const router = useRouter();

  const handleConfirm = async ({ name, username, password }) => {
    let toastId;
    try {
      toastId = toast.loading("Loading...");
      setDisabled(true);

      const user = await axios.patch(`/api/${session.user.id}`, {
        name,
        username,
        password,
      });
      router.reload();
      toast.dismiss(toastId);
    } catch (err) {
      toast.error("Unable to sign in", { id: toastId });
    } finally {
      setDisabled(false);
    }
  };

  const closeModal = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  // Reset modal
  useEffect(() => {
    if (!show) {
      // Wait for 200ms for aniamtion to finish
      setTimeout(() => {
        setDisabled(false);
        setConfirm(false);
        setShowSignIn(false);
      }, 200);
    }
  }, [show]);

  // Remove pending toasts if any
  useEffect(() => {
    toast.dismiss();
  }, []);

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-75" />

        <div className="min-h-screen text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-block w-full max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl sm:rounded-md">
              <div className="py-12">
                <div className="px-4 sm:px-12">
                  <div className="flex justify-center">
                    <Link href="/">
                      <a className="flex items-center space-x-1">
                        <CakeIcon className="w-8 h-8 shrink-0 text-rose-500" />
                        <span className="text-xl font-semibold tracking-wide">
                          Favorite<span className="text-rose-500">Foods</span>
                        </span>
                      </a>
                    </Link>
                  </div>

                  <Dialog.Title
                    as="h3"
                    className="mt-6 text-lg font-bold text-center sm:text-2xl"
                  >
                    {showSignIn ? "Welcome back!" : "Finish Account Setup"}
                  </Dialog.Title>

                  {!showSignIn ? (
                    <Dialog.Description className="mt-2 text-base text-center text-gray-500">
                      Please enter your account details.
                    </Dialog.Description>
                  ) : null}

                  <div className="mt-10">
                    <Formik
                      initialValues={{
                        name: session.user.name,
                        username: "",
                        password: "",
                      }}
                      validationSchema={SignInSchema}
                      validateOnBlur={false}
                      onSubmit={handleConfirm}
                    >
                      {({ isSubmitting, isValid, values, resetForm }) => (
                        <Form className="mt-4">
                          <Input
                            name="name"
                            type="text"
                            placeholder="Name"
                            disabled={disabled}
                            spellCheck={false}
                          />

                          <Input
                            name="username"
                            type="text"
                            placeholder="Username"
                            disabled={disabled}
                            spellCheck={false}
                            className="mt-1"
                          />

                          <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            disabled={disabled}
                            spellCheck={false}
                            className="mt-1"
                          />

                          <button
                            type="submit"
                            disabled={disabled || !isValid}
                            className="w-full px-8 py-2 mt-6 text-white transition rounded-md bg-rose-600 focus:outline-none focus:ring-4 focus:ring-rose-600 focus:ring-opacity-50 hover:bg-rose-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-rose-600"
                          >
                            {isSubmitting ? "Loading..." : "Confirm"}
                          </button>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

DetailsModal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default DetailsModal;
