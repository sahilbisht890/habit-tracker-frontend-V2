import ResponsiveNavbar from "../common/ResponsiveNavbar";
import Footer from "../common/Footer";

export default function RootLayout({ children }) {

    return (
        <div className="relative">
            <ResponsiveNavbar/>
            <main className="">{children}</main>
            <Footer/>
      </div>
    );
}
