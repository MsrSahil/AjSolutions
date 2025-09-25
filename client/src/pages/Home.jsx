import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user, isLogin } = useAuth();

  const location = useLocation().pathname.slice(1);
  console.log(location);

  return (
    <div className="bg-[#222831] min-h-screen flex flex-col">
      {isLogin && user ? (
        <div className="bg-[#222831] flex-1 flex flex-col items-center justify-center px-4 py-8 text-[#EEEEEE]">
          <h1 className="text-4xl font-bold text-[#00ADB5] mb-4 text-center">
            Welcome {user ? user.fullName.split(" ")[0] : "to MyWebApp"}!
          </h1>

          <p className="text-center max-w-xl mb-8">
            This is your home page. From here, you can navigate to your
            dashboard, view tasks, or manage your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-lg bg-[#00ADB5] text-[#222831] font-semibold hover:bg-[#EEEEEE] hover:text-[#222831] transition text-center"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/profile"
              className="px-6 py-3 rounded-lg bg-[#393E46] text-[#EEEEEE] font-semibold hover:bg-[#00ADB5] hover:text-[#222831] transition text-center"
            >
              My Profile
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="flex flex-col items-center justify-center text-center px-6 py-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-[#00ADB5]">MyWebApp</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mb-8 text-[#EEEEEE]/80">
              A simple and powerful MERN app where users can register, log in,
              and submit tasks — with an admin dashboard to review them.
            </p>
            <div className="space-x-4">
              <Link
                to="/signup"
                className="bg-[#00ADB5] text-[#222831] px-6 py-3 rounded-lg font-medium hover:bg-[#393E46] hover:text-[#EEEEEE] transition"
              >
                Get Started
              </Link>
              <Link
                to="/admin"
                className="border border-[#00ADB5] text-[#00ADB5] px-6 py-3 rounded-lg font-medium hover:bg-[#00ADB5] hover:text-[#222831] transition"
              >
                Admin Login
              </Link>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-[#393E46] py-16 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6 rounded-xl bg-[#222831] shadow-md">
                <h2 className="text-2xl font-bold text-[#00ADB5] mb-4">
                  Register
                </h2>
                <p className="text-[#EEEEEE]/80">
                  Create your free account in seconds and start using the
                  platform right away.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#222831] shadow-md">
                <h2 className="text-2xl font-bold text-[#00ADB5] mb-4">
                  Submit Tasks
                </h2>
                <p className="text-[#EEEEEE]/80">
                  Easily submit your work using the input box on your dashboard
                  and track your submissions.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#222831] shadow-md">
                <h2 className="text-2xl font-bold text-[#00ADB5] mb-4">
                  Admin Panel
                </h2>
                <p className="text-[#EEEEEE]/80">
                  Admins can review, manage, and monitor all user submissions in
                  one place.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Footer */}
      <footer className="bg-[#222831] text-center py-6 mt-auto border-t border-[#393E46]">
        <p className="text-[#EEEEEE]/70">
          © {new Date().getFullYear()} MyWebApp. Built with ❤️ using MERN.
        </p>
      </footer>
    </div>
  );
};

export default Home;
