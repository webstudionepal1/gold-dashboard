import { Constants } from "@/utils/constants";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import * as z from "zod";
import { useGetLoginMutation } from "../../server/api/authHooks";
export const FieldError = ({ field }: { field: any }) => {
  if (field.state.meta.errors.length > 0) {
    const error = field.state.meta.errors[0];
    // Handle the case where the error is an object
    const errorMessage =
      typeof error === "string"
        ? error
        : error.message || JSON.stringify(error);
    return (
      <div className="min-h-[20px]">
        <span className="text-xs text-red">{errorMessage}</span>
      </div>
    );
  }
  return <></>;
};

export const LoginPage = () => {
  const queryClient = useQueryClient();
  const { mutate: doLogin, isPending, isSuccess } = useGetLoginMutation();
  const navigate = useNavigate();
  const loginSchema = z.object({
    email: z.string().min(1, "***Email is required").email("Invalid email"),
    password: z.string().min(8, "***Password must be atleast 8 char"),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      doLogin(value);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      navigate("/", { replace: true });
    }
  }, [isSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700">
      <div className="flex flex-col gap-4 p-8 border shadow-xl bg-white/10 backdrop-blur-md rounded-2xl w-80 border-white/30">
        <div className="flex justify-center items-center">
          {/* <CompanyLogo
            size="xl"
            className="h-20 w-20 bg-white/20 rounded-lg p-2"
            showLoadingState={true}
          /> */}
          <img
            src={Constants.companyLogo}
            className="size-20 rounded-md aspect-square"
            alt="compaylog"
          />
        </div>
        <h1 className="text-2xl font-bold text-center text-white">Login</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="space-y-2">
            <form.Field name="email">
              {(field) => (
                <div className="w-full">
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 text-white placeholder-white rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <div className="w-full">
                  <input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="password"
                    placeholder="password"
                    className="w-full p-2 text-white placeholder-white rounded bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <FieldError field={field} />
                </div>
              )}
            </form.Field>
          </div>

          <button
            className={twMerge(
              "w-full p-2 mt-6 font-semibold text-gray-800 transition bg-white rounded hover:bg-gray-200",
              isPending && "cursor-wait"
            )}
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Icon
                  icon="svg-spinners:180-ring-with-bg"
                  width="16"
                  height="16"
                  className="text-white"
                />{" "}
                Submitting...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
