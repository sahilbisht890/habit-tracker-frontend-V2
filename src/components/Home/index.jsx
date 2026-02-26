import RootLayout from "../Layout/rootlayout";
import HeroSection from "./HeroSection";
import HabitTrackerFeatures from "./FeaturesSection";
import FAQHeroSection from "../FAQ/FAQherosection";


const HomePage = () => {
    return (
        <RootLayout>
             <HeroSection/>
             <HabitTrackerFeatures/>
            <FAQHeroSection isHomePage={true}/>
        </RootLayout>
    )
}

export default HomePage;