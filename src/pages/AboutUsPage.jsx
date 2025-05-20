import React from "react";

const AboutUsPage = () => {
  return (
    <div className="px-5 py-6 font-sans bg-white">
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 py-6">
        <div className="flex-1 flex justify-start">
          <img
            src="https://cuscoperu.b-cdn.net/wp-content/uploads/2024/08/Carretera.jpg"
            alt="Travel"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
        <div className="flex-1 pl-0 md:pl-8">
          <h1 className="text-2xl font-bold text-[#23374d] mb-2">Sao Việt</h1>
          <h2 className="text-xl font-semibold text-black mb-4">
            "Niềm tin trên mọi nẻo đường"
          </h2>
          <p className="leading-relaxed text-[#23374d] mb-2">
            Roadlines được thành lập năm 2000. Trải qua hơn 20 năm phát triển,
            đặt khách hàng là trọng tâm, chúng tôi luôn không ngừng cải tiến để
            mang đến chất lượng dịch vụ tốt nhất cho khách hàng.
          </p>
          <p className="leading-relaxed text-[#23374d]">
            Với đội ngũ nhân viên chuyên nghiệp và tận tâm, chúng tôi cung cấp
            các dịch vụ vận chuyển đa dạng và linh hoạt, đảm bảo độ an toàn cao
            và đúng hẹn, đồng thời tạo ra trải nghiệm thoải mái và tiện lợi cho
            khách hàng.
          </p>
        </div>
      </section>
      {/* //các dòng xe */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 py-6">
        <div className="flex-1 flex justify-start">
          <h1 className="text-2xl font-bold text-[#23374d] mb-2">ROADLINES</h1>
          <h2 className="text-xl font-semibold text-black mb-4">
            "Chất lượng là danh dự"
          </h2>
          <p className="leading-relaxed text-[#23374d] mb-2"></p>
          <p className="leading-relaxed text-[#23374d]"></p>
        </div>
        <div className="flex-1 pl-0 md:pl-8">
          <img
            src="https://cuscoperu.b-cdn.net/wp-content/uploads/2024/08/Carretera.jpg"
            alt="Travel"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
