import React from "react";
import {
  MapPinned,
  Search,
  Bus,
  CreditCard,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import busSearchBG from "../assets/busSearchBG.jpg";
import noiThat1 from "../assets/noiThat1.jpg";

const AboutUsPage = () => {
  const steps = [
    {
      icon: Search,
      title: "Lựa chọn hành trình",
      description: 'Chọn thông tin hành trình ấn "Tìm chuyến xe"',
      color: "text-orange-500",
    },
    {
      icon: Bus,
      title: "Chọn chuyến",
      description: 'Chọn chuyến phù hợp ấn "Đặt chỗ"',
      color: "text-orange-500",
    },
    {
      icon: CreditCard,
      title: "Thanh toán",
      description: 'Chọn cổng thanh toán ấn "Thanh toán"',
      color: "text-orange-500",
    },
    {
      icon: CheckCircle,
      title: "Xác nhận",
      description: "Nhận thông tin đặt xe thành công và lên xe",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="px-5 py-6 font-sans bg-amber-50">
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 py-6">
        <div className="flex-1 flex justify-start">
          <img
            src={busSearchBG}
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
            src={noiThat1}
            alt="Travel"
            className="max-w-full h-auto rounded-xl"
          />
        </div>
      </section>
      <div className="flex flex-col pt-8">
        <div className="text-3xl items-center justify-center text-center font-bold text-orange-500 mb-4">
          <h2>Dễ dàng đặt vé với 4 bước</h2>
        </div>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="flex flex-col lg:flex-row items-center"
              >
                {/* Step Card */}
                <div className=" rounded-lg  p-6 w-full max-w-xs text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24  rounded-full flex items-center justify-center">
                      <IconComponent className={`w-12 h-12 ${step.color}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center justify-center mx-4">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}

                {index < steps.length - 1 && (
                  <div className="lg:hidden flex items-center justify-center my-4 rotate-90">
                    <ChevronRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-8 pl-10 w-[80%] text-xl">
        <h2 className="text-3xl font-bold text-[#2d7768] mb-4 text-left">
          Những tiện ích khi chọn dịch vụ vận chuyển hành khách xe Sao Việt
        </h2>
        <p className="w-2/3">
          Theo nhiều khách hàng đánh giá, nhà xe Sao Việt không chỉ có kinh
          nghiệm lâu năm mà còn mang đến dịch vụ tiện lợi, hãy cùng xem qua một
          số tiện ích sẵn có tại nhà xe:
        </p>
        <ul className="list-disc pl-6 mt-4 space-y-2 ml-9 ">
          <li className="pt-3">
            Xe hiện đại, nhiều lựa chọn: Xe VIP từ giường nằm 44 chỗ rộng rãi
            đến Limousine 21 phòng sang trọng. Xe được trang bị điều hòa, WiFi,
            nước uống miễn phí, màn hình xem phim giải trí.
          </li>
          <li className="pt-3">
            Lịch trình linh hoạt: Nhiều chuyến xe luân phiên mỗi ngày giúp quý
            khách hàng dễ dàng hơn trong việc chọn giờ khởi hành phù hợp.
          </li>
          <li className="pt-3">
            Hỗ trợ chuyên nghiệp: Tổng đài luôn trực sẵn để hỗ trợ khách hàng
            với thái độ niềm nở nhiệt tình, sẵn sàng giải đáp và đặt vé nhanh
            chóng.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUsPage;
