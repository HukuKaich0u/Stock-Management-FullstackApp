import ItemRegister from "@/components/item-register";
import ItemView from "@/components/item-view";

const ItemPage = () => {
  return (
    <div className="flex items-start justify-center mt-[50px]">
      <div className="mx-5">
        <ItemRegister />
      </div>
      <div className="mx-5">
        <ItemView />
      </div>
    </div>
  );
};

export default ItemPage;
