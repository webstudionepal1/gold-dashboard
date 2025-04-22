import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { apiClient } from "../utils/ApiGateway";
interface ILogin {
  email: string;
  password: string;
}
export const useGetLoginMutation = () => {
  return useMutation({
    mutationKey: ["user"],
    mutationFn: async (body: ILogin) => {
      const res = await apiClient.post("login", body);
      return res?.data?.data;
    },
    onSuccess: (data) => {
      toast.success("User logged in successfully");
      Cookies.set("_UPLFMMATRIX", data.token);
      Cookies.set("user", data.user);
      // navigate("/", { replace: true });
    },
    onError: (err: string) => {
      toast.error(err);
    },
  });
};


