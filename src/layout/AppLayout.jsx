import Header from "@/components/AppLayout/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />
        <Outlet />
      </main>
      <footer className="flex justify-center items-center my-11">
        <div>
          made with ❤️ by{" "}
          <a href="https://www.azedineouhadou.tech/" className="text-blue-400">
            Xperaz
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
