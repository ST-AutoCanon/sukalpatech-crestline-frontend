import ResponsiveNavbar from "../components/Navbar";
export default function Home() {
  return (
    <>
      <ResponsiveNavbar />
    <div className="relative min-h-screen bg-gradient-to-br from-[#0b0f2a] via-[#0f1b4d] to-[#0a1f3f] text-white overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,102,255,0.3),transparent_40%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,115,0,0.25),transparent_40%)]"></div>

      <div className="relative w-full px-6 lg:px-20 py-24 flex flex-col lg:flex-row items-center justify-between">
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Automate Your Bus Body
            <span className="block text-blue-400 mt-2">
              Manufacturing Process
            </span>
          </h1>

          <p className="text-gray-300 text-lg max-w-xl">
            Streamline production, reduce costs, and enhance efficiency with
            AI-driven automation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105 transition-transform duration-300 font-semibold shadow-lg">
              Get Started
            </button>

            <button className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-300 font-semibold shadow-lg">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 mt-12 lg:mt-0 flex justify-center">
          <img
            src="/bus1.png" // 🔥 Replace with your image path
            alt="Bus Automation"
            className="w-full max-w-2xl drop-shadow-[0_0_40px_rgba(0,102,255,0.6)]"
          />
        </div>
      </div>
    </div>
    </>
  );
}
