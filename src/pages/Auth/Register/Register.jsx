import { Link, useNavigate } from "react-router-dom";
import { Bus } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { updateProfile } from "firebase/auth";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

const Register = () => {
  const { registerUser, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const form = e.target;
    const name = form.name.value;
    const photoFile = form.photo.files[0];
    const email = form.email.value;
    const password = form.password.value;

    // Password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!hasUpperCase || !hasLowerCase) {
      toast.error("Password must contain Upper & Lowercase letters");
      return;
    }
    if (!hasNumber) {
      toast.error("Password must include a number");
      return;
    }
    if (!hasSpecialChar) {
      toast.error("Password must include a special character");
      return;
    }

    const toastId = toast.loading("Creating account and uploading photo...");

    try {
     
      const formData = new FormData();
      formData.append("image", photoFile);
      
      const imgRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, 
        formData
      );

      const photoURL = imgRes.data.data.display_url;

      
      const userCredential = await registerUser(email, password);
      const user = userCredential.user;

      
      await updateProfile(user, {
        displayName: name,
        photoURL: photoURL,
      });


const userInfo = {
  name,
  email,
  profilePic: photoURL,
  role: "user",
  vendorRequest: null,
  isFraud: false,
};

await axios.post("https://ticketbari-server123.vercel.app/users", userInfo);




      toast.success(`Registration successful 🎉 Welcome, ${name}`, { id: toastId });
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleGoogleRegister = () => {
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
      <div className="bg-white dark:bg-dark-surface p-6 md:p-10 rounded-3xl border shadow-2xl max-w-lg mx-auto my-10">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Bus className="h-8 w-8 text-brand" />
            <span className="text-2xl font-black uppercase">
              Ticket<span className="text-brand">Bari</span>
            </span>
          </div>
          <h2 className="text-xl font-bold uppercase">Join TicketBari</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="form-control">
            <input
              name="name"
              type="text"
              required
              placeholder="Full Name"
              className="input input-bordered w-full rounded-xl"
            />
          </div>
          
          <div className="form-control">
            <label className="label-text font-bold mb-1 ml-1">Profile Photo</label>
            <input
              name="photo"
              type="file"
              required
              accept="image/*"
              className="file-input file-input-bordered w-full rounded-xl"
            />
          </div>

          <div className="form-control">
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="input input-bordered w-full rounded-xl"
            />
          </div>

          <div className="form-control">
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="input input-bordered w-full rounded-xl"
            />
          </div>

          <button type="submit" className="btn bg-brand hover:bg-brand/90 text-white w-full rounded-xl border-none">
            Register Account
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          className="btn btn-outline w-full flex gap-2 justify-center rounded-xl"
        >
          <FaGoogle /> Sign in with Google
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-brand font-bold">
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;