import Subtext from "./CommonSubtext";
import Heading from "./CommonHeading";
const HorizontalHeader = ({ title, subtext }) => {
  const cleanTitle = title.replace(/\n/g, " ");

  return (
    <div className="flex flex-col md:flex-col lg:flex-row items-start  mb-6 md:mb-10 lg:mb-16 justify-between w-[96%] md:w-[90%] lg:w-[80%] mx-auto">
      <div className="block">
        <Heading title={title} />
      </div>
      <div className="md:w-[600px] lg:w-[480px] mt-6 md:mt-4 lg:mt-0 text-center  md:text-center lg:text-left">
        <Subtext subtext={subtext} />
      </div>
    </div>
  );
};

export default HorizontalHeader;
