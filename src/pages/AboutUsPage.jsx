import React from "react";

const AboutUsPage = () => {
  return (
    <div className="px-5 py-6 font-sans bg-amber-50">
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 py-6">
        <div className="flex-1 flex justify-start">
          <img
            src="https://cuscoperu.b-cdn.net/wp-content/uploads/2024/08/Carretera.jpg"
            alt="Travel"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
        <div className="flex-1 pl-0 md:pl-8">
          <h1 className="text-2xl font-bold text-orange-500 mb-2">Sao Việt</h1>
          <h2 className="text-xl font-semibold text-[#2d7768] mb-4">
            "Niềm tin trên mọi nẻo đường"
          </h2>
          <p className="leading-relaxed text-[#23374d] mb-2">
            Chúng tôi là Công ty TNHH Minh Thành Phát, hoạt động dưới thương
            hiệu Xe SAO VIỆT, với lòng tôn trọng và sự chuyên nghiệp, chúng tôi
            gửi tới quý khách hàng những lời chào trân trọng nhất! Với quy mô
            lớn trong lĩnh vực vận tải hành khách, chúng tôi hiện đang hoạt động
            chuyên tuyến Hà Nội – Lào Cai – Sapa
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
        <div className="flex-1 pl-0 md:pl-8">
          <h1 className="text-2xl font-bold text-orange-500 mb-2">
            Đa dạng sự lựa chọn
          </h1>
          <h2 className="text-xl font-semibold text-[#2d7768] mb-4">
            Chúng tôi cung cấp dịch vụ với 3 dòng xe chính
          </h2>
          <div className="flex flex-row gap-4">
            <h2 className="text-xl font-semibold text-[#2d7768] mb-2">
              ECOMOMY :
            </h2>
            <p className="leading-relaxed text-[#23374d] mb-2">
              Dịch vụ đầy đủ với mức giá ưu đãi
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <h2 className="text-xl font-semibold text-[#2d7768] mb-2">VIP :</h2>
            <p className="leading-relaxed text-[#23374d] mb-2">
              cung cấp dịch vụ tốt nhất với mức giá hợp lý
            </p>
          </div>
          <div className="flex flex-row gap-4">
            <h2 className="text-xl font-semibold text-[#2d7768] mb-2">
              ROYAL :
            </h2>
            <p className="leading-relaxed text-[#23374d] mb-2">
              24 chỗi ngồi mỗi chuyến, không gian rộng rãi, sang trọng.
            </p>
          </div>
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
