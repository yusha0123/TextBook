"use client";

type ToggleProps = {
  deletePost: () => void;
  setToggle: (toggle: boolean) => void;
};

export default function Toggle({ deletePost, setToggle }: ToggleProps) {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setToggle(false);
      }}
      className="fixed bg-black/50 w-full h-full z-20 left-0 top-0 "
    >
      <div className="absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 rounded-lg flex flex-col gap-6 w-11/12 md:w-4/12 lg:2/12">
        <h2 className="text-xl text-center">
          Are you sure, you want to delete this Post?
        </h2>
        <button
          onClick={deletePost}
          className="bg-red-600 text-sm text-white py-2 px-4 rounded-md"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
