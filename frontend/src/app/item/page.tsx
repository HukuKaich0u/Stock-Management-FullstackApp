import { ItemRegister, ItemView } from "@/components/about-item";

const itemPage = () => {
  return (
    <div className="flex items-start justify-center mt-[75px]">
      <div className="mx-5">
        <ItemRegister />
      </div>
      <div className="mx-5">
        <ItemView />
      </div>
    </div>
  );
};

export default itemPage;
