import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-transparent bg-white">
      <div className="mx-auto max-w-[1120px] px-5 py-16 md:px-8 md:py-20">
        

        <div className="mx-auto mt-8 max-w-full border-t border-[#e8eaed] md:mt-10" />

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-[13px] tracking-[-0.01em] text-[#6b7280] sm:flex-row sm:items-center md:mt-10">
          <p className="text-center sm:text-left">© 2026 ClosetAI. All rights reserved.</p>
          <p className="text-center sm:text-right"  >
            Designed & Developed by:{" "}
            <Link href="https://github.com/sandeepyadav-24" className="text-[#4b5563]">Sandeep Yadav</Link>
            
          </p>
        </div>
      </div>
    </footer>
  );
};
