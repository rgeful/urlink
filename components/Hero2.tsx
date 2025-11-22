import Link from "next/link";

export default function Hero2() {
  return (
    <section className="w-full flex justify-center px-4 py-18">
      <div className="w-full max-w-[1800px] rounded-[40px] bg-linear-to-br from-[#B4E4FF] via-[#D1F1FF] to-[#E4D7FF] overflow-hidden shadow-xl">
        <div className="flex flex-col items-center gap-12 px-8 py-16 md:flex-row md:items-center md:justify-between">

          <div className="flex w-full justify-center md:w-1/2">
            <div className="relative h-[420px] w-[230px] rotate-5 rounded-4xl bg-white/90 shadow-2xl shadow-sky-200/60 border border-white/60">

              <div className="flex flex-col items-center gap-2 pt-8">
                <div className="h-16 w-16 rounded-full bg-linear-to-tr from-[#B4E4FF] to-[#E4D7FF]" />
                <div className="h-3 w-24 rounded-full bg-slate-200" />
                <div className="h-2 w-32 rounded-full bg-slate-100" />
              </div>

              <div className="mt-6 flex flex-col gap-3 px-5">
                <div className="h-10 rounded-2xl bg-[#B4E4FF]" />
                <div className="h-10 rounded-2xl bg-[#D1F1FF]" />
                <div className="h-10 rounded-2xl bg-[#E4D7FF]" />
              </div>

              <div className="absolute inset-x-0 bottom-6 flex justify-center">
                <div className="h-8 w-24 rounded-full bg-slate-100" />
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
              create and customize
              <br />
              UrLink in minutes
            </h2>

            <p className="mt-4 max-w-md text-sm text-slate-800 md:text-base">
              bring all your socials, links, and posts into one clean profile.
              UrLink gives you a shareable page that feels like a mini social
              feed, not just a list of buttons.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-[#111] px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-300/40 transition hover:translate-y-px hover:bg-black"
              >
                get started for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
