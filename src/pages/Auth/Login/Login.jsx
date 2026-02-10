import { Link, useNavigate } from "react-router-dom";
import { Bus } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";

const Login = () => {
  const { signInUser, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    signInUser(email, password)
      .then((userCredential) => {
        toast.success(`Welcome back, ${email.split("@")[0]} 👋`);
        navigate("/");
      })
      .catch((error) => toast.error(error.message));
  };

  const handleGoogleLogin = () => {
    googleSignIn()
      .then((result) => {
        toast.success(`Welcome, ${result.user.displayName || "User"} 👋`);
        navigate("/");
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="bg-white dark:bg-dark-surface p-6 md:p-10 rounded-3xl border shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Bus className="h-8 w-8 text-brand" />
            <span className="text-2xl font-black uppercase">
              Ticket<span className="text-brand">Bari</span>
            </span>
          </div>
          <h2 className="text-xl font-bold uppercase">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input name="email" type="email" required placeholder="Email" className="input input-bordered w-full" />
          <input name="password" type="password" required placeholder="Password" className="input input-bordered w-full" />

          <button className="btn bg-brand text-white w-full">Sign In</button>
        </form>

        <div className="divider">OR</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-outline w-full flex gap-2 justify-center"
        >
          <FaGoogle /> Sign in with Google
        </button>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-brand font-bold">
            Register
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
